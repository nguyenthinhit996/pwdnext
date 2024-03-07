import {
  getMessaging,
  getToken,
  onMessage,
  isSupported,
} from "firebase/messaging";
// import { messaging as messagingRecieve } from "@/config/firebase";
import { app } from "@/config/firebase";

// Get registration token. Initially this makes a network call, once retrieved
// subsequent calls to getToken will return from cache.

// const messaging = getMessaging(app);

// const messaging = getMessaging(app);
const messaging = (async () => {
  try {
    const isSupportedBrowser = await isSupported();
    if (isSupportedBrowser) {
      return getMessaging(app);
    }
    console.log("Firebase not supported this browser");
    return null;
  } catch (err) {
    console.log(err);
    return null;
  }
})();
export async function requestPermission(cb, cbToken) {
  Notification.requestPermission().then(async (permission) => {
    try {
      if (permission === "granted") {
        console.log("hehe");
        const messagingResolve = await messaging;
        if (messagingResolve == null) return;
        onMessage(messagingResolve, (_payload) => {
          console.log(_payload);

          cb?.(_payload);
          // Xử lý thông báo ở đây
        });
        try {
          getToken(messagingResolve, {
            vapidKey:
              "BGTHhYZ0eqCQs4xZXH_PgJmdMz2Q4l1PC0k9VpvuKWUcF5wzujjdOJn_QTlu3KgOx2Ehok5cCeyky66JsWqY4sA",
          })
            .then(async (currentToken) => {
              console.log("currentToken, ", currentToken);
              cbToken?.(currentToken || "");
            })
            .catch((e) => {
              console.log("error", e);
            });
        } catch (e) {
          console.log(e);
        }
      } else {
        console.log("Do not have permission!");
      }
    } catch (error) {
      console.log(error);
    }
  });
}

// const getTokenMessaging = getToken(messaging, {
//   vapidKey:
//     "BGTHhYZ0eqCQs4xZXH_PgJmdMz2Q4l1PC0k9VpvuKWUcF5wzujjdOJn_QTlu3KgOx2Ehok5cCeyky66JsWqY4sA",
// })
//   .then((currentToken) => {
//     if (currentToken) {
//       // Send the token to your server and update the UI if necessary
//       // ...
//       console.log("currentToken", currentToken);
//     } else {
//       // Show permission request UI
//       console.log(
//         "No registration token available. Request permission to generate one."
//       );
//       // ...
//     }
//   })
//   .catch((err) => {
//     console.log("An error occurred while retrieving token. ", err);
//     // ...
//   });
