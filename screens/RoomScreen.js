// import React from "react";
// import { NavigationContainer } from "@react-navigation/native";
// import { createStackNavigator } from "@react-navigation/stack";
// import Home from "./RoomHomeScreen";
// import MeetingRoom from "./RoomMeetingRoom";
// import {StyleSheet } from 'react-native'

// import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';


// const Tab = createMaterialTopTabNavigator();

// function Navigation() {
  
//   return (
//     <Tab.Navigator style={styles.container}>
//       <Tab.Screen name="Home" component={Home} />
//       <Tab.Screen name="Meeting Room" component={MeetingRoom} />
//   </Tab.Navigator>

//     // <NavigationContainer>
//     //   <Stack.Navigator initialRouteName="Home">
//     //     <Stack.Screen
//     //       name="Home"
//     //       component={Home}
//     //       options={{
//     //         headerShown: false,
//     //       }}
//     //     />
//     //     <Stack.Screen
//     //       name="Room"
//     //       component={MeetingRoom}
//     //       options={{
//     //         title: "Start a Meeting",
//     //         headerStyle: {
//     //           backgroundColor: "#1c1c1c",
//     //           shadowOpacity: 0,
//     //         },
//     //         headerTintColor: "white",
//     //       }}
//     //     />
//     //   </Stack.Navigator>
//     // </NavigationContainer>
//   );
// }

// const styles = StyleSheet.create({
//   container:{
//     marginTop: 20,
//   }
// })

// export default Navigation;
// RoomScreen.js
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import ChatRooms from '../components/Room/CreateChatRooms';
import ChatRoom from '../components/Room/ManageChatRoom';
import Participants from '../components/Room/Participants'; // Import Participants component
import { Button } from 'react-native';
const Stack = createStackNavigator();

const RoomScreen = () => {
  return (
    <Stack.Navigator initialRouteName="Rooms">
      <Stack.Screen name="Rooms" component={ChatRooms} />
      <Stack.Screen
        name="ChatRoom"
        component={ChatRoom}
        options={({ route, navigation }) => ({
          headerTitle: route.params.roomName, // Use roomName parameter to set the title
          headerRight: () => (
            <Button
              onPress={() => navigation.navigate('Participants', { roomId: route.params.roomId })}
              title="Participants"
              
            />
          ),
        })}
      />
      <Stack.Screen name="Participants" component={Participants} />
    </Stack.Navigator>
  );
};

export default RoomScreen;
