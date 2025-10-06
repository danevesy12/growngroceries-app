import React, { useEffect, useState } from "react";
import { View, ActivityIndicator } from "react-native";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../firebase";

import AuthScreen from "../auth/login";        // login/signup
import AccountScreen from "../auth/accountDetails";



export default function AccountTab() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) return <ActivityIndicator style={{ flex: 1 }} />;

  return user ? <AccountScreen /> : <AuthScreen />;
}

