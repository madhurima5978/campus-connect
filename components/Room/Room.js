import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Modal, Button, TouchableWithoutFeedback, Platform } from 'react-native';
import { USERS } from '../../data/Users';

const Stories = () => {
  const [isModalVisible, setModalVisible] = useState(false);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  return (
    <View>
      <Text style={{fontWeight:'800',padding:20,fontSize:20 }}>Let's Talk</Text>
    <View style={styles.container}>
      
      {USERS.map((userObj, index) => (
        <TouchableOpacity key={userObj.user} style={styles.userContainer} onPress={toggleModal}>
          <Image
            source={{ uri: userObj.image }}
            style={{ width: 100, height: 100, borderRadius: 50 }}
          />
          <Text>{userObj.user}</Text>
        </TouchableOpacity>
      ))}

      <Modal animationType="slide" transparent={true} visible={isModalVisible}>
        <TouchableWithoutFeedback onPress={closeModal}>
          <View style={styles.overlay} />
        </TouchableWithoutFeedback>
        <View style={styles.modalContainer}>
          <Text>Join Room</Text>
          <View style={{ backgroundColor: 'turquoise', borderRadius: 30, marginTop: 10 }}>
              <TouchableOpacity  onPress={closeModal} style={{backgroundColor:'turquoise', borderRadius: 30, padding:5, justifyContent:'center', alignItems:'center'}}>
                <Text style={{color:'white'}}>Close</Text>
              </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between', // Adjust as needed
    paddingHorizontal: 10, // Adjust as needed
  },
  userContainer: {
    alignItems: 'center',
    marginVertical: 10, // Adjust as needed
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0)',
  },
  modalContainer: {
    height: '50%', // Adjust as needed
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 4,
      },
      android: {
        elevation: 5,
      },
    }),
  },
});

export default Stories;
