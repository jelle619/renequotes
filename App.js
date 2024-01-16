import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useState, useEffect, createContext } from 'react';
import { onAuthStateChanged, sendEmailVerification, signOut } from 'firebase/auth'
import { FIREBASE_AUTH, FIREBASE_DB } from './FirebaseConfig';
import { getDoc, getDocs, doc, collection } from 'firebase/firestore';

import { UserContext } from './src/contexts/UserContext';
import { InstanceContext } from './src/contexts/InstanceContext';
import { TasksContext } from './src/contexts/TasksContext';


import Login from './app/screens/Login';
import { Button, Text } from 'react-native';
import Authenticated from './app/screens/Authenticated';

const Stack = createNativeStackNavigator();

export default function App() {
  const [user, setUser] = useState(null);
  const [instance, setInstance] = useState(undefined);
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    onAuthStateChanged(FIREBASE_AUTH, (user) => {
      if (user && !user.emailVerified) {
        try {
          sendEmailVerification(user);
          alert("Your e-mail address isn't verified yet. Check your inbox for instructions and sign in again.");
          signOut(FIREBASE_AUTH);
        } catch (error) {
          alert("Sending verification e-mail failed: " + error);
        } finally {
          alert("Your e-mail address isn't verified yet. Check your inbox for instructions and sign in again.");
        }
      } else {
        setUser(user);
        if (user) getInstanceAndTasks(user);
      }
    })
  }, [])

  const getInstanceAndTasks = async (user) => {
    try {
      const userDoc = await getDoc(doc(FIREBASE_DB, "users/" + user.uid));
      const userData = await userDoc.data();
      const instanceDoc = await getDoc(doc(FIREBASE_DB, "instances/" + userData.instance));
      if (instanceDoc.exists()) {
        const instanceData = await instanceDoc.data();
        instanceData["id"] = instanceDoc.id;
        setInstance(instanceData);

        var tasks = [];
        const taskDocs = await getDocs(collection(FIREBASE_DB, "instances/" + instanceDoc.id + "/tasks"));
        taskDocs.forEach((doc) => {
          const taskData = doc.data();
          taskData["id"] = doc.id;
          tasks.push(taskData);
        });
        setTasks(tasks);
      } else {
        setInstance(null);
        setTasks([]);
      }
    } catch (error) {
      alert("An error occurred while retrieving instance and task data: " + error)
    }
  }

  return (
    <UserContext.Provider value={[user, setUser]}>
      <InstanceContext.Provider value={[instance, setInstance]}>
        <TasksContext.Provider value={[tasks, setTasks]}>
          <NavigationContainer>
            <Stack.Navigator initialRouteName="Login">
              {user ?
                <Stack.Screen name="Authenticated" component={Authenticated} options={{ headerShown: false }} /> :
                <Stack.Screen name="Login" component={Login} />}
            </Stack.Navigator>
          </NavigationContainer>
        </TasksContext.Provider>
      </InstanceContext.Provider>
    </UserContext.Provider>
  );
};