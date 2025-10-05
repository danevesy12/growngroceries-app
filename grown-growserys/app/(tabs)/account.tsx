import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import { auth, db, storage } from '../../firebase';
import { signInAnonymously } from 'firebase/auth';

const Account: React.FC = () => {
  useEffect(() => {
    // Anonymous sign-in
    signInAnonymously(auth)
      .then((userCredential) => {
        console.log('Signed in anonymously!', userCredential.user.uid);
      })
      .catch((err) => console.error('Auth error:', err));

    console.log('Firestore instance:', db);
    console.log('Storage instance:', storage);
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Firebase is working in Expo!</Text>
    </View>
  );
};

export default Account;