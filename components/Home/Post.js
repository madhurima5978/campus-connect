import React, {useState, useEffect} from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity,TouchableWithoutFeedback,Modal,Alert, Share } from 'react-native';
import { Divider } from 'react-native-elements';
import {firebase, db} from '../../firebase';

const postFooterIcons = [
  {
    name: 'Like',
    imageUrl: require('../../assets/heart.png'),
    likedImageUrl: require('../../assets/heart_fill.png')
  },
  {
    name: 'comment',
    imageUrl: require('../../assets/chat.png'),
  },
  {
    name: 'share',
    imageUrl: require('../../assets/share.png'),
  }

];

const Post = ({ post, navigation }) => {

  // const handleCommentIconClick = () => {
  //   // Navigate to the CommentScreen and pass postId and onClose function
  //   // onClose function is used to close the CommentScreen when comment is submitted
  //   navigation.navigate('CommentScreen', { postId: post.id, onClose: onCloseCommentScreen });
  // };
  const postOwnerEmail = post.owner_email; // Email of the post owner
  const postId = post.id;
  const [lastTap, setLastTap] = useState(null);

  const handleDoubleTap = post => {
    const now = Date.now();
    if (lastTap && now - lastTap < 300) {
      handleLike(post);
    } else {
      setLastTap(now);
    }
  };

  const handleLike = post => {
    const currentLikeStatus = !post.likes_by_users.includes(
      firebase.auth().currentUser.email
    )

    db.collection('users')
    .doc(post.owner_email)
    .collection('posts')
    .doc(post.id)
    .update({
      likes_by_users: currentLikeStatus 
      ? firebase.firestore.FieldValue.arrayUnion(
          firebase.auth().currentUser.email
        )
        : firebase.firestore.FieldValue.arrayRemove(
          firebase.auth().currentUser.email
        ),
    }).then(() => {
      console.log('liked Succesfully')
    })
    .catch(error => {
      console.log('Error liking', error)
    })
  }

  const handleDeletePost = () => {
    Alert.alert(
      'Delete Post',
      'Are you sure you want to delete this post?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Yes',
          onPress: () => deletePost(),
          style: 'destructive',
        },
      ],
      { cancelable: false }
    );
  };

  const deletePost = async () => {
    try {
      const postRef = db.collection('users').doc(postOwnerEmail).collection('posts').doc(postId);
      await postRef.delete();
      console.log('Post deleted successfully!');
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };
  currentUser = firebase.auth().currentUser;

  return (
    <View style={styles.container}>
      <Divider width={1} orientation='vertical' />
      <PostHeader post={post} navigation={navigation} currentUser={currentUser} handleDeletePost={handleDeletePost}/>
      <PostImage post={post} handleDoubleTap={handleDoubleTap} />
      <View style={{marginHorizontal: 15, marginTop: 10}}>
        <PostFooter handleLike={handleLike} post={post} navigation={navigation}/>
        <Likes post={post}/>
      </View>
      <Caption post={post}/>
      <CommentSection post={post}/>
      <Comments post={post}/>
    </View>
  );
};



const PostHeader = ({ post, navigation, currentUser, handleDeletePost }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const isOwner = currentUser && currentUser.email === post.owner_email;


  const [profilePicture, setProfilePicture] = useState(null);

  // Fetch the user's profile picture
  useEffect(() => {
    const fetchProfilePicture = async () => {
      try {
        const userDoc = await db.collection('users').doc(post.owner_email).get();
        if (userDoc.exists) {
          const userData = userDoc.data();
          setProfilePicture(userData.profile_picture);
        }
      } catch (error) {
        console.error('Error fetching profile picture:', error);
      }
    };

    fetchProfilePicture();
  }, [post.owner_email]);


  return (
    <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
      <View style={styles.headerContainer}>
        <View style={styles.headerContent}>
        {profilePicture && (
            <Image source={{ uri: profilePicture }} style={styles.pfp} />
          )}
          <TouchableOpacity onPress={() => navigation.navigate('ProfileScreen')}>
            <Text style={styles.username}>{post.username}</Text>
          </TouchableOpacity>
        </View>
        {isOwner && (
          <TouchableOpacity onPress={() => setModalVisible(true)}>
            <Text style={styles.moreOptions}>...</Text>
          </TouchableOpacity>
        )}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(!modalVisible)}
        >
          <View style={styles.modalView}>
            {isOwner && (
              <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => {
                handleDeletePost();
                setModalVisible(!modalVisible);
              }}
            >
                <Text style={styles.optionText}>Delete Post</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity style={styles.optionButton} onPress={() => setModalVisible(!modalVisible)}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </Modal>
      </View>
    </TouchableWithoutFeedback>
  );
};
const PostImage = ({post, handleDoubleTap}) => {
  

  return(
  <View style={{
    width: '100%',
    height: 500,
  }}>
    <TouchableOpacity onPress={()=>handleDoubleTap(post)}>
      
  <Image 
  source={{uri: post.imageUrl}}
   style={{width: '100%',
   height:'100%',
   resizeMode: 'cover',
  }}
   />
   </TouchableOpacity>
   </View>
  )
}

