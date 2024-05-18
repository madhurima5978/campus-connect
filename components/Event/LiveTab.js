import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { db } from '../../firebase';
import moment from 'moment';
import UpcomingEvents from './subTabs/UpcomingEvents';

const LiveTab = ({ navigation }) => {
  const [liveEvents, setLiveEvents] = useState([]);

  useEffect(() => {
    const today = moment().startOf('day');

    const unsubscribe = db.collectionGroup('events').onSnapshot(snapshot => {
      const eventsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      const liveEventsData = eventsData.filter(event => moment(event.date).isSame(today, 'day'));
      setLiveEvents(liveEventsData);
    });

    return () => unsubscribe();
  }, []);

  return (
    <ScrollView>
      {liveEvents.length > 0 ? (
        liveEvents.map((event, index) => (
          <UpcomingEvents key={index} event={event} navigation={navigation} />
        ))
      ) : (
        <Text>No live events available</Text>
      )}
    </ScrollView>
  );
};

export default LiveTab;
