import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Image, Alert } from 'react-native';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import * as ImagePicker from 'expo-image-picker';
import {firebase, storage, db} from '../../firebase'
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { v4 as uuidv4 } from 'uuid';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';



const EventForm = ({navigation}) => {
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [image, setImage] = useState(null);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isTimePickerVisible, setTimePickerVisibility] = useState(false);
  const [location, setLocation] = useState('');
  


  

  const handleDateConfirm = (selectedDate = new Date()) => {
    setDate(selectedDate.toISOString().split('T')[0]);
    setDatePickerVisibility(false);
  };

  const handleTimeConfirm = (selectedTime = new Date()) => {
    setTime(selectedTime.toLocaleTimeString());
    setTimePickerVisibility(false);
  };





  


  const [currentLoggedInUser, setCurrentLoggedInUser] = useState(null)

    const getUsername = () =>{
        const user = firebase.auth().currentUser
        const unsubscribe = db.collection('users')
        .where('owner_uid', '==' ,user.uid ).limit(1).onSnapshot(
          snapshot => snapshot.docs.map(doc => {
              setCurrentLoggedInUser({
                username: doc.data().username,

              })
          })
        )
        return unsubscribe
    }

    useEffect(() => {
        getUsername()
    },[])

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
      multiple: true,
    });

    console.log(result);

    if (!result.cancelled) {
      const selectedImages = result.assets.map(asset => asset.uri);
      setImage(selectedImages[0]); // Assuming you want to set only one image
    }
  };

  const uploadEvent = async () => {
    const user = firebase.auth().currentUser;
    const userRef = db.collection('users').doc(user.email);
    try {
      if (!image) {
        Alert.alert('Error', 'Please select an image for the event.');
        return;
      }
  
      const response = await fetch(image);
      const blob = await response.blob();
      const timestamp = new Date().getTime();
      const randomNum = Math.floor(Math.random() * 1000000); // Generate a random number between 0 and 999999
      const imageName = `${user.email}/events/${timestamp}-${randomNum}.png`;

      const imageRef = ref(storage, imageName);
      await uploadBytes(imageRef, blob);
  
      const imageUrl = await getDownloadURL(imageRef);
  
      await firebase.firestore().collection(`users`).doc(user.email).collection(`events`).add({
        title: title,
        desc: desc,
        date: date,
        time: time,
        location: location,
        imageUrl: imageUrl,
        username: currentLoggedInUser.username,
        owner_uid: user.uid,
        owner_email: user.email,
        registered: [],
      });
  
      Alert.alert('Success', 'Event uploaded successfully!');
      navigation.navigate('EventScreen') 
    } catch (error) {
      Alert.alert('Error', 'Failed to upload event. Please try again later.');
      console.error('Error uploading event:', error);
    }
    // if(image == null) return;
    // const imageref = ref(storage, `${image.name + uuidv4()}`);
    // uploadBytes(imageref, image).then(() => {
    //   console.log("image uploaded")
    // })

    // try {
    //   const storageRef = storage().ref(`event_images/${userId}/${Date.now()}`);
    //   await storageRef.putFile(image.uri);
    //   const imageUrl = await storageRef.getDownloadURL();
      
    //   await firebase.firestore().collection(`users/${userId}/events`).add({
    //     title: title,
    //     desc: desc,
    //     date: date,
    //     time: time,
    //     imageUrl: imageUrl,
    //   });

    //   Alert.alert('Success', 'Event uploaded successfully!');
    // } catch (error) {
    //   Alert.alert('Error', 'Failed to upload event. Please try again later.');
    //   console.error('Error uploading event:', error);
    // }
  };

  return (
    <View>
      <TextInput
        placeholder="Event Title"
        value={title}
        onChangeText={setTitle}
        style={{paddingTop:40}}
      />
      <TextInput
        placeholder="Event Description"
        value={desc}
        onChangeText={setDesc}
      />
      <TextInput
      placeholder='Event Loaction'
      value={location}
      onChangeText={setLocation}
      />
      <Button title="Select Date" onPress={() => setDatePickerVisibility(true)} />
      <Text>Date: {date}</Text>
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleDateConfirm}
        onCancel={() => setDatePickerVisibility(false)}
      />
      <Button title="Select Time" onPress={() => setTimePickerVisibility(true)} />
      <Text>Time: {time}</Text>
      <DateTimePickerModal
        isVisible={isTimePickerVisible}
        mode="time"
        onConfirm={handleTimeConfirm}
        onCancel={() => setTimePickerVisibility(false)}
      />
      
      <Button title="Select Image" onPress={pickImage} />
      {image && <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />}
      <Button title="Upload Event" onPress={()=>uploadEvent(navigation)} />
    </View>
  );
};

export default EventForm;
