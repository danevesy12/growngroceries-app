import React, { useState, useEffect } from "react";
import {
  View, Text, TouchableOpacity,
  StyleSheet, Alert, Platform, Image,
} from "react-native";
import { auth } from "../../firebase";
import {
  GoogleAuthProvider,
  FacebookAuthProvider,
  OAuthProvider,
  signInWithCredential,
  onAuthStateChanged,
} from "firebase/auth";

import * as Google from "expo-auth-session/providers/google";
import * as Facebook from "expo-auth-session/providers/facebook";
import * as AppleAuthentication from "expo-apple-authentication";

export default function AuthScreen() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  // ---------- Google Login ----------
  const [, response, promptAsync] = Google.useAuthRequest({
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
  const [, fbResponse, fbPromptAsync] = Facebook.useAuthRequest({
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
        rawNonce: "nonce",
      });
      signInWithCredential(auth, firebaseCredential).catch((err) => Alert.alert("Apple login error", err.message));
    } catch (err: any) {
      if (err.code !== "ERR_CANCELED") Alert.alert("Apple login error", err.message);
    }
  };

  if (user) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Welcome, {user.email || user.displayName || "User"}!</Text>
        <TouchableOpacity style={styles.emailButton} onPress={() => auth.signOut()}>
          <Text style={styles.emailButtonText}>Log out</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Log in</Text>

      {/* Google */}
      <TouchableOpacity style={styles.googleButton} onPress={() => promptAsync()}>
        <Image
          source={{ uri: "https://developers.google.com/identity/images/g-logo.png" }}
          style={styles.socialLogo}
        />
        <Text style={styles.googleButtonText}>Sign in with Google</Text>
      </TouchableOpacity>

      {/* Facebook */}
      <TouchableOpacity style={styles.facebookButton} onPress={() => fbPromptAsync()}>
        <Text style={styles.facebookF}>f</Text>
        <Text style={styles.facebookButtonText}>Continue with Facebook</Text>
      </TouchableOpacity>

      {/* Apple */}
      {Platform.OS === "ios" && (
        <AppleAuthentication.AppleAuthenticationButton
          buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
          buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
          cornerRadius={8}
          style={styles.appleButton}
          onPress={handleAppleLogin}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 24, backgroundColor: "#FDF7E9" },
  title: { fontSize: 28, fontWeight: "700", marginBottom: 24, textAlign: "center", color: "#531D1D" },

  emailButton: {
    backgroundColor: "#531D1D", borderRadius: 8,
    paddingVertical: 14, alignItems: "center", marginBottom: 8,
  },
  emailButtonText: { color: "#fff", fontSize: 16, fontWeight: "600" },

  // Google — white card style
  googleButton: {
    flexDirection: "row", alignItems: "center", justifyContent: "center",
    backgroundColor: "#fff", borderRadius: 8, paddingVertical: 12,
    marginBottom: 12, borderWidth: 1, borderColor: "#ddd",
    shadowColor: "#000", shadowOpacity: 0.08, shadowRadius: 4, shadowOffset: { width: 0, height: 1 },
    elevation: 2,
  },
  socialLogo: { width: 20, height: 20, marginRight: 10, resizeMode: "contain" },
  googleButtonText: { color: "#3c4043", fontSize: 16, fontWeight: "500" },

  // Facebook — blue style
  facebookButton: {
    flexDirection: "row", alignItems: "center", justifyContent: "center",
    backgroundColor: "#1877F2", borderRadius: 8, paddingVertical: 12, marginBottom: 12,
  },
  facebookF: { color: "#fff", fontSize: 20, fontWeight: "800", marginRight: 10 },
  facebookButtonText: { color: "#fff", fontSize: 16, fontWeight: "600" },

  appleButton: { width: "100%", height: 50, marginBottom: 12 },
});
