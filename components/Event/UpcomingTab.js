import { View, Text, StyleSheet, ScrollView } from 'react-native'
import React, { useState, useEffect } from 'react'
import UpcomingEvents from './subTabs/UpcomingEvents'
import { SafeAreaView } from 'react-native-safe-area-context'
import { db } from '../../firebase'

const UpcomingTab = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const unsubscribe = db.collection('events').onSnapshot(snapshot => {
      const eventsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setEvents(eventsData);
    });
    return () => unsubscribe();
  }, []);

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView style={styles.container}>
        {events.map((event) => (
          <UpcomingEvents key={event.id} event={event} />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  container: {
    marginBottom: 30,
  }
});

export default UpcomingTab;
