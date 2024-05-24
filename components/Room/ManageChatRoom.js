import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, FlatList, Text, Image, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { firestore, firebase, storage } from '../../firebase';
import { Audio } from 'expo-av';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

const ChatRoom = ({ route, navigation }) => {
  const { roomId, roomName } = route.params;
  const [recording, setRecording] = useState(null);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [currentLoggedInUser, setCurrentLoggedInUser] = useState(null);
  const [isJoined, setIsJoined] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [selectedMessageId, setSelectedMessageId] = useState(null);
  const [playingAudio, setPlayingAudio] = useState(null);

  useEffect(() => {
    navigation.setOptions({ title: roomName });
    getUsername();
  }, []);

  useEffect(() => {
    const fetchRoomData = async () => {
      try {
        const unsubscribe = firestore.collection('Rooms').doc(roomId).collection('messages')
          .orderBy('createdAt')
          .onSnapshot(snapshot => {
            const messagesList = snapshot.docs.map(async doc => {
              const messageData = doc.data();
              const userProfile = await firestore.collection('users').doc(messageData.email).get();
              return {
                id: doc.id,
                ...messageData,
                profilePicture: userProfile.data().profile_picture,
              };
            });

            Promise.all(messagesList).then(messages => {
              setMessages(messages);
            });
          });

        return () => unsubscribe();
      } catch (error) {
        console.error('Error fetching room data:', error);
      }
    };

    if (roomId) {
      fetchRoomData();
    }

    // Check if the user has already joined the room
    checkIfUserJoinedRoom();
  }, [roomId]);

  useEffect(() => {
    const unsubscribe = firestore.collection('Rooms').doc(roomId).collection('participants')
      .onSnapshot(snapshot => {
        const participants = snapshot.docs.map(doc => doc.id);
        setIsJoined(participants.includes(currentLoggedInUser?.email));
      });

    return () => unsubscribe();
  }, [currentLoggedInUser, roomId]);

  const getUsername = () => {
    const user = firebase.auth().currentUser;
    const unsubscribe = firestore.collection('users')
      .where('owner_uid', '==', user.uid).limit(1).onSnapshot(
        snapshot => snapshot.docs.map(doc => {
          setCurrentLoggedInUser({
            username: doc.data().username,
            profilePicture: doc.data().profile_picture,
            email: doc.id,
          });
        })
      );
    return unsubscribe;
  };

  const checkIfUserJoinedRoom = async () => {
    try {
      const user = firebase.auth().currentUser;
      if (!user) {
        console.error('No user is logged in');
        return;
      }

      const participantRef = firestore.collection('Rooms').doc(roomId).collection('participants').doc(user.email);
      const participantDoc = await participantRef.get();

      if (participantDoc.exists) {
        setIsJoined(true); // User has already joined the room
      } else {
        setIsJoined(false); // User has not joined the room
      }
    } catch (error) {
      console.error('Error checking if user joined room:', error);
    }
  };

  const handleJoinRoom = async () => {
    try {
      const user = firebase.auth().currentUser;
      if (!user) {
        console.error('No user is logged in');
        return;
      }

      const participantRef = firestore.collection('Rooms').doc(roomId).collection('participants').doc(user.email);
      const participantDoc = await participantRef.get();

      if (!participantDoc.exists) {
        await participantRef.set({
          email: user.email,
          username: currentLoggedInUser.username,
        });
      }

      console.log('User joined the room successfully');
    } catch (error) {
      console.error('Error joining the room:', error);
    }
  };

  const handleSendMessage = async () => {
    try {
      if (message.trim() === '') {
        // If the message is empty or contains only whitespace, return without sending
        return;
      }
  
      const user = firebase.auth().currentUser;
  
      const messageRef = firestore.collection('Rooms').doc(roomId).collection('messages');
  
      await messageRef.add({
        text: message,
        createdAt: new Date(),
        displayName: currentLoggedInUser.username,
        email: user.email,
      });
  
      console.log('Message sent successfully');
      setMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };
  
  const handleDeleteMessage = async () => {
    try {
      await firestore.collection('Rooms').doc(roomId).collection('messages').doc(selectedMessageId).delete();
      setDeleteModalVisible(false);
      console.log('Message deleted successfully');
    } catch (error) {
      console.error('Error deleting message:', error);
    }
  };

  const startRecording = async () => {
    try {
      console.log('Requesting permissions..');
      await Audio.requestPermissionsAsync();

      console.log('Starting recording..');
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording } = await Audio.Recording.createAsync(
        Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
      );
      setRecording(recording);
      console.log('Recording started');
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  };

  const stopRecording = async () => {
    console.log('Stopping recording..');
    setRecording(undefined);
    await recording.stopAndUnloadAsync();
    const uri = recording.getURI();
    console.log('Recording stopped and stored at', uri);
    uploadVoiceMessage(uri);
  };

  const uploadVoiceMessage = async (uri) => {
    try {
      const user = firebase.auth().currentUser;
      const response = await fetch(uri);
      const blob = await response.blob();

      const timestamp = new Date().getTime();
      const randomNum = Math.floor(Math.random() * 1000000);
      const audioName = `${user.email}/voice_messages/${timestamp}-${randomNum}.m4a`;

      const audioRef = ref(storage, audioName);
      await uploadBytes(audioRef, blob);

      const audioURL = await getDownloadURL(audioRef);

      await firestore.collection('Rooms').doc(roomId).collection('messages').add({
        audio: audioURL,
        createdAt: new Date(),
        displayName: currentLoggedInUser.username,
        email: user.email,
      });

      console.log('Voice message uploaded successfully:', audioURL);
    } catch (error) {
      console.error('Error uploading voice message:', error);
    }
  };

  const playAudio = async (uri) => {
    if (playingAudio) {
      await playingAudio.unloadAsync();
      setPlayingAudio(null);
    }
    const { sound } = await Audio.Sound.createAsync({ uri });
    setPlayingAudio(sound);
    await sound.playAsync();
  };

  const renderMessage = ({ item }) => {
    const isCurrentUserMessage = item.email === currentLoggedInUser.email;

    return (
      <TouchableOpacity
        style={[styles.messageContainer, { flexDirection: isCurrentUserMessage ? 'row-reverse' : 'row' }]}
        onLongPress={() => {
          if (isCurrentUserMessage) {
            setDeleteModalVisible(true);
            setSelectedMessageId(item.id);
          }
        }}
      >
        <Image source={{ uri: item.profilePicture }} style={styles.pfp} />
        <View style={styles.messageContent}>
          <Text style={styles.username}>{item.displayName}</Text>
          {item.text && <Text style={styles.messageText}>{item.text}</Text>}
          {item.audio && (
            <TouchableOpacity onPress={() => playAudio(item.audio)}>
              <Text style={styles.playAudioText}>Play Audio</Text>
            </TouchableOpacity>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        keyExtractor={item => item.id}
        renderItem={renderMessage}
      />
  
      {currentLoggedInUser && (
        isJoined ? (
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Type a message"
              value={message}
              onChangeText={setMessage}
            />
            <Button title="Send" onPress={handleSendMessage} />
            <Button
              title={recording ? 'Stop Recording' : 'Record Voice Message'}
              onPress={recording ? stopRecording : startRecording}
            />
          </View>
        ) : (
          <TouchableOpacity style={styles.joinButton} onPress={handleJoinRoom}>
            <Text style={styles.joinButtonText}>Join Room</Text>
          </TouchableOpacity>
        )
      )}
  
      {deleteModalVisible && (
        <TouchableOpacity style={styles.overlay} onPress={() => setDeleteModalVisible(false)}>
          <View style={styles.modalContainer}>
            <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteMessage}>
              <Text style={styles.deleteButtonText}>Delete Message</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelButton} onPress={() => setDeleteModalVisible(false)}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  messageContainer: {
    alignItems: 'flex-start',
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  pfp: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  messageContent: {
    flexDirection: 'column',
  },
  username: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  messageText: {
    fontSize: 16,
  },
  playAudioText: {
    color: 'blue',
    textDecorationLine: 'underline',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    marginBottom: 50,
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    paddingHorizontal: 10,
    marginRight: 10,
  },
  joinButton: {
    padding: 15,
    backgroundColor: '#1E90FF',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    margin: 20,
    marginBottom: 60,
  },
  joinButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  modalContainer: {
    marginBottom:50,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
  },
  deleteButton: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
  },
  deleteButtonText: {
    color: 'white',
  },
  cancelButton: {
    backgroundColor: 'gray',
    padding: 10,
    borderRadius: 5,
  },
  cancelButtonText: {
    color: 'white',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
});

export default ChatRoom;
