import { View, Text, Image, StyleSheet, Button, Alert, TouchableOpacity } from 'react-native'
import React, { useState, useEffect } from 'react'
import { firebase, db } from '../../firebase'; // Import your Firebase configuration

const UserDetails = ({ navigation }) => {

  const [currentLoggedInUser, setCurrentLoggedInUser] = useState(null);
  const [postCount, setPostCount] = useState(0);
  const [eventCount, setEventCount] = useState(0);
  const [profilePicture, setProfilePicture] = useState(null);

  const getUsername = () => {
    const user = firebase.auth().currentUser;
    if (user) {
      const unsubscribe = db.collection('users')
        .doc(user.email)
        .onSnapshot(doc => {
          setCurrentLoggedInUser(doc.data());
          // Get post count for the current user
          getPostCount(user.uid);
          // Get event count for the current user
          getEventCount(user.uid);
          // Get profile picture for the current user
          setProfilePicture(doc.data().profile_picture);
        });
      return unsubscribe;
    }
  };

  const getPostCount = (userId) => {
    db.collection('posts')
      .where('owner_uid', '==', userId)
      .get()
      .then(querySnapshot => {
        setPostCount(querySnapshot.size);
      })
      .catch(error => {
        console.error('Error getting post count:', error);
      });
  };

  const getEventCount = (userId) => {
    db.collection('events')
      .where('owner_uid', '==', userId)
      .get()
      .then(querySnapshot => {
        setEventCount(querySnapshot.size);
      })
      .catch(error => {
        console.error('Error getting event count:', error);
      });
  };

  useEffect(() => {
    const unsubscribe = getUsername();
    return () => {
      unsubscribe(); // Unsubscribe from Firebase listener when component unmounts
    };
  }, []);

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.navigate('UpdateProfilePicScreen')}>
        <Image source={{ uri: profilePicture }} style={styles.pfp} />
      </TouchableOpacity>

      <View style={styles.postContainer}>
        <Text style={styles.postcount}>{postCount}</Text>
        <Text style={styles.postsText}>Posts</Text>
      </View>
      <View style={styles.EventsContainer}>
        <Text style={styles.postcount}>{eventCount}</Text>
        <Text style={styles.postsText}>hosted</Text>
      </View>
      <View style={styles.EventsContainer}>
        <Text style={styles.postcount}>{eventCount}</Text>
        <Text style={styles.postsText}>Participated</Text>
      </View>

    </View>
  );
};



const styles = StyleSheet.create({
  pfp: {
    width: 90,
    height: 90,
    borderRadius: 50,
    marginLeft: 6,
    marginTop: 20,
    borderWidth: 1.6,
    borderColor: '#ff8501',
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '40%',
  },
  postContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    marginLeft: 30,
    margin: 40,
  },
  EventsContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    marginLeft: 0,
    margin: 40,
  },
  postcount: {
    fontWeight: '800',
    fontSize: 24,
  },
  postsText: {
    marginTop: 5, // Adjust the spacing as needed
  },
});

export default UserDetails;
