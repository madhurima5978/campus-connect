import React from 'react';
import {StyleSheet } from 'react-native'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import LiveTab from '../components/Event/LiveTab';
import UpcomingTab from '../components/Event/UpcomingTab';
import PastTab from '../components/Event/PastTab';
import TopTabs from '../components/Event/TopTabs';
import { SafeAreaView } from 'react-native-safe-area-context'

const Tab = createMaterialTopTabNavigator();

const EventScreen = () => {
  return (
    
      <Tab.Navigator style={styles.container}>
        <Tab.Screen name="Live" component={LiveTab} />
        <Tab.Screen name="Upcoming" component={UpcomingTab} />
        <Tab.Screen name="Past" component={PastTab} />
      </Tab.Navigator>
    
  );
};

const styles = StyleSheet.create({
    container:{
      marginTop: 20,
    }
})

export default EventScreen;