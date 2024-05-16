import { View, StyleSheet, Button, Image,Text,ScrollView } from 'react-native';

import React,{useState,useEffect} from 'react'
import {firebase, db} from '../../firebase'
import { TouchableOpacity } from 'react-native-gesture-handler'
import ImagePickerExample from './ProfileUpdate.js'
import ProfileUpdate from './ProfileUpdate.js';
import Post from '../Home/Post.js';
const handleSignOut = async() => {
  try{
    await firebase.auth().signOut()
    console.log('Signed out successfully')
  }catch(error){
    console.log(error)
  }
}


const UserPosts = ({navigation}) => {

  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        const userEmail = user.email;
        
        // Query posts where owner_email matches the logged-in user's email
        const postsRef = db.collectionGroup('posts').where('owner_email', '==', userEmail);

        // Subscribe to snapshot changes
        const unsubscribePosts = postsRef.onSnapshot(snapshot => {
          setPosts(snapshot.docs.map(post => ({ id: post.id, ...post.data() })));
        });

        // Clean up function
        return () => {
          unsubscribePosts(); // Unsubscribe from snapshot changes when component unmounts
        };
      }
    });

    // Clean up function
    return () => {
      unsubscribe(); // Unsubscribe from auth state changes when component unmounts
    };
  }, []);

  return (
    <View>
      
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('UpdateDetailsScreen')}>
        <Text style={{ color: 'white' }}>Update Details</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleSignOut} style={styles.button}>
      <Text style={{ color: 'white' }}>Sign Out</Text>
    </TouchableOpacity>
    <ScrollView>
        {posts.map((post, index) => (
          <Post key={index} post={post} />
        ))}
      </ScrollView>
      <Text style={{height:'77%',}}></Text>

    </View>
  )
}

export default UserPosts


const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageContainer: {
    marginTop: 20,
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 10,
  },
  button:{ backgroundColor: '#24cfff',
   alignItems: 'center',
    justifyContent: 'center', 
    padding: 10,
     borderRadius:30, 
    marginBottom:10,
  }

});