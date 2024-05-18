import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { db } from '../../firebase';
import moment from 'moment';
import UpcomingEvents from './subTabs/UpcomingEvents';

const PastTab = ({ navigation }) => {
  const [pastEvents, setPastEvents] = useState([]);

  useEffect(() => {
    const today = moment().startOf('day');

    const unsubscribe = db.collectionGroup('events').onSnapshot(snapshot => {
      const eventsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      const pastEventsData = eventsData.filter(event => moment(event.date).isBefore(today));
      setPastEvents(pastEventsData);
    });

    return () => unsubscribe();
  }, []);

  return (
    <ScrollView>
      {pastEvents.length > 0 ? (
        pastEvents.map((event, index) => (
          <UpcomingEvents key={index} event={event} navigation={navigation} />
        ))
      ) : (
        <Text>No past events available</Text>
      )}
    </ScrollView>
  );
};

export default PastTab;
