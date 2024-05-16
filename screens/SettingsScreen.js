import { View, Text} from 'react-native'
import Settings from '../components/Notification_settings/Settings'
import React from 'react'

const SettingsScreen = ({navigation}) => {
  return (
    <View>
      <Settings navigation={navigation}/>
    </View>
  )
}

export default SettingsScreen;