import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native';
import { useContext } from 'react';
import { UserContext } from "../../App.js";
import { doc, getDoc } from "firebase/firestore";
import { FIREBASE_DB } from '../../FirebaseConfig';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import Settings from './Settings';
import Account from './Account';
import Main from './Main';

import { Button, Text } from 'react-native';

const Tab = createBottomTabNavigator();

export default function Authenticated() {
    const user = useContext(UserContext);
    // const userDoc = getDoc(doc(FIREBASE_DB, "users", user.uid));
    // const instanceDoc = getDoc(doc(FIREBASE_DB, "instances", doc.instance));

    var userInitialized = false;
    // if (userDoc.exists() && userDoc.instance != null && instanceDoc.exists) userInitialized = true;

    return (
        <NavigationContainer independent={true}>
            <Tab.Navigator initialRouteName="Main">
                <Tab.Screen name="Account" component={Account} />
                <Tab.Screen name="Main" component={Main} />
                <Tab.Screen name="Settings" component={Settings} />
            </Tab.Navigator>
        </NavigationContainer>
    );
};