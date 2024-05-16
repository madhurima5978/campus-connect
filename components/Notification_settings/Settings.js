import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native'
import React from 'react'
import 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context'
const Settings = ({navigation}) => {
  return (
    <SafeAreaView>
      <TouchableOpacity onPress={()=>navigation.goBack()} style={styles.container }>
        <Image source ={{uri: 'https://img.icons8.com/ios-glyphs/90/000000/back.png'}}
        style={{width:30, height:30}}/>
        <Text style={{fontWeight:'800',fontSize:18}}>Notification settings</Text>
      </TouchableOpacity>
    </SafeAreaView>
  )
}
const styles = StyleSheet.create({
  container:{
    flexDirection:'row',
    justifyContent:'space-between',
    width:'99%',
  }
})

export default Settings