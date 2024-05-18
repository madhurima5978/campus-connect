import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Image, Alert } from 'react-native';
import { firebase, storage, db } from '../../firebase';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { Formik } from 'formik';
import * as ImagePicker from 'expo-image-picker';
import * as Yup from 'yup';
import validUrl from 'valid-url';

const PLACEHOLDER_IMG = 'https://t4.ftcdn.net/jpg/05/17/53/57/360_F_517535712_q7f9QC9X6TQxWi6xYZZbMmw5cnLMr279.jpg';

const uploadPostSchema = Yup.object().shape({
    caption: Yup.string().max(2200, 'Caption has reached the maximum characters'),
});

const FormikPostUploader = ({ navigation }) => {
    const [thumbnailUrl, setThumbnailUrl] = useState(PLACEHOLDER_IMG);
    const [currentLoggedInUser, setCurrentLoggedInUser] = useState(null);

    const getUsername = () => {
        const user = firebase.auth().currentUser;
        const unsubscribe = db.collection('users')
            .where('owner_uid', '==', user.uid).limit(1).onSnapshot(
                snapshot => snapshot.docs.map(doc => {
                    setCurrentLoggedInUser({
                        username: doc.data().username,
                    });
                })
            );
        return unsubscribe;
    };

    useEffect(() => {
        getUsername();
    }, []);

    const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
        multiple: true,
    });

    if (!result.cancelled) {
      const selectedImages = result.assets.map(asset => asset.uri);
      setThumbnailUrl(selectedImages[0]);
  }
};

    const uploadPostToFirebase = async (imageUrl, caption) => {
        const user = firebase.auth().currentUser;
        const userRef = db.collection('users').doc(user.email);

        try {
            if (!thumbnailUrl) {
                Alert.alert('Error', 'Please select an image for the post.');
                return;
            }

            const response = await fetch(thumbnailUrl);
            const blob = await response.blob();

            const timestamp = new Date().getTime();
            const randomNum = Math.floor(Math.random() * 1000000);
            const imageName = `${user.email}/posts/${timestamp}-${randomNum}.png`;

            const imageRef = ref(storage, imageName);
            await uploadBytes(imageRef, blob);

            const imageURL = await getDownloadURL(imageRef);

            await userRef.collection('posts').add({
                imageUrl: imageURL,
                username: currentLoggedInUser.username,
                owner_uid: user.uid,
                owner_email: user.email,
                caption: caption,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                likes_by_users: [],
            });

            Alert.alert('Success', 'Post uploaded successfully!');
            navigation.goBack();
        } catch (error) {
            Alert.alert('Error', 'Failed to upload post. Please try again later.');
            console.error('Error uploading post:', error);
        }
    };

    return (
        <Formik
            initialValues={{ caption: '', imageUrl: '' }}
            onSubmit={(values) => uploadPostToFirebase(values.imageUrl, values.caption)}
            validationSchema={uploadPostSchema}
            validateOnMount={true}
        >
            {({ handleBlur, handleChange, handleSubmit, values, errors, isValid }) => (
                <>
                    <View style={{ flexDirection: 'row', marginBottom: 20 }}>
                        <Image source={{ uri: validUrl.isUri(thumbnailUrl) ? thumbnailUrl : PLACEHOLDER_IMG }} style={{ width: 100, height: 100 }} />
                        <View style={{ flex: 1, padding: 5 }}>
                            <TextInput
                                style={{ color: 'black', fontSize: 18 }}
                                multiline={true}
                                placeholder='Write a caption'
                                onChangeText={handleChange('caption')}
                                onBlur={handleBlur('caption')}
                                value={values.caption}
                            />
                        </View>
                    </View>
                    <Button title="Pick Image" onPress={pickImage} />
                    {errors.imageUrl && (
                        <Text style={{ fontSize: 10, color: 'red' }} >
                            {errors.imageUrl}
                        </Text>
                    )}
                    <Button onPress={handleSubmit} title='Share' disabled={!isValid} />
                </>
            )}
        </Formik>
    );
};

export default FormikPostUploader;
