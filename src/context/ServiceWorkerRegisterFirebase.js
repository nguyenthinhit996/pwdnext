"use client";
import * as React from "react";
import { useEffect } from "react";

export default function ServiceWorkerRegisterFirebase({ children }) {
  // useEffect(() => {
  //   console.log("ServiceWorkerRegisterFirebase firebase-messaging-sw.js");
  //   if (typeof window !== "undefined" && "serviceWorker" in navigator) {
  //     navigator.serviceWorker
  //       .register("/firebase-messaging-sw.js", { scope: "/" })
  //       .then((registration) => console.log("scope is: ", registration.scope));
  //   }
  // }, []);

  return <>{children}</>;
}
