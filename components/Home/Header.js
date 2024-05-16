import { SafeAreaView, View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native';

const Header = ({navigation}) => {
  return (
    <View style ={styles.container}>
      <TouchableOpacity>
      <Image 
      style = {styles.logo}
      source={require('../../assets/cc.png')}
      />
      </TouchableOpacity>
      <View style = {styles.iconContainer}>
        <TouchableOpacity onPress={() => navigation.push('SettingsScreen')}>
          <Image style = {styles.icon}
      source={require('../../assets/Bell_settings.png')}>

          </Image>
        </TouchableOpacity>
      </View>
    </View>
    
  )
}
const styles = StyleSheet.create({
  container: {
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    width: '98%',
    paddingTop: 20,
     // Adjust as needed
  },
  iconContainer: {
    flexDirection: 'row',
  },
  logo: {
    width: 100,
    height: 50,
    resizeMode: 'contain',
    left: -10
  },
  icon: {
    width: 40,
    height: 40,
    resizeMode: 'contain',

  },
})

export default Header
