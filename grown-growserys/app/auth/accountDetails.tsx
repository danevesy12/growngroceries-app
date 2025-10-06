// app/accountDetails.tsx
import React from "react";
import { View, Text, Button } from "react-native";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase";

export default function AccountScreen({ user }: any) {
  const handleLogout = async () => {
    await signOut(auth);
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={{ fontSize: 18, marginBottom: 10 }}>
        Signed in as {user.email || "Anonymous"}
      </Text>
      <Button title="Log Out" onPress={handleLogout} />
    </View>
  );
}
