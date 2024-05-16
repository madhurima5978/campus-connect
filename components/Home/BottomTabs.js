import React, { useState } from 'react';
import { View, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Divider } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';

export const bottomTabIcons = [
  {
    name: 'Home',
    active: require('../../assets/home_active.png'),
    inactive: require('../../assets/home_inactive.png'),
  },
  {
    name: 'Event',
    active: require('../../assets/event_active.png'),
    inactive: require('../../assets/event_inactive.png'),
  },
  {
    name: 'NewPost',
    active: require('../../assets/add.png'),
    inactive: require('../../assets/add.png'),
  },
  {
    name: 'Room',
    active: require('../../assets/room_active.png'),
    inactive: require('../../assets/room_inactive.png'),
  },
  {
    name: 'UserProfile',
    active: require('../../assets/profile_active.png'),
    inactive: require('../../assets/profile_inactive.png'),
  },
];

const BottomTabs = ({ icons }) => {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState('Home');

  const handleTabPress = (tabName) => {
    console.log('Current active tab:', activeTab);
    console.log('Pressed tab:', tabName);
  
    if (navigation && activeTab.toLowerCase() !== tabName.toLowerCase()) {
      console.log('Updating active tab...');
      setActiveTab(tabName);
      navigation.navigate(tabName+'Screen');
    }
  };

  return (
    <View style={styles.wrapper}>
      <Divider width={1} orientation="vertical" />
      <View style={styles.container}>
        {/* Home Button */}
        <TouchableOpacity onPress={() => handleTabPress('Home')}>
          <Image
            source={activeTab === 'Home' ? bottomTabIcons[0].active : bottomTabIcons[0].inactive}
            style={styles.icon}
          />
        </TouchableOpacity>

        {/* Event Button */}
        <TouchableOpacity onPress={() => handleTabPress('Event')}>
          <Image
            source={activeTab === 'Event' ? bottomTabIcons[1].active : bottomTabIcons[1].inactive}
            style={styles.icon}
          />
        </TouchableOpacity>

        {/* Add Post Button */}
        <TouchableOpacity onPress={() => handleTabPress('NewContent')}>
          <Image
            source={activeTab === 'add_post' ? bottomTabIcons[2].active : bottomTabIcons[2].inactive}
            style={styles.icon}
          />
        </TouchableOpacity>
        {/*room screen*/}
        <TouchableOpacity onPress={() => handleTabPress('Room')}>
          <Image
            source={activeTab === 'Room' ? bottomTabIcons[3].active : bottomTabIcons[3].inactive}
            style={styles.icon}
          />
        </TouchableOpacity>

        {/* Profile Button */}
        <TouchableOpacity onPress={() => handleTabPress('UserProfile')}>
          <Image
            source={activeTab === 'UserProfile' ? bottomTabIcons[4].active : bottomTabIcons[4].inactive}
            style={styles.icon}
          />
        </TouchableOpacity>
      </View>
    </View>
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
  icon: {
    width: 30,
    height: 30,
  },
});

export default BottomTabs;
