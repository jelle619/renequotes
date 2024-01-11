import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { UserContext } from './src/contexts/UserContext';
import { useState, useEffect, createContext } from 'react';
import { onAuthStateChanged, sendEmailVerification } from 'firebase/auth'
import { FIREBASE_AUTH } from './FirebaseConfig';
import { InstanceContext } from './src/contexts/InstanceContext';

import Login from './app/screens/Login';
import { Button, Text } from 'react-native';
import Authenticated from './app/screens/Authenticated';

const Stack = createNativeStackNavigator();

export default function App() {
  const [user, setUser] = useState(null);
  const [instance, setInstance] = useState(undefined);

  useEffect(() => {
    onAuthStateChanged(FIREBASE_AUTH, (user) => {
      if (user && !user.emailVerified) {
        try {
          sendEmailVerification(user);
          alert("Your e-mail address isn't verified yet. Check your inbox for instructions and sign in again.");
        } catch (error) {
          alert("Sending verification e-mail failed: " + error);
        } finally {
          alert("Your e-mail address isn't verified yet. Check your inbox for instructions and sign in again.");
        }
      } else {
        setUser(user);
      }
    })
  })

  return (
    <UserContext.Provider value={[user, setUser]}>
      <InstanceContext.Provider value={[instance, setInstance]}>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Login">
            {user ?
              <Stack.Screen name="Authenticated" component={Authenticated} options={{ headerShown: false }} /> :
              <Stack.Screen name="Login" component={Login} />}
          </Stack.Navigator>
        </NavigationContainer>
      </InstanceContext.Provider>
    </UserContext.Provider>
  );
};