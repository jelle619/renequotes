import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native';
import { useContext } from 'react';
import { UserContext } from '../../src/contexts/UserContext';
import { doc, getDoc } from "firebase/firestore";
import { FIREBASE_DB } from '../../FirebaseConfig';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { InstanceContext } from '../../src/contexts/InstanceContext.js';

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import Settings from './Settings';
import Account from './Account';
import Main from './Main';

import { Button, Text } from 'react-native';

const Tab = createBottomTabNavigator();

export default function Authenticated() {

    return (
        <NavigationContainer independent={true}>
            <Tab.Navigator initialRouteName="Main">
                <Tab.Screen name="Account" component={Account} options={{
                    tabBarIcon: ({ color, size }) => (
                        <MaterialCommunityIcons name="account" color={color} size={size} />
                    ),
                }} />
                <Tab.Screen name="Quotes" component={Main} options={{
                    tabBarIcon: ({ color, size }) => (
                        <MaterialCommunityIcons name="checkbox-marked" color={color} size={size} />
                    ),
                }} />
                <Tab.Screen name="Settings" component={Settings} options={{
                    tabBarIcon: ({ color, size }) => (
                        <MaterialIcons name="settings" color={color} size={size} />
                    ),
                }} />
            </Tab.Navigator>
        </NavigationContainer>
    );
};