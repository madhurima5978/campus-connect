import React, { useState, useEffect } from 'react';
import { View, Text, Button, FlatList, Image, StyleSheet } from 'react-native';
import { firebase, firestore } from '../../firebase';

const Participants = ({ route, navigation }) => {
  const { roomId } = route.params;
  const [participants, setParticipants] = useState([]);

  useEffect(() => {
    const fetchParticipants = async () => {
      try {
        const participantsSnapshot = await firestore.collection('Rooms')
          .doc(roomId)
          .collection('participants')
          .get();

        const participantsList = participantsSnapshot.docs.map(async doc => {
          const userData = doc.data();
          const userProfile = await firestore.collection('users').doc(userData.email).get();
          return {
            id: doc.id,
            email: userData.email,
            profilePicture: userProfile.data().profile_picture,
          };
        });

        Promise.all(participantsList).then(participants => {
          setParticipants(participants);
        });
      } catch (error) {
        console.error('Error fetching participants:', error);
      }
    };

    fetchParticipants();
  }, [roomId]);

  useEffect(() => {
    const deleteRoomIfNoParticipants = async () => {
      if (participants.length === 0) {
        try {
          await firestore.collection('Rooms').doc(roomId).delete();
          console.log('Room deleted successfully');
          navigation.goBack();
        } catch (error) {
          console.error('Error deleting room:', error);
        }
      }
    };

    deleteRoomIfNoParticipants();
  }, [participants, roomId, navigation]);

  const handleLeaveGroup = async () => {
    try {
      const user = firebase.auth().currentUser;
      if (user) {
        const participantRef = firestore.collection('Rooms').doc(roomId).collection('participants').doc(user.email);
        await participantRef.delete();
        console.log('User left the group successfully');
      }
      navigation.goBack();
    } catch (error) {
      console.error('Error leaving group:', error);
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={participants}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.participantContainer}>
            <Image source={{ uri: item.profilePicture }} style={styles.profilePicture} />
            <Text style={styles.participantText}>{item.email}</Text>
          </View>
        )}
      />
      <View style={styles.leaveButton}>
        <Button title="Leave Group" onPress={handleLeaveGroup} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  participantContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  profilePicture: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  participantText: {
    fontSize: 16,
  },
  leaveButton: {
    marginBottom: 50,
  },
});

export default Participants;
