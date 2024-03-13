importScripts(
  "https://cdnjs.cloudflare.com/ajax/libs/firebase/10.8.1/firebase-app-compat.min.js"
);
importScripts(
  "https://cdnjs.cloudflare.com/ajax/libs/firebase/10.8.1/firebase-messaging-compat.min.js"
);

firebase.initializeApp({
  apiKey: "AIzaSyAia2Xqdgzh2SIE_waNbMXVZYW6_2Vrfwk",
  authDomain: "servicepwa-dac50.firebaseapp.com",
  projectId: "servicepwa-dac50",
  storageBucket: "servicepwa-dac50.appspot.com",
  messagingSenderId: "1054034773298",
  appId: "1:1054034773298:web:44449e01304240b6b0432b",
  measurementId: "G-0C8B941HW7",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
  };

  return self.registration.showNotification(
    notificationTitle,
    notificationOptions
  );
});
