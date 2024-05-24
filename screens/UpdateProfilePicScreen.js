import { SafeAreaView } from 'react-native-safe-area-context'
import React, { useState } from 'react';
import { View, Text, Image, Button, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { firebase, storage, db } from '../firebase';
import { ref, uploadBytes, getDownloadURL,deleteObject } from "firebase/storage";
const UpdateProfilePicScreen = ({ userEmail }) => {
  const [profilePicture, setProfilePicture] = useState(null);

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
    setProfilePicture(selectedImages[0]);
}
};
  

const uploadProfilePicture = async () => {
  const user = firebase.auth().currentUser;
  const userRef = db.collection('users').doc(user.email);
  
  try {
    if (!profilePicture) {
      Alert.alert('Error', 'Please select an image for the post.');
      return;
    }

    const response = await fetch(profilePicture);
    const blob = await response.blob();

    const timestamp = new Date().getTime();
    const randomNum = Math.floor(Math.random() * 1000000);
    const imageName = `${user.email}/profile_picture/${timestamp}-${randomNum}.png`;

    // Delete existing profile picture from Firebase Storage
    const userData = await userRef.get();
    const existingProfilePictureURL = userData.data().profile_picture;
    
    const imageRef = ref(storage, imageName);
    await uploadBytes(imageRef, blob);

    const imageURL = await getDownloadURL(imageRef);

    // Update user's profile picture URL in Firestore
    await userRef.update({ profile_picture: imageURL });

    Alert.alert('Success', 'Profile picture updated successfully!');
    console.log('Profile picture uploaded successfully:', imageURL);
  } catch (error) {
    Alert.alert('Error', 'Failed to upload profile picture. Please try again later.');
    console.error('Error uploading profile picture:', error);
  }
};


  return (
    <SafeAreaView style={{paddingTop:20}}>
      <Button title="Pick Profile Picture" onPress={pickImage} />
      {profilePicture && (
        <View>
          <Image source={{ uri: profilePicture }} style={{ width: 200, height: 200 }} />
          <Button title="Upload Profile Picture" onPress={uploadProfilePicture} />
        </View>
      )}
    </SafeAreaView>
  );
};

export default UpdateProfilePicScreen;
