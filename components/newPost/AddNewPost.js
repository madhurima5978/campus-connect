import { View, Text, StyleSheet,Image, TouchableOpacity } from 'react-native'
import React, {useState} from 'react'
import { Divider } from 'react-native-elements';
import FormikPostUploader from './FormikPostUploader';
import 'react-native-gesture-handler';
import * as ImagePicker from 'expo-image-picker';
import Constants from 'expo-constants';

const AddNewPost = ({navigation}) => {
    return(
        <View style={styles.container}>
            <Header navigation={navigation}/>
             
            <FormikPostUploader navigation={navigation}/>
            
        </View>
    )
}
const Header = ({navigation}) => {
  return (
    <View style={styles.headerContainer}>
        <TouchableOpacity onPress={()=>navigation.goBack()}>
        <Image source ={{uri: 'https://img.icons8.com/ios-glyphs/90/000000/back.png'}}
        style={{width:30, height:30}}/>
      </TouchableOpacity>
      <Text style={styles.headerText}>New Post</Text>
      <Text></Text>
      
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
        marginHorizontal: 10
    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop:10,
        marginBottom:10
    },
    headerText: {
        fontWeight: '700',
        fontSize: 20,
        marginRight: 25,
        
    },
})

export default AddNewPost