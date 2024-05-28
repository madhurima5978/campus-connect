import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import Header from '../components/Home/Header';
import LiveTab from '../components/Event/LiveTab';
import UpcomingTab from '../components/Event/UpcomingTab';
import PastTab from '../components/Event/PastTab';
import BookmarkedEvents from '../components/Event/BookmarkedEvents';
const Tab = createMaterialTopTabNavigator();
const EventScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.screen}>
      <Header navigation={navigation} />
      <BookmarkedEvents navigation={navigation} />
      <Tab.Navigator style={styles.container}>
        <Tab.Screen name="Live" component={LiveTab} />
        <Tab.Screen name="Upcoming" component={UpcomingTab} />
        <Tab.Screen name="Past" component={PastTab} />
      </Tab.Navigator>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  container: {
    marginBottom: 30,
  },
});
export default EventScreen;
