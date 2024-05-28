import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { db } from '../firebase';
import UpcomingEvents from '../components/Event/subTabs/UpcomingEvents';
const DisplayEventScreen = ({ route }) => {
  const { eventId, ownerEmail } = route.params;
  const [eventDetails, setEventDetails] = useState(null);
  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        const eventRef = db.collection('users').doc(ownerEmail).collection('events').doc(eventId);
        const doc = await eventRef.get();
        if (doc.exists) {
          setEventDetails(doc.data());
        } else {
          console.log('No such document!');
        }
      } catch (error) {
        console.error('Error fetching event details:', error);
      }
    };
    fetchEventDetails();
  }, [eventId, ownerEmail]);
  if (!eventDetails) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <Image source={{ uri: eventDetails.imageUrl }} style={styles.eventImage} />
      <Text style={styles.eventTitle}>{eventDetails.title}</Text>
      <Text style={styles.eventDescription}>{eventDetails.description}</Text>
      <Text style={styles.eventDate}>{eventDetails.date}</Text>
      <UpcomingEvents event={eventDetails} />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'center',
  },
  eventImage: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  eventTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  eventDescription: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 10,
  },
  eventDate: {
    fontSize: 16,
    fontStyle: 'italic',
  },
});
export default DisplayEventScreen;
