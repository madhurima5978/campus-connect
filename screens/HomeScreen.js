import { View, Text, SafeAreaView, StyleSheet, ScrollView } from 'react-native'
import React, { useEffect,useState } from 'react'
import Header from '../components/Home/Header'
import Post from '../components/Home/Post'
import {POSTS} from '../data/UserPosts'
import BottomTabs, { bottomTabIcons } from '../components/Home/BottomTabs'
import {db} from "../firebase"

const HomeScreen = ({navigation}) => {

  const [posts, setPosts] = useState([])

  useEffect(() => {
    db.collectionGroup('posts')
    
    .onSnapshot(snapshot => {
      setPosts(snapshot.docs.map(post =>
        ({
          id: post.id, ...post.data()
        }) 
        ))
    })
  },[])
  return (
    <SafeAreaView style={styles.screen}>
        <Header  navigation={navigation}/>
        <ScrollView style={styles.container}>
          {posts.map((post, index) => (
            <Post key={index} post={post} navigation={navigation}/>
          ))}
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  screen:{
    height:'100%',
  },
    container: {
        flex: 1,
        marginBottom:30,
    },
    post: {
      marginBottom: 16,
      height: '100%',
    },
});

export default HomeScreen