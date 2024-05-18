import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { db } from '../../firebase';
import moment from 'moment';
import UpcomingEvents from './subTabs/UpcomingEvents';

const UpcomingTab = ({ navigation }) => {
  const [upcomingEvents, setUpcomingEvents] = useState([]);

  useEffect(() => {
    const today = moment().startOf('day');

    const unsubscribe = db.collectionGroup('events').onSnapshot(snapshot => {
      const eventsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      const upcomingEventsData = eventsData.filter(event => moment(event.date).isAfter(today));
      setUpcomingEvents(upcomingEventsData);
    });

    return () => unsubscribe();
  }, []);

  return (
    <ScrollView>
      {upcomingEvents.length > 0 ? (
        upcomingEvents.map((event, index) => (
          <UpcomingEvents key={index} event={event} navigation={navigation} />
        ))
      ) : (
        <Text>No upcoming events available</Text>
      )}
    </ScrollView>
  );
};

export default UpcomingTab;
