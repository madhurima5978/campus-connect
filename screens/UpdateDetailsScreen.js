import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { firebase, db } from '../firebase'; // Assuming you have firebase setup correctly

const UpdateDetails = () => {
  const [userDetails, setUserDetails] = useState({
    displayName: '',
    email: '',
  });
  const [newDisplayName, setNewDisplayName] = useState('');

  useEffect(() => {
    const user = firebase.auth().currentUser;
    const unsubscribe = firebase.auth().onAuthStateChanged(user => {
      if (user) {
        // Fetch user details from Firebase using user.email
        db.collection('users')
          .doc(user.email)
          .get()
          .then(doc => {
            if (doc.exists) {
              setUserDetails(doc.data());
            } else {
              console.log('No such document!');
            }
          })
          .catch(error => {
            console.log('Error getting document:', error);
          });
      }
    });
    return () => unsubscribe();
  }, []);
  const handleDisplayNameChange = text => {
    setNewDisplayName(text);
  };
  const handleSubmit = () => {
    const user = firebase.auth().currentUser;
    if (user) {
      db.collection('users')
        .doc(user.email)
        .update({
          username: newDisplayName,
        })
        .then(() => {
          console.log('Document successfully updated!');
          setUserDetails({ ...userDetails, username: newDisplayName });
          setNewDisplayName('');
        })
        .catch(error => {
          console.error('Error updating document: ', error);
        });
    } else {
      console.error('No user is logged in');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Username: </Text>
      <TextInput
        style={styles.input}
        value={newDisplayName}
        onChangeText={handleDisplayNameChange}
      />
      <Button title="Submit" onPress={handleSubmit} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    marginBottom: 10,
  },
  input: {
    width: '80%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
  },
});

export default UpdateDetails;
