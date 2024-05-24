import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, Modal, TouchableOpacity, TextInput, TouchableWithoutFeedback  } from 'react-native';
import moment from 'moment';
import { Divider } from 'react-native-elements';
import { firebase, db } from '../../../firebase'; // Make sure firebase is configured
import { Alert } from 'react-native';

const eventFooterIcons = [
  {
    name: 'bookmark',
    active: require('../../../assets/verify.png'),
    inactive: require('../../../assets/verify.png'),
  },
  {
    name: 'reminder',
    active: require('../../../assets/bell_active.png'),
    inactive: require('../../../assets/bell_inactive.png'),
  },
];

const UpcomingEvents = ({ event, navigation }) => {
  const currentUser = firebase.auth().currentUser; // Get the current user's data from Firebase Auth
  const isPastEvent = moment(event.date).isBefore(moment(), 'day');

  return (
    <View style={styles.container}>
      <Divider width={1} orientation="vertical" />
      <EventHeader event={event} />
      <EventImage event={event} />
      <EventTitle event={event} />
      <Eventdesc event={event} />
      <EventLocation event={event} />
      <View style={{ marginHorizontal: 15, marginTop: 10 }}>
        <EventFooter event={event} isPastEvent={isPastEvent} currentUser={currentUser} />
      </View>
      <Announcements event={event} />
    </View>
  );
};

const EventHeader = ({ event }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [announcementModalVisible, setAnnouncementModalVisible] = useState(false);
  const [announcement, setAnnouncement] = useState('');
  const currentUser = firebase.auth().currentUser;

  const isOwner = currentUser && currentUser.uid === event.owner_uid;

  const handleAddAnnouncement = () => {
    db.collection('users').doc(currentUser.email)
      .collection('events').doc(event.id).collection('announcements').add({
        text: announcement,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        owner: currentUser.email,
      }).then(() => {
        setAnnouncement('');
        setAnnouncementModalVisible(false);
      });
  };

  const handleDeleteEvent = () => {
    // Implement event deletion logic here
    Alert.alert(
      'Delete Event',
      'Are you sure you want to delete this event?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Yes',
          onPress: () => deleteEvent(),
          style: 'destructive',
        },
      ],
      { cancelable: false }
    );
  };
  const deleteEvent = async () => {
    const user = firebase.auth().currentUser;
    const eventRef = db.collection('users').doc(user.email).collection('events').doc(event.id);
    
    try {
      // Start a batched write operation
      const batch = db.batch();
  
      // Delete the event document
      batch.delete(eventRef);
  
      // Delete the associated announcements
      const announcementsRef = eventRef.collection('announcements');
      const announcementsSnapshot = await announcementsRef.get();
      announcementsSnapshot.forEach(doc => {
        batch.delete(doc.ref);
      });
  
      // Delete the associated reminders
      const remindersRef = eventRef.collection('reminders');
      const remindersSnapshot = await remindersRef.get();
      remindersSnapshot.forEach(doc => {
        batch.delete(doc.ref);
      });
  
      // Commit the batched write operation
      await batch.commit();
  
      console.log('Event, announcements, and reminders successfully deleted!');
    } catch (error) {
      console.error('Error deleting event, announcements, and reminders:', error);
    }
  };
  

  const [eventProfilePicture, setEventProfilePicture] = useState(null);

