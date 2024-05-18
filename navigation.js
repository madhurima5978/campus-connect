import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import HomeScreen from './screens/HomeScreen';
import NewPostScreen from './screens/NewPostScreen';
// import EventNav from './screens/EventScreen';
import UserProfileScreen from './screens/UserProfileScreen';
import BottomTabs, { bottomTabIcons } from './components/Home/BottomTabs';
import SettingsScreen from './screens/SettingsScreen';
import {StyleSheet } from 'react-native'
import RoomScreen from './screens/RoomScreen';
import LoginScreen from './screens/LoginScreen';

import CommentScreen from './screens/CommentScreen';
import EventScreen from './screens/EventScreen'
import NewEventScreen from './screens/NewEventScreen';
import SignupScreen from './screens/SignupScreen'


import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import LiveTab from './components/Event/LiveTab';
import UpcomingTab from './components/Event/UpcomingTab';
import PastTab from './components/Event/PastTab';
import TopTabs from './components/Event/TopTabs';
import UpdateDetails from './screens/UpdateDetailsScreen';
import ProfileScreen from './screens/ProfileScreen';
import UpdateProfilePicScreen from './screens/UpdateProfilePicScreen';
import DisplayEventScreen from './screens/DisplayEventScreen';
// import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
// import EventNav from './screens/EventScreen';

const Stack = createStackNavigator();

const screenOptions = {
  headerShown: false,
};




 const SignedOutStack = () => {
  
  return (
    <NavigationContainer>
      <Stack.Navigator
       initialRouteName='LoginScreen' 
      screenOptions={screenOptions}>
        <Stack.Screen name='SignUpScreen' component={SignupScreen}/>
        <Stack.Screen name='LoginScreen' component={LoginScreen}/>
      </Stack.Navigator>
      
      
    </NavigationContainer>
  );
};

 const SignedInStack = () => {
  
  return (
    <NavigationContainer>
      <Stack.Navigator
       initialRouteName='HomeScreen' 
      screenOptions={screenOptions}>
        <Stack.Screen name='HomeScreen' component={HomeScreen} />
        <Stack.Screen name='EventScreen' component={EventScreen}/>
        <Stack.Screen name='UserProfileScreen' component={UserProfileScreen}/>
        <Stack.Screen name='SettingsScreen' component={SettingsScreen}/>
        <Stack.Screen name='RoomScreen' component={RoomScreen}/>
        <Stack.Screen name='UpdateDetailsScreen' component={UpdateDetails}/>
        <Stack.Screen name='ProfileScreen' component={ProfileScreen}/>
        <Stack.Screen name='CommentScreen' component={CommentScreen} options={({ route }) => ({
        postOwnerEmail: route.params.postOwnerEmail,
        postId: route.params.postId,
        })}/>
        <Stack.Screen name='NewContentScreen' component={CreateNewContent}/>
        <Stack.Screen name='UpdateProfilePicScreen' component={UpdateProfilePicScreen}/>
        <Stack.Screen name='DisplayEventScreen' component={DisplayEventScreen} options={({ route }) => ({
        postOwnerEmail: route.params.ownerEmail,
        eventId: route.params.eventId})}/>
      </Stack.Navigator>
      <BottomTabs icons={bottomTabIcons} />
      
    </NavigationContainer>
  );
};


const Tab = createMaterialTopTabNavigator();

const CreateNewContent = (navigation) => {
  return (
    
      <Tab.Navigator style={styles.container}>
        <Tab.Screen name="New Post" component={NewPostScreen} />
        <Tab.Screen name="New Event" component={NewEventScreen} />
      </Tab.Navigator>
    
  );
};

const styles = StyleSheet.create({
  container:{
    marginTop: 20,
  }
})

export {SignedInStack, SignedOutStack}


// import React from 'react';
// import { NavigationContainer } from '@react-navigation/native';
// import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// import HomeScreen from './screens/HomeScreen';
// import NewPostScreen from './screens/NewPostScreen';
// import UserProfileScreen from './screens/UserProfileScreen';
// import SettingsScreen from './screens/SettingsScreen';
// import RoomScreen from './screens/RoomScreen';
// import LoginScreen from './screens/LoginScreen';
// import SignUpScreen from './screens/SignUpScreen';
// import CommentScreen from './screens/CommentScreen';

// import { bottomTabIcons } from './components/Home/BottomTabs';

// const Tab = createBottomTabNavigator();

// export const SignedOutStack = () => {
//   return (
//     <NavigationContainer>
//       <Tab.Navigator>
//         <Tab.Screen name='SignUpScreen' component={SignUpScreen}/>
//         <Tab.Screen name='LoginScreen' component={LoginScreen}/>
//       </Tab.Navigator>
//     </NavigationContainer>
//   );
// };

// export const SignedInStack = () => {
//   return (
//     <NavigationContainer>
//       <Tab.Navigator >
//         <Tab.Screen name='HomeScreen' component={HomeScreen} />
//         {/* <Tab.Screen name='NewPostScreen' component={NewPostScreen} /> */}
//         <Tab.Screen name='EventTabNav' component={EventTabNav}/>
//         <Tab.Screen name='UserProfileScreen' component={UserProfileScreen}/>
//         {/* <Tab.Screen name='SettingsScreen' component={SettingsScreen}/> */}
//         <Tab.Screen name='RoomScreen' component={RoomScreen}/>
//         {/* <Tab.Screen name='CommentScreen' component={CommentScreen}/> */}
//       </Tab.Navigator>
//     </NavigationContainer>
//   );
// };


// export const EventTabNav = () => {
//   return (
//     <Tab.Navigator style={styles.container}>
//       <Tab.Screen name="Live" component={LiveTab} />
//       <Tab.Screen name="Upcoming" component={UpcomingTab} />
//       <Tab.Screen name="Past" component={PastTab} />
//     </Tab.Navigator>
//   );
// };

// const styles = {
//   container: {
//     paddingBottom: 200,
//   },
// };
