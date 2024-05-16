import React, { useState, useEffect } from 'react';
import { View, Text, Image, Animated, StyleSheet } from 'react-native';
import AuthNavigation from './AuthNavigation';
import 'react-native-gesture-handler';
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
    setTimeout(() => {
      setShowOpeningScreen(false);
    }, 3000); // Adjust as needed
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
