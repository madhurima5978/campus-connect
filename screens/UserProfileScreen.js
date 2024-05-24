import { View, Text } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import {USERS} from '../data/Users'
import UserProfileHeader from '../components/UserProfile/UserProfileHeader'
import { Divider } from 'react-native-elements'
import UserDetails from '../components/UserProfile/UserDetails'
import BottomTabs, { bottomTabIcons } from '../components/Home/BottomTabs'
import UserContent from '../components/UserProfile/UserPosts'
const UserProfileScreen = ({navigation}) => {
  return (
    <SafeAreaView>
      <UserProfileHeader />
      <Divider width={1} orientation='vertical'/>
      <UserDetails users = {USERS[0]} navigation={navigation}/>
      <UserContent navigation={navigation}/>
      
    </SafeAreaView>
  )
}


export default UserProfileScreen;