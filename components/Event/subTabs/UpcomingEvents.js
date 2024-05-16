import { View, Text, StyleSheet, Image, TouchableOpacity, FlatList} from 'react-native'
import React, {useState, useEffect} from 'react'
import { Divider } from 'react-native-elements';
import moment from 'moment';

const eventFooterIcons = [
  {
      name: 'register',
      active: require('../../../assets/verify.png'),
      inactive: require('../../../assets/verify.png'),
  },
  {
      name: 'reminder',
      active: require('../../../assets/bell_active.png'),
      inactive: require('../../../assets/bell_inactive.png'),
  },

]

const UpcomingEvents = ({ event }) => {

  return (
      <View style={styles.container}>
        <Divider width={1} orientation='vertical' />
        <EventHeader event={event}/>
        <EventImage event={event}/>
        <EventTitle event={event} />
        <Eventdesc event={event}/>
        <EventLocation event={event}/>
        <View style={{marginHorizontal: 15, marginTop: 10}}>
          <EventFooter  event={event}/>
        </View>
        <RegisteredCandidates event={event}/>
        
      </View>
  );
};

const EventHeader = ({ event }) => {
  return (
    <View style={{
      flexDirection: 'row',
      justifyContent: 'space-between',
      //margin: 5,
      alignItems: 'center',
      backgroundColor:'white',
      padding:5,
      
    }}>

    
    <View style={{flexDirection: 'row', alignItems: 'center', justifyContent:'space-between'}}>
      <Image source={{uri: event.profile_picture}} style={styles.pfp} />
      <Text style={{marginLeft: 5, fontWeight: '700'}}>
        {event.user}</Text>

    </View>
    <Text style={{fontWeight: '900', justifyContent: 'space-between', width:'6%'}}>...</Text>
    </View>
  );
};

const EventImage = ({event}) => {
  if(event.imageUrl){
  return(
    <View style={{
      flex: 1,
      width: '100%',
      height: 500,
    }}>
    <Image
    source={{uri: event.imageUrl}}
     style={{height: '100%', width:'100%', resizeMode: 'cover'}}
     />
     </View>
    )}
    
}

const EventTitle = ({event}) => {
    return(
      <View style={{alignItems: 'center',marginTop: 10,}}> 
        <Text style={{fontSize: 24,fontWeight: 'bold', textAlign: 'center',}}>{event.eventName}</Text>
      </View>
    )
}
const Eventdesc = ({event}) => {
  return(
    <View style={{alignItems: 'center',marginTop: 10,}}>
      <Text style={{color: 'gray'}}>{event.desc}</Text>
    </View>
  )
}
const EventFooter = ({ event }) => {
  const [isReminderActive, setReminderActive] = useState(false);
  const toggleReminder = () => {
    setReminderActive(!isReminderActive);
  };
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
      <Icon iconStyle={styles.footerIcon} icon={eventFooterIcons[0].inactive} />
      <View style={{ flexDirection: 'column', alignItems: 'center' }}>
        <TouchableOpacity style={{backgroundColor:'#10C000', padding:5, width:'100%', alignItems:'center', borderRadius: 5}}>
          <Text>Register</Text>
        </TouchableOpacity>
        <Text>Registered: {event.registrations}</Text>
      </View>
      <Divider width={1} orientation='vertical' />
      <Icon
        iconStyle={styles.footerIcon}
        icon={isReminderActive ? eventFooterIcons[1].active : eventFooterIcons[1].inactive}
        onPress={toggleReminder}
      />
      
      <Text>Reminder</Text>
    </View>
  );
};

const Icon = ({ iconStyle, icon, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <Image style={iconStyle} source={icon} />
    </TouchableOpacity>
  );
};
const RegisteredCandidates = ({event}) => {
  return(
    <>
    <Text  style={{ fontWeight:'600', marginLeft:15, marginRight:5, fontSize:18}}>Attendees:</Text>
    {event.attendees.map((event, index) => (

      <View key={index}  style={{ marginLeft:15, marginRight:5}}>
        
        <Text>
          
          <Text style={{fontWeight: '500', color:'gray'}}>{event.user} </Text>
        </Text>
      </View>
    ))}
    </>
  )
}

const EventLocation =({event}) => {
  return(
    <View style={{backgroundColor:'red', flexDirection: 'column', alignItems: 'center', flex: 1, }}>
      
        <TouchableOpacity style={{flexDirection:'row', alignItems:'center', justifyContent: 'center', width:'50%', padding:30 }}>
            <View>
              <Text style={{color: '#fff', fontWeight:'600'}}>{event.location}</Text>
            </View>
            <Divider width={1} orientation='vertical'  style={{ marginHorizontal: 20 }}/>
            <View>
              <CountdownTimer eventDate={event.date} eventTime={event.time}/>
            </View>
        </TouchableOpacity>
        
      
      
    </View>
  )
}

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
    <View style={{backgroundColor: 'white', borderRadius:30}}>
      <Text style={{color: '#000', fontWeight:'600', margin:10}}>{remainingTime.days}d {remainingTime.hours}h {remainingTime.minutes}m {remainingTime.seconds}s</Text>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    marginBottom: 30,
    width: '100%',
  },
  
  pfp: {
    width: 35,
    height: 35,
    borderRadius: 50,
    marginLeft: 6,
    borderWidth: 1.6,
    borderColor: '#ff8501',
  },
  footerIcon: {
    width: 33,
    height: 33,
  },
  leftFooterIconsContainer: {
    flexDirection: 'row',
    width: '40%',
    justifyContent: 'space-between',
  },
})

export default UpcomingEvents;