import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { firebase, db } from '../../firebase';

const UserProfileHeader = ({ navigation }) => {
  const [currentLoggedInUser, setCurrentLoggedInUser] = useState(null);

  const getUsername = () => {
    const user = firebase.auth().currentUser;
    const unsubscribe = db.collection('users')
      .where('owner_uid', '==', user.uid)
      .limit(1)
      .onSnapshot(snapshot => {
        snapshot.docs.forEach(doc => {
          setCurrentLoggedInUser({
            username: doc.data().username,
          });
        });
      });
    return unsubscribe;
  };

  useEffect(() => {
    const unsubscribe = getUsername();
    return () => {
      unsubscribe(); // Unsubscribe from Firebase listener when component unmounts
    };
  }, []);

  return (
    <View style={styles.container}>
      {currentLoggedInUser ? (
        <>
          <Text style={{ fontWeight: '700', fontSize: 20 }}>{currentLoggedInUser.username}</Text>
          <TouchableOpacity onPress={() => navigation.openDrawer()}>
            <Image source={require('../../assets/menu.png')} style={{ width: 20, height: 20 }} />
          </TouchableOpacity>
        </>
      ) : (
        <Text>Loading...</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginLeft: 20,
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%',
    marginBottom: 10,
  },
});

export default UserProfileHeader;
