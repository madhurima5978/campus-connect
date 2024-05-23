import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, FlatList, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { db, firestore, firebase } from '../../firebase';

const ChatRooms = ({ navigation }) => {
  const [roomName, setRoomName] = useState('');
  const [rooms, setRooms] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [numColumns, setNumColumns] = useState(3); // Default number of columns

  const [currentLoggedInUser, setCurrentLoggedInUser] = useState(null);

    const getUsername = () => {
        const user = firebase.auth().currentUser;
        const unsubscribe = db.collection('users')
            .where('owner_uid', '==', user.uid).limit(1).onSnapshot(
                snapshot => snapshot.docs.map(doc => {
                    setCurrentLoggedInUser({
                        username: doc.data().username,
                    });
                })
            );
        return unsubscribe;
    };

    useEffect(() => {
        getUsername();
    }, []);



  useEffect(() => {
    const unsubscribe = firestore.collection('Rooms').onSnapshot(snapshot => {
      const roomsList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setRooms(roomsList);
    });
    return () => unsubscribe();
  }, []);

  const handleCreateRoom = async () => {
    try {
      const user = firebase.auth().currentUser;
      const roomRef = firestore.collection('Rooms').doc();
      
      await roomRef.set({ name: roomName, owner_email: user.email });
      
      await roomRef.collection('participants').doc(user.email).set({
        email: user.email,
        username: currentLoggedInUser.username,
      });
      
      setRoomName('');
      setModalVisible(false);
    } catch (error) {
      console.error('Error creating room:', error);
    }
  };

  const handleJoinRoom = async (roomId, roomName) => {
    try {
      const user = firebase.auth().currentUser;
      const participantRef = firestore.collection('Rooms').doc(roomId).collection('participants').doc(user.email);

      const participantDoc = await participantRef.get();
      if (!participantDoc.exists) {
        await participantRef.set({
          email: user.email,
          username: user.displayName,
        });
      }

      navigation.navigate('ChatRoom', { roomId, roomName });
    } catch (error) {
      console.error('Error joining room:', error);
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={rooms}
        numColumns={numColumns} // Display chats one in a row
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleJoinRoom(item.id, item.name)} style={styles.roomItem}>
            <Text>{item.name}</Text>
          </TouchableOpacity>
        )}
      />

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.modalView}>
          <TextInput
            placeholder="Room Name"
            value={roomName}
            onChangeText={setRoomName}
            style={styles.input}
          />
          <Button title="Create Room" onPress={handleCreateRoom} />
          <Button title="Cancel" onPress={() => setModalVisible(false)} />
        </View>
      </Modal>

      <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.floatingButton}>
        <Text style={styles.buttonText}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#ffffff',
  },
  roomItem: {
    flex: 1,
    margin: 5,
    padding: 10,
    backgroundColor: '#e0e0e0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  floatingButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#007bff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom:50,
  },
  buttonText: {
    fontSize: 24,
    color: '#ffffff',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  input: {
    width: '80%',
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
});

export default ChatRooms;
