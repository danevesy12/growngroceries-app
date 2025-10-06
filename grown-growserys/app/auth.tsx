// app/auth.tsx
import React, { useState } from "react";
import { View, TextInput, Button, Text, StyleSheet, Alert } from "react-native";
import { auth , db } from "../firebase"; // <-- path to your firebase.ts
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";


export default function AuthScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isLogin, setIsLogin] = useState(true);

  const handleAuth = async () => {
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
        Alert.alert("Welcome back!");
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        await setDoc(doc(db, "users", user.uid), {
          name,
          email,
          createdAt: new Date().toISOString(),
        });
        Alert.alert("Account created successfully!");
      }
    } catch (err: any) {
      console.error(err);
      Alert.alert("Error", err.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {isLogin ? "Sign In" : "Create Account"}
      </Text>

      {!isLogin && (
        <TextInput
          placeholder="Full name"
          style={styles.input}
          value={name}
          onChangeText={setName}
        />
      )}
      <TextInput
        placeholder="Email"
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />
      <TextInput
        placeholder="Password"
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button title={isLogin ? "Sign In" : "Sign Up"} onPress={handleAuth} />

      <Text
        style={styles.switchText}
        onPress={() => setIsLogin(!isLogin)}
      >
        {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20 },
  title: { fontSize: 24, fontWeight: "600", marginBottom: 20, textAlign: "center" },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  switchText: {
    color: "#007AFF",
    textAlign: "center",
    marginTop: 12,
  },
});