const PostFooter = ({handleLike, post, navigation}) => {
  
  const handlePress = () => {
    // Navigate to the desired screen
    console.log("pressed comment");
    console.log(post.owner_email)
    console.log(post.id)
    navigation.navigate('CommentScreen', {
      postOwnerEmail: post.owner_email,
      postId: post.id,
    });
    
  };


  return(
    <View style={{flexDirection: 'row',justifyContent:'space-between', width:'250%'}}>
      <View style={styles.leftFooterIconsContainer}>
        <TouchableOpacity onPress={() => handleLike(post)}>
          <Image style={styles.footerIcon} source={post.likes_by_users.includes(firebase.auth().currentUser.email
            ) ? postFooterIcons[0].likedImageUrl : postFooterIcons[0].imageUrl}/>
        </TouchableOpacity>
        
        <Divider width={1} orientation='vertical' />
        <TouchableOpacity onPress={handlePress}>
          <View><Text>Comment Section</Text></View>{/* Simplified content */}
        </TouchableOpacity>

        {/* <TouchableOpacity onPress={handlePress}>
          
        </TouchableOpacity> */}
        <Divider width={1} orientation='vertical' />
        <TouchableOpacity >
          <Icon imgStyle = {styles.footerIcon} imgUrl = {postFooterIcons[2].imageUrl}/>
        </TouchableOpacity>
      </View>
    </View>
  )
}
const Icon = ({imgStyle, imgUrl}) => {
  return(
    <TouchableOpacity>
      <Image style={imgStyle} source={imgUrl} />
    </TouchableOpacity>
  )
}
const Likes = ({ post }) => {
  // Check if post.likes is defined before accessing it
  const likesCount =  post.likes_by_users.length.toLocaleString('en')

  return (
    <View style={{ flexDirection: 'row', marginTop: 4 }}>
      <Text style={{ fontWeight: '600' }}>
        {likesCount} Likes
      </Text>
    </View>
  );
};

const Caption =({post}) => {
  return(
    <View style={{marginTop: 3, marginLeft:15, marginRight:5}}>
      <Text style={{}}>
        <Text style={{fontWeight:600}}>{post.user} </Text>
        <Text>{post.caption}</Text>
      </Text>
    </View>   
  )
}

const CommentSection = ({ post }) => {
  // Check if post.comments is undefined or null
  if (!post.comments) {
    return null;
  }

  return (
    <View style={{ marginTop: 5, marginLeft: 15, marginRight: 5 }}>
      {post.comments.length > 0 && (
        <>
        <Text style={{ color: 'gray' }}>
          View{' '}
          {post.comments.length > 1 ? 'all ' : ''}
          {post.comments.length} {post.comments.length > 1 ? 'comments' : 'comment'}
          
        </Text>
        <Text><Comments post={post}/></Text>
        </>
      )}
    </View>
  );
};


const Comments = ({ post }) => {
  return (
    <>
      {post.comments && post.comments.map((comment, index) => (
        <View key={index} style={{ marginTop: 5, marginLeft: 15, marginRight: 5 }}>
          <Text>
            <Text style={{ fontWeight: '600' }}> </Text>
            {post.comments}
          </Text>
        </View>
      ))}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 30,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 5,
    flex: 1,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },


  pfp: {
    width: 35,
    height: 35,
    borderRadius: 50,
    marginLeft: 6,
    borderWidth: 1.6,
    borderColor: '#ff8501',
  },
  
  footerIcon: {
    width: 33,
    height: 33,
  },
  leftFooterIconsContainer: {
    flexDirection: 'row',
    width: '40%',
    justifyContent: 'space-between',
  },
  moreOptions: {
    fontWeight: '900',
    justifyContent: 'space-between',
    width: '50%',
  },
  modalView: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  optionButton: {
    backgroundColor: 'white',
    padding: 15,
    marginBottom: 10,
    width: '100%',
    alignItems: 'center',
    borderRadius: 10,
  },
  optionText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  cancelButton: {
    backgroundColor: '#FF0000',
    padding: 10,
  }
});

export default Post;
