import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, ScrollView } from 'react-native';
import { firebase, db } from '../../firebase'; // Importing firebase and db from Firebase

const CommentComponent = ({ postOwnerEmail, postId }) => {
  console.log("postOwnerEmail:", postOwnerEmail);
  console.log("postId:", postId);

  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const commentsRef = db.collection(`users`).doc(`${postOwnerEmail}`).collection(`posts`).doc(`${postId}`).collection(`comments`);
    const unsubscribe = commentsRef.onSnapshot((snapshot) => {
      const commentsData = snapshot.docs.map((doc) => doc.data());
      setComments(commentsData);
    });

    return () => {
      unsubscribe();
    };
  }, [postOwnerEmail, postId]);

  const [currentLoggedInUser, setCurrentLoggedInUser] = useState(null)

    const getUsername = () =>{
        const user = firebase.auth().currentUser
        const unsubscribe = db.collection('users')
        .where('owner_uid', '==' ,user.uid ).limit(1).onSnapshot(
          snapshot => snapshot.docs.map(doc => {
              setCurrentLoggedInUser({
                username: doc.data().username,

              })
          })
        )
        return unsubscribe
    }

    useEffect(() => {
        getUsername()
    },[])


  const handleCommentSubmit = async () => {
    const userId = firebase.auth().currentUser.uid;
    const commentData = {
      username: currentLoggedInUser.username,
      comment: comment,
      time: firebase.firestore.FieldValue.serverTimestamp()
    };

    try {
      await db.collection(`users`).doc(`${postOwnerEmail}`).collection(`posts`).doc(`${postId}`).collection(`comments`).add(commentData); // corrected path
      console.log('Comment posted successfully!');
      setComment('');
    } catch (error) {
      console.error('Error posting comment:', error);
    }
  };

  return (
    <View>
      <TextInput 
        value={comment} 
        onChangeText={(text) => setComment(text)} 
        placeholder="Enter your comment" 
        multiline 
        numberOfLines={4} 
        style={{ 
          borderWidth: 1,
          borderColor: 'gray',
          marginBottom: 10 
        }}
      />
      <Button title="Post Comment" onPress={handleCommentSubmit} />
      <View>
        <Text>Comments:</Text>
        <ScrollView>
          {comments.map((comment, index) => (
            <View key={index} style={{padding:10}}>
              <Text>User: {comment.username}</Text>
              <Text>Comment: {comment.comment}</Text>
              <Text>Time: {comment.time ? comment.time.toDate().toLocaleString() : 'Unknown'}</Text>
            </View>
          ))}
        </ScrollView>
      </View>
    </View>
  );
};

export default CommentComponent;
