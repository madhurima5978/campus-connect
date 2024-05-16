import { View, Text, StyleSheet, Image, ScrollView } from 'react-native'
import React from 'react'

import SignUpForm from '../components/LoginScreen/SignUpForm'

const SignupScreen = ({navigation}) => {
  return (
    <ScrollView style= {styles.container}>
        <View style = {styles.logocontainer}>
            <Image style = {styles.image}source={require('..//assets//cc.png')}/>
        </View>
        <SignUpForm navigation={navigation}/>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
    container: {
        flex : 1,
        paddingTop: 50,
        paddingHorizontal: 12,
    },

    image : {
        height: 100,
        width: 100,
    },

    logocontainer: {
        alignItems: 'center',
        marginTop: 60,
    }
})

export default SignupScreen