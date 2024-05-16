import { View, Text, Image, StyleSheet, Button, Alert, TouchableOpacity  } from 'react-native'
import React, { useState } from 'react'

import ImagePickerExample from './ProfileUpdate';

const UserDetails = ({ users }) => {
    return (
      <View style={styles.container}>
        <Image source={{ uri: users.image }} style={styles.pfp} />
        <View style={styles.postContainer}>
          <Text style={styles.postcount}>{users.posts_count}</Text>
          <Text style={styles.postsText}>Posts</Text>
        </View>
        <View style={styles.EventsContainer}>
          <Text style={styles.postcount}>{users.events_hosted}</Text>
          <Text style={styles.postsText}>hosted</Text>
        </View>
        <View style={styles.EventsContainer}>
          <Text style={styles.postcount}>{users.events_participated}</Text>
          <Text style={styles.postsText}>Participated</Text>
        </View>
        
      </View>
    );
  };
  



  
  const styles = StyleSheet.create({
    pfp: {
      width: 90,
      height: 90,
      borderRadius: 50,
      marginLeft: 6,
      marginTop: 20,
      borderWidth: 1.6,
      borderColor: '#ff8501',
    },
    container: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '40%',
    },
    postContainer: {
      flexDirection: 'column',
      alignItems: 'center',
      marginLeft: 30,
      margin: 40,
    },
    EventsContainer: {
        flexDirection: 'column',
        alignItems: 'center',
        marginLeft: 0,
        margin: 40,
      },
    postcount: {
      fontWeight: '800',
      fontSize: 24,
    },
    postsText: {
      marginTop: 5, // Adjust the spacing as needed
    },
  });
  
  export default UserDetails;
  