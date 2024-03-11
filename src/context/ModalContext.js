"use client";
import { createContext, useState } from "react";
const mockNotifications = [
  {
    id: 0,
    title: "First notification",
    body: {
      taskId: 4,
      text: "New package will arrive",
    },
    isRead: true,
  },
  {
    id: 1,
    title: "Second notification",
    body: {
      taskId: 5,
      text: "New package will arrive",
    },
    isRead: false,
  },
];

export const ModalContext = createContext({
  open: false,
  setOpen: () => {},
});

export const ModalProvider = ({ children }) => {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState(mockNotifications);

  const handleOnMessage = (message) => {
    console.log("MSG: ", message);
    const newMessage = {
      messageId: message.messageId,
      ...message.notification,
      isRead: false,
    };
    setNotifications((prev) => [newMessage, ...prev]);
  };

  const handleViewMessage = (id) => {
    const index = notifications.findIndex((msg) => msg.id === id);
    const newNotifications = [...notifications];
    newNotifications[index].isRead = true;
    setNotifications(newNotifications);
  };

  return (
    <ModalContext.Provider
      value={{
        open,
        setOpen,
        notifications,
        setNotifications,
        handleOnMessage,
        handleViewMessage,
      }}
    >
      {children}
    </ModalContext.Provider>
  );
};
