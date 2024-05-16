import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { firebase, db } from '../firebase'; // Assuming you have firebase setup correctly

const UpdateDetails = () => {
  const [userDetails, setUserDetails] = useState({
    displayName: '',
    email: '',
    // Add other user details here if needed
  });
  const [newDisplayName, setNewDisplayName] = useState('');

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged(user => {
      if (user) {
        // Fetch user details from Firebase
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
    // Update display name in Firebase
    db.collection('users')
      .doc(firebase.auth().currentUser.uid)
      .update({
        displayName: newDisplayName,
      })
      .then(() => {
        console.log('Document successfully updated!');
        setUserDetails({ ...userDetails, displayName: newDisplayName });
        setNewDisplayName('');
      })
      .catch(error => {
        console.error('Error updating document: ', error);
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Display Name:</Text>
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
