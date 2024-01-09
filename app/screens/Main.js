import { View, Text } from 'react-native'
import React, { useState, useContext } from 'react'
import { doc, getDoc } from 'firebase/firestore'
import { FIREBASE_DB } from '../../FirebaseConfig'
import { UserContext } from '../../App'


export default function Main({ navigation }) {

    const [loading, setLoading] = useState(true);
    const [instance, setInstance] = useState(null);

    const getInstance = async () => {
        const user = useContext(UserContext);
    
        const userDoc = await getDoc(doc(FIREBASE_DB, "users/" + user.uid));
        const userData = userDoc.data();
        const instanceDoc = await getDoc(doc(FIREBASE_DB, "instances/" + userData.instance));
        const instanceData = instanceDoc.data();

        setInstance(instanceData);
        setLoading(false);
    }

    getInstance();

    if (loading && !instance) {
        return (
            <View>
                <Text>Loading</Text>
            </View>
        )
    } else if (!loading && !instance) {
        return (
            <View>
                <Text>It looks like you haven't joined an instance yet. Visit the Settings to get started.</Text>
            </View>
        )
    } else if (!loading && instance) {
        return (
            <View>
                <Text>You are part of an instance! Amazing!</Text>
            </View>
        )
    } else {
        return (
            <View>
                <Text>Something went wrong. Please restart the app and try again. If the problem persists, try again later.</Text>
            </View>
        )
    }
}