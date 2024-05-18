import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView } from 'react-native';
import { firebase, db } from '../../firebase';
import { TouchableOpacity } from 'react-native-gesture-handler';

const BookmarkedEvents = ({ navigation }) => {
  const [bookmarkedEvents, setBookmarkedEvents] = useState([]);

  useEffect(() => {
    const fetchBookmarkedEvents = async () => {
      const currentUser = firebase.auth().currentUser;
      if (currentUser) {
        const userRef = db.collection('users').doc(currentUser.email);
        const snapshot = await userRef.collection('bookmarkedEvents').get();
        const bookmarkedEventData = snapshot.docs.map(doc => doc.data());
        setBookmarkedEvents(bookmarkedEventData);
      }
    };

    fetchBookmarkedEvents();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Bookmarked Events</Text>
      {bookmarkedEvents.length > 0 ? (
        <ScrollView horizontal style={styles.eventList}>
          {bookmarkedEvents.map((event, index) => (
            <EventTitle 
              key={index} 
              eventId={event.eventId} 
              ownerEmail={event.owner_email} 
              navigation={navigation} 
            />
          ))}
        </ScrollView>
      ) : (
        <Text>No bookmarked events</Text>
      )}
    </View>
  );
};

const EventTitle = ({ eventId, ownerEmail, navigation }) => {
  const [eventTitle, setEventTitle] = useState('');
  const [eventImg, setEventImg] = useState(null);

  useEffect(() => {
    const fetchEventTitle = async () => {
      const eventRef = db.collection('users').doc(ownerEmail).collection('events').doc(eventId);
      const doc = await eventRef.get();
      if (doc.exists) {
        const eventData = doc.data();
        setEventTitle(eventData.title);
        setEventImg(eventData.imageUrl);
      }
    };

    fetchEventTitle();
  }, [eventId, ownerEmail]);

  const handleEventPress = () => {
    console.log(eventId);
    console.log(ownerEmail);
    navigation.navigate('DisplayEventScreen', { eventId, ownerEmail });
  };

  return (
    <TouchableOpacity onPress={handleEventPress} style={styles.eventContainer}>
      {eventImg && <Image source={{ uri: eventImg }} style={styles.eventImage} />}
      <Text style={styles.eventTitle}>{eventTitle}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  header: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  eventList: {
    flexDirection: 'row',  // Arrange items in a row
  },
  eventContainer: {
    alignItems: 'center',
    marginBottom: 10,
    marginRight: 10,  // Add some margin to the right to space out the items
  },
  eventImage: {
    width: 50,
    height: 50,
    marginRight: 10,
    borderRadius: 25,
  },
  eventTitle: {
    fontSize: 16,
  },
});

export default BookmarkedEvents;
