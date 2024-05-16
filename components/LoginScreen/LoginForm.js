import { View, Text, TextInput, Button, Pressable, Touchable, TouchableOpacity, StyleSheet, Alert } from 'react-native'
import React, {useState} from 'react'

import {Formik} from 'formik'
import * as Yup from 'yup'
import Validator from 'email-validator'
import {firebase} from '../../firebase'
const LoginForm = ({navigation}) => {
    const LoginFormSchema = Yup.object().shape({
        email: Yup.string().email().required('An email is required'),
        password: Yup.string()
            .required()
            .min(8, 'Your Password has to have a least 8 characters'),
    })

const onLogin = async (email, password) => {
    try{
        await firebase.auth().signInWithEmailAndPassword(email, password)
        console.log('Firebase Login successful', email, password)
        
    } catch(error){
        Alert.alert(
           error.message
        );
                
    }
}

  return (
    <View style={styles.wrapper}>
        <Formik
        initialValues={{email: '', password: ''}}
        onSubmit={values => {
            onLogin(values.email, values.password)
        }}
        validationSchema={LoginFormSchema}
        validateOnMount={true}
        >
        {({handleChange, handleBlur, handleSubmit, values, isValid}) => (
         <>
            <View 
                style={[
                    styles.inputField,
                    {
                        borderColor: values.email.length < 1 || Validator.validate(values.email) 
                            ? '#ccc' 
                            : '#FF2701',
                    },
                ]}>
            <TextInput
                placeholderTextColor='#444'
                placeholder='Roll Number, Username or Email'
                autoCapitalize='none'
                keyboardType='email-address'
                textContentType='emailAddress'
                autoFocus={true}
                onChangeText={handleChange('email')}
                onBlur={handleBlur('email')}
                value={values.email}
            />
        </View>

        <View 
            style={[
                styles.inputField,
                {
                    borderColor: values.password.length < 1 || values.password.length >= 8
                        ? '#ccc' 
                        : '#FF2701',
                },
            ]}>
            <TextInput
                placeholderTextColor='#444'
                placeholder='Password'
                autoCapitalize='none'
                secureTextEntry={true}
                textContentType='password'
                autoCorrect={false}
                onChangeText={handleChange('password')}
                onBlur={handleBlur('password')}
                value={values.password}
            />
        </View>
        <View style = {{ alignItems: 'flex-end', marginBottom: 30}}>
            <Text style ={{color : '#FF2701'}}>Forgot Password?</Text>
        </View>
        <Pressable 
            titleSize={20} 
            style = {styles.button(isValid)}
            onPress={handleSubmit}
            disabled={!isValid}
        >
            <Text style = {styles.buttonText}>Log In</Text>
        </Pressable>
        <View style = {styles.signUpContainer}>
            <Text>Didn't register yet?</Text>
            <TouchableOpacity onPress={()=>navigation.navigate('SignUpScreen')}>
                <Text style = {{color : '#FF2701'}}>Register</Text>
            </TouchableOpacity>
        </View>
        </>
            )}
        </Formik>
    </View>
  )
}

const styles = StyleSheet.create({
    wrapper : {
        marginTop : 80,
    },
    button : (isValid) =>({
        backgroundColor : isValid ? '#000000' : '#808080',
        alignItems : 'center',
        justifyContent : 'center',
        minHeight : 42,
        borderRadius : 4,
    }),
    buttonText : {
        fontWeight : '600',
        color : '#fff',
        fontSize : 20,
    },
    inputField: {
        borderRadius : 4,
        padding : 12,
        backgroundColor : '#FAFAFA',
        marginBottom : 10,
        borderWidth : 1,
    },
    signUpContainer: {
        flexDirection : 'row',
        width : '100%',
        justifyContent : 'center',
        marginTop: 50,
    },
}) 

export default LoginForm