// Fetch the event's profile picture
useEffect(() => {
  const fetchEventProfilePicture = async () => {
    try {
      const eventDoc = await db.collection('events').doc(event.id).get();
      if (eventDoc.exists) {
        const eventData = eventDoc.data();
        setEventProfilePicture(eventData.profile_picture);
      }
    } catch (error) {
      console.error('Error fetching event profile picture:', error);
    }
  };

  fetchEventProfilePicture();
}, [event.id]);

  

  const handleShareEvent = () => {
    // Implement event sharing logic here
  };

  return (
    <TouchableWithoutFeedback onPress={() => {
      setModalVisible(false);
      setAnnouncementModalVisible(false);
    }}>
      <View style={styles.headerContainer}>
        <View style={styles.headerContent}>
        <Image source={{ uri: eventProfilePicture }} style={styles.profilePicture} />

          <Text style={styles.username}>{event.username}</Text>
        </View>
        {isOwner && (
          <TouchableOpacity onPress={() => setModalVisible(true)}>
            <Text style={styles.moreOptions}>...</Text>
          </TouchableOpacity>
        )}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(!modalVisible)}
        >
          <View style={styles.modalView}>
            {isOwner && (
              <>
                <TouchableOpacity style={styles.optionButton} onPress={() => setAnnouncementModalVisible(true)}>
                  <Text style={styles.optionText}>Add Announcement</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.optionButton} onPress={handleDeleteEvent}>
                  <Text style={styles.optionText}>Delete Event</Text>
                </TouchableOpacity>
              </>
            )}
            <TouchableOpacity style={styles.optionButton} onPress={handleShareEvent}>
              <Text style={styles.optionText}>Share Event</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelButton} onPress={() => setModalVisible(!modalVisible)}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </Modal>

        <Modal
          animationType="slide"
          transparent={true}
          visible={announcementModalVisible}
          onRequestClose={() => setAnnouncementModalVisible(!announcementModalVisible)}
        >
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Add Announcement</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter announcement"
              value={announcement}
              onChangeText={setAnnouncement}
            />
            <TouchableOpacity style={styles.submitButton} onPress={handleAddAnnouncement}>
              <Text style={styles.buttonText}>Submit</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelButton} onPress={() => setAnnouncementModalVisible(!announcementModalVisible)}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </Modal>
      </View>
    </TouchableWithoutFeedback>
  );
};

const EventImage = ({ event }) => {
  if (event.imageUrl) {
    return (
      <View style={styles.imageContainer}>
        <Image source={{ uri: event.imageUrl }} style={styles.image} />
      </View>
    );
  }
  return null;
};

const EventTitle = ({ event }) => (
  <View style={styles.titleContainer}>
    <Text style={styles.title}>{event.title}</Text>
  </View>
);

