"use client";
import { createContext, useState, useEffect, use } from "react";
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
    const getUserIdApi = async () => {
      try {
        const { data } = await axiosInstance.get(
          `/users?firebase_id=${user?.uid}`
        );
        if (data?.[0]) {
          setUser((prev) => ({ ...prev, userId: Number.parseInt(data[0].id) }));
        }
      } catch (error) {
        throw error;
      }
    };

    if (user?.uid) {
      getUserIdApi();
    }
  }, [user?.uid]);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};
