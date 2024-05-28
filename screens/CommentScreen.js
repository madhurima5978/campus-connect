import { View, Text,StyleSheet} from 'react-native'
import React from 'react'
import CommentForm from '../components/Home/CommentSection'
import { SafeAreaView } from 'react-native-safe-area-context'
import CommentSection from '../components/Home/CommentSection';
// import CommentsList from '../components/Home/commentsList'
const CommentScreen = ({route}) => {
  const { postOwnerEmail, postId } = route.params;

  console.log(postOwnerEmail)
  console.log(postId)
  return (
    <SafeAreaView>
      <CommentSection postOwnerEmail={postOwnerEmail} postId={postId} />   
    </SafeAreaView>
  )
}

export default CommentScreen