const Eventdesc = ({ event }) => (
  <View style={styles.descContainer}>
    <Text style={styles.desc}>{event.desc}</Text>
  </View>
);
const EventFooter = ({ event, isPastEvent }) => {

  
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [eventId, setEventId] = useState(''); // State variable to store event ID

  const toggleBookmark = async () => {
    const user = firebase.auth().currentUser;
    const userRef = db.collection('users').doc(user.email);
    const bookmarkedEventsRef = userRef.collection('bookmarkedEvents').doc(event.id);
  
    if (isBookmarked) {
      // Remove event document from the 'bookmarkedEvents' subcollection
      await bookmarkedEventsRef.delete();
    } else {
      // Add event document to the 'bookmarkedEvents' subcollection
      await bookmarkedEventsRef.set({
        eventId: event.id,
        owner_email: event.owner_email,
        // Other event details you want to store
      });
    }
  
    setIsBookmarked(!isBookmarked);
  };

  // Fetch bookmarked events from the 'bookmarkedEvents' subcollection
  const fetchBookmarkedEvents = async () => {
    const user = firebase.auth().currentUser;
    const userRef = db.collection('users').doc(user.email);
    const bookmarkedEventsRef = userRef.collection('bookmarkedEvents');
  
    const snapshot = await bookmarkedEventsRef.get();
    const bookmarkedEventsData = snapshot.docs.map(doc => doc.data());
  
    // Check if the current event is bookmarked
    const isEventBookmarked = bookmarkedEventsData.some(data => data.eventId === event.id);
    setIsBookmarked(isEventBookmarked);
  };
  
  // Call the fetchBookmarkedEvents function in useEffect to fetch bookmarked events when the component mounts
  useEffect(() => {
    fetchBookmarkedEvents();
  }, []);
  

  // Use useEffect to periodically check event times and delete past events
  useEffect(() => {
    const interval = setInterval(async () => {
      const user = firebase.auth().currentUser;
      const userRef = db.collection('users').doc(user.email);
      const snapshot = await userRef.get();
      if (snapshot.exists) {
        const userData = snapshot.data();
        const bookmarkedEvents = userData.bookmarkedEvents || [];
        if (bookmarkedEvents.includes(eventId)) {
          // Remove event ID from bookmarkedEvents if bookmarked
          await userRef.update({
            bookmarkedEvents: firebase.firestore.FieldValue.arrayRemove(eventId),
          });
          setIsBookmarked(false); // Update bookmark status
        }
      }
      
      // Implement logic to delete past events here...
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [eventId]); // Add eventId to dependencies array


  const [isReminderActive, setReminderActive] = useState(false);
  const [currentLoggedInUser, setCurrentLoggedInUser] = useState(null);
  const [reminderCount, setReminderCount] = useState(0);

  useEffect(() => {
    const user = firebase.auth().currentUser;
    if (user) {
      const unsubscribe = db.collection('users')
        .where('owner_uid', '==', user.uid).limit(1).onSnapshot(
          snapshot => {
            const userData = snapshot.docs[0]?.data();
            setCurrentLoggedInUser({ username: userData?.username });
          }
        );
      return unsubscribe;
    }
  }, []);

  const toggleReminder = async () => {
    const user = firebase.auth().currentUser;
    if (user) {
      const reminderDocRef = db.collection('users').doc(user.email)
        .collection('events').doc(event.id)
        .collection('reminders').doc(user.uid);

      if (isReminderActive) {
        await reminderDocRef.delete();
      } else {
        await reminderDocRef.set({
          email: user.email,
          username: currentLoggedInUser?.username,
          timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });
      }
      setReminderActive(!isReminderActive);
      getReminderCount(); // Update the reminder count
    }
  };

  const checkReminderStatus = async () => {
    const user = firebase.auth().currentUser;
    if (user) {
      const reminderDocRef = db.collection('users').doc(user.email)
        .collection('events').doc(event.id)
        .collection('reminders').doc(user.uid);
      const doc = await reminderDocRef.get();
      setReminderActive(doc.exists);
    }
  };

  const getReminderCount = async () => {
    const user = firebase.auth().currentUser;
    if (user) {
      const reminderCollectionRef = db.collection('users').doc(user.email)
        .collection('events').doc(event.id)
        .collection('reminders');
      const snapshot = await reminderCollectionRef.get();
      setReminderCount(snapshot.size);
    }
  };

  useEffect(() => {
    checkReminderStatus();
    getReminderCount();
  }, []);

  return (
    <View style={styles.footerContainer}>
      <Icon iconStyle={styles.footerIcon} icon={eventFooterIcons[0].inactive} />
      <View style={styles.registerContainer}>
      <TouchableOpacity
          style={[styles.button, isPastEvent && styles.disabledButton]}
          disabled={isPastEvent}
          onPress={isPastEvent ? null : toggleBookmark} // Toggle bookmark only if event hasn't ended
        >
          <Text>{isPastEvent ? 'Event Ended' : isBookmarked ? 'Remove Bookmark' : 'Bookmark Event'}</Text>
        </TouchableOpacity>
      </View>
      <Divider width={1} orientation="vertical" />
      <Icon
        iconStyle={styles.footerIcon}
        icon={isReminderActive ? eventFooterIcons[1].active : eventFooterIcons[1].inactive}
        onPress={toggleReminder}
      />
      <View style={styles.reminderContainer}>
        <Text>Reminder</Text>
        <Text>Reminders: {reminderCount}</Text>
      </View>
    </View>
  );
};


const Icon = ({ iconStyle, icon, onPress }) => (
  <TouchableOpacity onPress={onPress}>
    <Image style={iconStyle} source={icon} />
  </TouchableOpacity>
);
const Announcements = ({ event }) => {
  const [announcements, setAnnouncements] = useState([]);
  
  useEffect(() => {
    const unsubscribe = db.collection('users').doc(event.owner_email)
    .collection('events').doc(event.id)
    .collection('announcements')
      .orderBy('timestamp', 'desc')
      .onSnapshot(snapshot => {
        const announcementsList = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setAnnouncements(announcementsList);
      });

    return () => unsubscribe();
  }, [event.id]);

  return (
    <View style={styles.announcementsContainer}>
      <Text style={styles.announcementsHeader}>Announcements</Text>
      {announcements.map((announcement) => (
        <View key={announcement.id} style={styles.announcementItem}>
          <Text>{announcement.text}</Text>
          <Text style={styles.announcementOwner}>by {announcement.owner}</Text>
        </View>
      ))}
    </View>
  );
};

const EventLocation = ({ event }) => (
  <View style={styles.locationContainer}>
    <TouchableOpacity style={styles.locationContent}>
      <Text style={styles.locationText}>{event.location}</Text>
      <Divider width={1} orientation="vertical" style={styles.divider} />
      <CountdownTimer eventDate={event.date} eventTime={event.time} />
    </TouchableOpacity>
  </View>
);

const CountdownTimer = ({ eventDate, eventTime }) => {
  const [remainingTime, setRemainingTime] = useState(calculateRemainingTime());

  function calculateRemainingTime() {
    const eventDateTime = moment(`${eventDate} ${eventTime}`, 'YYYY-MM-DD HH:mm A');
    const now = moment();
    const duration = moment.duration(eventDateTime.diff(now));
    return {
      days: duration.days(),
      hours: duration.hours(),
      minutes: duration.minutes(),
      seconds: duration.seconds(),
    };
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setRemainingTime(calculateRemainingTime());
    }, 1000);

    return () => clearInterval(interval);
  }, [eventDate, eventTime]);

  return (
    <View style={styles.countdownContainer}>
      <Text style={styles.countdownText}>
        {remainingTime.days}d {remainingTime.hours}h {remainingTime.minutes}m {remainingTime.seconds}s
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 30,
    width: '100%',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 5,
    flex: 1,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  username: {
    marginLeft: 5,
    fontWeight: '700',
  },
  moreOptions: {
    fontWeight: '900',
    justifyContent: 'space-between',
    width: '50%',
  },
  imageContainer: {
    flex: 1,
    width: '100%',
    height: 500,
  },
  image: {
    height: '100%',
    width: '100%',
    resizeMode: 'cover',
  },
  titleContainer: {
    alignItems: 'center',
    marginTop: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  descContainer: {
    alignItems: 'center',
    marginTop: 10,
  },
  desc: {
    color: 'gray',
  },
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  registerContainer: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  reminderContainer: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#10C000',
    padding: 5,
    width: '100%',
    alignItems: 'center',
    borderRadius: 5,
  },
  disabledButton: {
    backgroundColor: '#cccccc',
  },
  footerIcon: {
    width: 33,
    height: 33,
  },
  attendeesHeader: {
    fontWeight: '600',
    marginLeft: 15,
    marginRight: 5,
    fontSize: 18,
  },
  attendeeContainer: {
    marginLeft: 15,
    marginRight: 5,
  },
  attendeeText: {
    fontWeight: '500',
    color: 'gray',
  },
  locationContainer: {
    backgroundColor: 'red',
    flexDirection: 'column',
    alignItems: 'center',
    flex: 1,
  },
  locationContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '50%',
    padding: 30,
  },
  locationText: {
    color: '#fff',
    fontWeight: '600',
  },
  divider: {
    marginHorizontal: 20,
  },
  countdownContainer: {
    backgroundColor: 'white',
    borderRadius: 30,
 
  },
  countdownText: {
    color: '#000',
    fontWeight: '600',
    margin: 10,
  },
  announcementsContainer: {
    marginHorizontal: 15,
    marginTop: 10,
  },
  announcementsHeader: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 5,
  },
  announcementItem: {
    backgroundColor: '#f9f9f9',
    padding: 10,
    borderRadius: 5,
    marginBottom: 5,
  },
  announcementOwner: {
    fontSize: 12,
    color: 'gray',
    marginTop: 5,
  },
  modalView: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  modalContent: {
    width: '90%',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    width: '100%',
  },
  submitButton: {
    backgroundColor: '#10C000',
    padding: 10,
    borderRadius: 30,
    marginBottom: 20,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#FF0000',
    padding: 10,
    borderRadius: 30,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
  optionButton: {
    backgroundColor: 'white',
    padding: 15,
    marginBottom: 10,
    width: '100%',
    alignItems: 'center',
    borderRadius: 10,
  },
  optionText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default UpcomingEvents;
