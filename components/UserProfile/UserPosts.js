import { View, StyleSheet, Button, Image,Text,ScrollView } from 'react-native';

import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import React,{useState,useEffect} from 'react'
import {firebase, db} from '../../firebase'
import { TouchableOpacity } from 'react-native-gesture-handler'
import Post from '../Home/Post.js';
const Tab = createMaterialTopTabNavigator();
const handleSignOut = async() => {
  try{
    await firebase.auth().signOut()
    console.log('Signed out successfully')
  }catch(error){
    console.log(error)
  }
}
const UserContent = ({navigation}) => {
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        const userEmail = user.email;
        const postsRef = db.collectionGroup('posts').where('owner_email', '==', userEmail);
        const unsubscribePosts = postsRef.onSnapshot(snapshot => {
          setPosts(snapshot.docs.map(post => ({ id: post.id, ...post.data() })));
        });
        return () => {
          unsubscribePosts();
        };
      }
    });
    return () => {
      unsubscribe();
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
      <Text style={{height:'77%',}}></Text>

    </View>
  )
}



const UserPosts = ({ navigation }) => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        const userEmail = user.email;
        const postsRef = db.collectionGroup('posts').where('owner_email', '==', userEmail);
        const unsubscribePosts = postsRef.onSnapshot(snapshot => {
          setPosts(snapshot.docs.map(post => ({ id: post.id, ...post.data() })));
        });
        return () => {
          unsubscribePosts();
        };
      }
    });
    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView>
        {posts.map((post, index) => (
          <Post key={index} post={post} />
        ))}
      </ScrollView>
    </View>
  );
};


const UserEvents = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        const userEmail = user.email;
        const eventsRef = db.collectionGroup('events').where('owner_email', '==', userEmail);
        const unsubscribeEvents = eventsRef.onSnapshot(snapshot => {
          setEvents(snapshot.docs.map(event => ({ id: event.id, ...event.data() })));
        });
        return () => {
          unsubscribeEvents();
        };
      }
    });
    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView>
        {events.map((event, index) => (
          <Event key={index} event={event} />
        ))}
      </ScrollView>
    </View>
  );
};


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
  },
  

});
export default UserContent
