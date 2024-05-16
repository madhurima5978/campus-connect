import React from "react";
import { Alert } from 'react-native';
import {
    View, TextInput, StyleSheet, Text, TouchableOpacity, Pressable,
} from 'react-native'
import {Formik} from 'formik'
import * as Yup from 'yup'
import Validation from 'email-validator'
import {firebase, db} from "../../firebase";
const SignUpForm = ({navigation}) => {
    const SignupFormSchema = Yup.object().shape({
        rollnumber: Yup.string().required().min(7, 'Roll number is required'),
        email: Yup.string().email().required('An Email is required'),
        username: Yup.string().required().min(6, 'A username is required'),
        password: Yup.string().required().min(8, 'Your Password has to have at least 8 characters')
    })

    const onSignup = async( email,password, username, rollnumber) => {
        try{
            const authUser = await firebase.auth().createUserWithEmailAndPassword(email, password)
            console.log("Created user succesfully",email,password)

            db.collection('users')
            .doc(authUser.user.email)
            .set({
                owner_uid: authUser.user.uid,
                username: username,
                email: authUser.user.email,
                rollnumber: rollnumber,
             })
        }catch(error){
            Alert.alert('OMG', error.message)
        }
    }
return (
    <View style={styles.wrapper}>
        <Formik
        initialValues={{rollnumber: '',email: '', username: '', password: ''}}
        onSubmit={values => {
            onSignup( values.email, values.password, values.username, values.rollnumber)
        }}
        validationSchema={SignupFormSchema}
        validateOnMount={true}
        >
        {({handleChange, handleBlur, handleSubmit, values, isValid}) => (
         <>
            <View 
                style={[
                    styles.inputField,
                    {
                        borderColor: values.rollnumber.length < 1 || values.username.length == 7 
                            ? '#ccc' 
                            : '#FF2701',
                    },
                ]}>
            <TextInput
                placeholderTextColor='#444'
                placeholder='Roll Number'
                autoCapitalize='none'
                textContentType='none'
                onChangeText={handleChange('rollnumber')}
                onBlur={handleBlur('rollnumber')}
                value={values.rollnumber}
            />
            </View>

            <View 
                style={[
                    styles.inputField,
                    {
                        borderColor: values.email.length < 1 || Validation.validate(values.email) 
                            ? '#ccc' 
                            : '#FF2701',
                    },
                ]}>
            <TextInput
                placeholderTextColor='#444'
                placeholder='Email ID'
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
                        borderColor: values.username.length < 1 || values.username.length >= 6
                            ? '#ccc' 
                            : '#FF2701',
                    },
                ]}>
            <TextInput
                placeholderTextColor='#444'
                placeholder='Username'
                autoCapitalize='none'
                textContentType='username'
                onChangeText={handleChange('username')}
                onBlur={handleBlur('username')}
                value={values.username}
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
            <Text style = {styles.buttonText}>Sign Up</Text>
        </Pressable>

        <View style = {styles.logInContainer}>
            <Text>Already have an account?</Text>
            <TouchableOpacity onPress={()=>navigation.navigate('LoginScreen') }>
                <Text style = {{color : '#FF2701'}}>Log In</Text>
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
    logInContainer: {
        flexDirection : 'row',
        width : '100%',
        justifyContent : 'center',
        marginTop: 50,
    },
}) 

export default SignUpForm