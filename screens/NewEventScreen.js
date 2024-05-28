import { View, Text } from 'react-native'
import React from 'react'
import NewEvent from '../components/Event/NewEvent'
const NewEventScreen = ({navigation}) => {
  return (
    <View>
      <NewEvent navigation={navigation}/>
    </View>
  )
}
export default NewEventScreen