import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Divider } from 'react-native-elements';
import { SafeAreaView, useRoute } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

const TopTabs = () => {

  
  const navigation = useNavigation();

  const handleTabPress = (tabName) => {
    console.log('Tab Pressed:', tabName);
    // Navigate to the correct screen based on the selected tab
    navigation.navigate('EventScreen', { screen: tabName });
  };
  
  return (
    <SafeAreaView style={styles.wrapper}>
      <Divider width={1} orientation="vertical" />
      <View style={styles.container}>
        {/* Live Events */}
        <TouchableOpacity onPress={() => handleTabPress('Live')}>
          <Text style={{ backgroundColor: '#d6d6c2', borderRadius: 30, padding: 10 }}>Live Events</Text>
        </TouchableOpacity>

        {/* Upcoming Events*/}
        <TouchableOpacity onPress={() => handleTabPress('Upcoming')}>
          <Text style={{ backgroundColor: '#d6d6c2', borderRadius: 30, padding: 10 }}> Upcoming Events</Text>
        </TouchableOpacity>

        {/* Past Events */}
        <TouchableOpacity onPress={() => handleTabPress('Past')}>
          <Text style={{ backgroundColor: '#d6d6c2', borderRadius: 30, padding: 10 }}>Past Events </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    width: '100%',
    bottom: '0%',
    zIndex: 999,
    backgroundColor: '#ffffff',
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    height: 50,
    paddingTop: 10,
  },
});

export default TopTabs;
