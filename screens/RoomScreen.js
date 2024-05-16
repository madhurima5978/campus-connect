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

import { View, Text } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import Room from '../components/Room/Room'
const RoomScreen = () => {
  return (
    <SafeAreaView>
        <Room/>
    </SafeAreaView>
  )
}

export default RoomScreen