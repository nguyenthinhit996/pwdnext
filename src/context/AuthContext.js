"use client";
import { createContext, useState, useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { app } from "@/config/firebase";
import axiosInstance from "@/config/axiosConfig";

const auth = getAuth(app);

export const AuthContext = createContext({
  user: null,
  setUser: () => {},
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const getUserIdApi = async (localId) => {
      try {
        const { data } = await axiosInstance.get(
          `/users?firebase_id=${localId}`
        );
        if (data?.[0]) {
          setUser((prev) => ({ ...prev, userId: data[0].id }));
        }
      } catch (error) {
        throw error;
      }
    };

    getUserIdApi(user?.uid);
  }, [user?.uid]);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};
