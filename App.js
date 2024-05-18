import React, { useState, useEffect } from 'react';
import { View, Text, Image, Animated, StyleSheet } from 'react-native';
import AuthNavigation from './AuthNavigation';
import { firebase } from './firebase'; // Adjust the import based on your file structure
import 'react-native-gesture-handler';

const requestNotificationPermission = async () => {
  try {
    await firebase.messaging().requestPermission();
    const fcmToken = await firebase.messaging().getToken();
    if (fcmToken) {
      // Store the FCM token in Firestore
      const user = firebase.auth().currentUser;
      await firebase.firestore().collection('users').doc(user.uid).update({
        fcmToken: fcmToken
      });
    }
  } catch (error) {
    console.error('Unable to get permission to notify.', error);
  }
};

const OpeningScreen = () => {
  const [animation, setAnimation] = useState(new Animated.Value(0));

  useEffect(() => {
    Animated.timing(animation, {
      toValue: 1,
      duration: 2000, // Adjust as needed
      useNativeDriver: true,
    }).start();
  }, []);

  const translateY = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -200], // Adjust as needed
  });

  const opacity = animation.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [1, 0.5, 0],
  });

  return (
    <Animated.View style={[styles.container, { opacity }]}>
      <Animated.Image
        source={require('./assets/cc.png')}
        style={[styles.image, { transform: [{ translateY }] }]}
      />
      <Animated.Text style={[styles.text, { transform: [{ translateY }] }]}>
        Campus Connect
      </Animated.Text>
    </Animated.View>
  );
};

const App = () => {
  const [showOpeningScreen, setShowOpeningScreen] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowOpeningScreen(false);
    }, 3000); // Adjust as needed

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged(user => {
      if (user) {
        requestNotificationPermission();
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <>
      {showOpeningScreen ? (
        <OpeningScreen />
      ) : (
        <AuthNavigation />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  image: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default App;
