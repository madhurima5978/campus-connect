
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
