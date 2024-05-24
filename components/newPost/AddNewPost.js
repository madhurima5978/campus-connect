import { View, ActivityIndicator, Text, StyleSheet,Image, TouchableOpacity } from 'react-native'
import React, {useState, useEffect} from 'react'
import { Divider } from 'react-native-elements';
import FormikPostUploader from './FormikPostUploader';
import FormikUnofficialPostUploader from './FormikUnofficialPostUploader';
import 'react-native-gesture-handler';
import * as ImagePicker from 'expo-image-picker';
import Constants from 'expo-constants';
import { firebase, db } from '../../firebase';

const AddNewPost = ({navigation}) => {
    const [loading, setLoading] = useState(true);
    const [isOfficial, setIsOfficial] = useState(null);

    useEffect(() => {
        const fetchIsOfficialStatus = async () => {
            try {
                const user = firebase.auth().currentUser;
                const doc = await db.collection('users').doc(user.email).get();

                if (doc.exists) {
                    setIsOfficial(doc.data().isOfficial);
                }
            } catch (error) {
                console.error('Error fetching isOfficial status:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchIsOfficialStatus();
    }, []);

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    return(
        <View style={styles.container}>
            <Header navigation={navigation}/>
             
            {isOfficial
                ? <FormikPostUploader navigation={navigation} />
                : <FormikUnofficialPostUploader navigation={navigation} />}
            
        </View>
    )
}
const Header = ({navigation}) => {
  return (
    <View style={styles.headerContainer}>
        <TouchableOpacity onPress={()=>navigation.goBack()}>
        <Image source ={{uri: 'https://img.icons8.com/ios-glyphs/90/000000/back.png'}}
        style={{width:30, height:30}}/>
      </TouchableOpacity>
      <Text style={styles.headerText}>New Post</Text>
      <Text></Text>
      
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
        marginHorizontal: 10
    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop:10,
        marginBottom:10
    },
    headerText: {
        fontWeight: '700',
        fontSize: 20,
        marginRight: 25,
        
    },
})

export default AddNewPost