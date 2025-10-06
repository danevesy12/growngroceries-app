import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert, Platform } from "react-native";
import { auth, db } from "../../firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  FacebookAuthProvider,
  OAuthProvider,
  signInWithCredential,
  onAuthStateChanged,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

import * as Google from "expo-auth-session/providers/google";
import * as Facebook from "expo-auth-session/providers/facebook";
import * as AppleAuthentication from "expo-apple-authentication";

export default function AuthScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);

  // --------- Persisted Auth State ---------
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) console.log("User is signed in:", currentUser.uid);
    });
    return () => unsubscribe();
  }, []);

  // ---------- Email Signup ----------
  const handleEmailSignup = async () => {
    if (!email || !password) return Alert.alert("Error", "Please enter email & password");
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const newUser = userCredential.user;
      await setDoc(doc(db, "users", newUser.uid), { email, createdAt: new Date() });
      Alert.alert("Success", "Account created!");
    } catch (err: any) {
      Alert.alert("Signup error", err.message);
    } finally {
      setLoading(false);
    }
  };

  // ---------- Email Login ----------
  const handleEmailLogin = async () => {
    if (!email || !password) return Alert.alert("Error", "Please enter email & password");
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      Alert.alert("Success", "Logged in!");
    } catch (err: any) {
      Alert.alert("Login error", err.message);
    } finally {
      setLoading(false);
    }
  };

  // ---------- Google Login ----------
  const [request, response, promptAsync] = Google.useAuthRequest({
    iosClientId: "199905905793-5tcso51ov8uoglfl9bs0ci7n1flpnc1s.apps.googleusercontent.com",
    androidClientId: "YOUR_ANDROID_GOOGLE_CLIENT_ID.com.danieleves.growngroceries",
    webClientId: "YOUR_WEB_GOOGLE_CLIENT_ID.com.danieleves.growngroceries",
  });

  useEffect(() => {
    if (response?.type === "success") {
      const { id_token, access_token } = response.params;
      const credential = GoogleAuthProvider.credential(id_token, access_token);
      signInWithCredential(auth, credential).catch((err) => Alert.alert("Google login error", err.message));
    }
  }, [response]);

  // ---------- Facebook Login ----------
  const [fbRequest, fbResponse, fbPromptAsync] = Facebook.useAuthRequest({
    clientId: "<YOUR_FACEBOOK_APP_ID>",
  });

  useEffect(() => {
    if (fbResponse?.type === "success") {
      const { accessToken } = fbResponse.authentication!;
      const credential = FacebookAuthProvider.credential(accessToken);
      signInWithCredential(auth, credential).catch((err) => Alert.alert("Facebook login error", err.message));
    }
  }, [fbResponse]);

  // ---------- Apple Login ----------
  const handleAppleLogin = async () => {
    if (Platform.OS !== "ios") return;
    try {
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });
      const provider = new OAuthProvider("apple.com");
      const firebaseCredential = provider.credential({
        idToken: credential.identityToken!,
        rawNonce: "nonce", // optionally generate a random nonce
      });
      signInWithCredential(auth, firebaseCredential).catch((err) => Alert.alert("Apple login error", err.message));
    } catch (err: any) {
      if (err.code !== "ERR_CANCELED") Alert.alert("Apple login error", err.message);
    }
  };

  // ---------- Render ----------
  if (user) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Welcome, {user.email || user.displayName || "User"}!</Text>
        <Button title="Logout" onPress={() => auth.signOut()} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign Up / Login</Text>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        style={styles.input}
        secureTextEntry
      />
      <Button title="Sign Up" onPress={handleEmailSignup} />
      <Button title="Login" onPress={handleEmailLogin} />

      <View style={{ height: 16 }} />
      <Button title="Login with Google" onPress={() => promptAsync()} />
      <Button title="Login with Facebook" onPress={() => fbPromptAsync()} />
      {Platform.OS === "ios" && (
        <AppleAuthentication.AppleAuthenticationButton
          buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
          buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
          cornerRadius={8}
          style={{ width: "100%", height: 44, marginTop: 8 }}
          onPress={handleAppleLogin}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20, textAlign: "center" },
  input: { borderWidth: 1, borderColor: "#ccc", padding: 12, marginBottom: 12, borderRadius: 6 },
});
