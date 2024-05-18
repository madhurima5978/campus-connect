var admin = require("firebase-admin");

var serviceAccount = require("C:/Users/DELL/Apps/campusconn/service-json/campusconn-b167a-firebase-adminsdk-i6ec5-5fe3302602.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

// Example usage: Get a reference to the Firestore service
var db = admin.firestore();

console.log("Firebase Admin SDK initialized successfully.");

// exports.helloWorld = functions.https.onRequest((request, response) => {
//     response.send("Hello from Firebase!");
//   });

// exports.sendReminderNotification = functions.firestore
//     .document('events/{eventId}/reminders/{userId}')
//     .onCreate(async (snapshot, context) => {
//         const eventId = context.params.eventId;
//         const userId = context.params.userId;

//         // Fetch event details
//         const eventDoc = await admin.firestore().collection('events').doc(eventId).get();
//         const event = eventDoc.data();

//         // Fetch user details
//         const userDoc = await admin.firestore().collection('users').doc(userId).get();
//         const user = userDoc.data();

//         const payload = {
//             notification: {
//                 title: `Reminder for ${event.title}`,
//                 body: `Don't forget about the event happening on ${event.date}`,
//                 click_action: 'FLUTTER_NOTIFICATION_CLICK' // Ensure this matches your app's routing
//             },
//             token: user.fcmToken // Ensure you store the FCM token in the user's profile
//         };

//         // Send notification
//         try {
//             await admin.messaging().send(payload);
//             console.log('Notification sent successfully');
//         } catch (error) {
//             console.error('Error sending notification:', error);
//         }
//     });
