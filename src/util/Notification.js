import {
  getMessaging,
  getToken,
  onMessage,
  isSupported,
} from "firebase/messaging";
// import { messaging as messagingRecieve } from "@/config/firebase";
import { app } from "@/config/firebase";

import { getUserId } from "@/util/Utils";
import { ModalContext } from "@/context/ModalContext";

import axiosInstance from "@/config/axiosConfig";

export const getTokenFirebase = async () => {
  const messagingResolve = await messaging;
  try {
    getToken(messagingResolve, {
      vapidKey:
        "BGTHhYZ0eqCQs4xZXH_PgJmdMz2Q4l1PC0k9VpvuKWUcF5wzujjdOJn_QTlu3KgOx2Ehok5cCeyky66JsWqY4sA",
    })
      .then(async (currentToken) => {
        console.log("currentToken, ", currentToken);
        updateTokenDevice?.(currentToken || "");
      })
      .catch((e) => {
        console.log("error", e);
      });
  } catch (e) {
    console.log(e);
  }
};

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
export async function requestPermission(cb) {
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
        await getTokenFirebase();
      } else {
        console.log("Do not have permission!");
      }
    } catch (error) {
      console.log(error);
    }
  });
}

export const updateTokenDevice = async (currentToken) => {
  const userId = getUserId();
  console.log("currentToken  ", currentToken);

  const payload = {
    deviceId: currentToken,
  };

  console.log("payload  ", payload);
  console.log("id  ", userId);

  await axiosInstance.put(`/users/${userId}`, payload);
};
