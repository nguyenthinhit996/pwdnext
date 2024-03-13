// importScripts("https://www.gstatic.com/firebasejs/9.8.2/firebase-app.js"); // Updated version
// importScripts("https://www.gstatic.com/firebasejs/9.8.2/firebase-messaging.js"); // Updated version

importScripts(
  "https://cdnjs.cloudflare.com/ajax/libs/firebase/10.8.1/firebase-app-compat.min.js"
);
importScripts(
  "https://cdnjs.cloudflare.com/ajax/libs/firebase/10.8.1/firebase-messaging-compat.min.js"
);

// Assuming you've replaced placeholders with your actual Firebase project configuration
firebase.initializeApp({
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
  measurementId: "YOUR_MEASUREMENT_ID",
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
