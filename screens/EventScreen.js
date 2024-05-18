// import React, { useEffect, useState } from 'react';
// import { View, Text, SafeAreaView, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
// import Header from '../components/Home/Header';
// import UpcomingEvents from '../components/Event/subTabs/UpcomingEvents';
// import LiveEvents from '../components/Event/subTabs/LiveEvents';
// import PastEvents from '../components/Event/subTabs/PastEvents';
// import { db } from "../firebase";
// import moment from 'moment';

// const EventScreen = ({ navigation }) => {
//   const [events, setEvents] = useState([]);
//   const [tab, setTab] = useState('upcoming');

//   useEffect(() => {
//     console.log("Setting up Firestore listener");

//     const unsubscribe = db.collectionGroup('events').onSnapshot(snapshot => {
//       console.log("Received snapshot from Firestore");

//       const eventsData = snapshot.docs.map(doc => ({
//         id: doc.id,
//         ...doc.data()
//       }));

//       console.log("Mapped events data:", eventsData);
//       setEvents(eventsData);
//     }, error => {
//       console.error("Error fetching events data:", error);
//     });

//     return () => {
//       console.log("Unsubscribing from Firestore listener");
//       unsubscribe();
//     };
//   }, []);

//   const today = moment().startOf('day');
//   const liveEvents = events.filter(event => moment(event.date).isSame(today, 'day'));
//   const upcomingEvents = events.filter(event => moment(event.date).isAfter(today));
//   const pastEvents = events.filter(event => moment(event.date).isBefore(today));

//   return (
//     <SafeAreaView style={styles.screen}>
//       <Header navigation={navigation} />
//       <View style={styles.tabContainer}>
//         <TouchableOpacity style={[styles.tab, tab === 'live' && styles.activeTab]} onPress={() => setTab('live')}>
//           <Text style={styles.tabText}>Live</Text>
//         </TouchableOpacity>
//         <TouchableOpacity style={[styles.tab, tab === 'upcoming' && styles.activeTab]} onPress={() => setTab('upcoming')}>
//           <Text style={styles.tabText}>Upcoming</Text>
//         </TouchableOpacity>
//         <TouchableOpacity style={[styles.tab, tab === 'past' && styles.activeTab]} onPress={() => setTab('past')}>
//           <Text style={styles.tabText}>Past</Text>
//         </TouchableOpacity>
//       </View>
//       <ScrollView style={styles.container}>
//         {tab === 'live' && (liveEvents.length > 0 ? (
//           liveEvents.map((event, index) => (
//             <LiveEvents key={index} event={event} navigation={navigation} />
//           ))
//         ) : (
//           <Text>No live events available</Text>
//         ))}
//         {tab === 'upcoming' && (upcomingEvents.length > 0 ? (
//           upcomingEvents.map((event, index) => (
//             <UpcomingEvents key={index} event={event} navigation={navigation} />
//           ))
//         ) : (
//           <Text>No upcoming events available</Text>
//         ))}
//         {tab === 'past' && (pastEvents.length > 0 ? (
//           pastEvents.map((event, index) => (
//             <PastEvents key={index} event={event} navigation={navigation} />
//           ))
//         ) : (
//           <Text>No past events available</Text>
//         ))}
//       </ScrollView>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   screen: {
//     flex: 1,
//   },
//   container: {
//     marginBottom: 30,
//   },
//   tabContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     paddingVertical: 10,
//   },
//   tab: {
//     padding: 10,
//   },
//   activeTab: {
//     borderBottomWidth: 2,
//     borderBottomColor: 'black',
//   },
//   tabText: {
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
// });

// export default EventScreen;


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
