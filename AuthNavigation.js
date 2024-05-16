import { View, Text } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SignedInStack, SignedOutStack } from './navigation'
import { useGestureHandlerRef } from '@react-navigation/stack'
import {firebase} from './firebase'
const AuthNavigation = () => {

    const [currentUser, setCurrentUser] = useState(null)

    const userHandler = user =>
        user ? setCurrentUser(user) : setCurrentUser(null)

    useEffect(
        () => 
        firebase.auth().onAuthStateChanged(user => userHandler(user)),
        []
    )

  return <>{currentUser ? <SignedInStack/> : <SignedOutStack/>}</>
}


export default AuthNavigation