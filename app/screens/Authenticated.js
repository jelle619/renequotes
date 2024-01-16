import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native';
import { useContext } from 'react';
import { UserContext } from '../../src/contexts/UserContext';
import { doc, getDoc } from "firebase/firestore";
import { FIREBASE_DB } from '../../FirebaseConfig';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { InstanceContext } from '../../src/contexts/InstanceContext.js';

import Settings from './Settings';
import Account from './Account';
import Main from './Main';

import { Button, Text } from 'react-native';

const Tab = createBottomTabNavigator();

export default function Authenticated() {

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