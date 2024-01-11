import { View, Text, TextInput, Button } from 'react-native';
import React, { useState, useContext } from 'react';
import { addDoc, setDoc, collection, doc, getDoc } from 'firebase/firestore';
import { UserContext } from '../../src/contexts/UserContext';
import { InstanceContext } from '../../src/contexts/InstanceContext';
import { FIREBASE_DB } from '../../FirebaseConfig';

export default function Settings() {
    const [instanceId, setInstanceId] = useState('');
    const [instanceTitle, setInstanceTitle] = useState('');
    const [user, setUser] = useContext(UserContext);
    const [instance, setInstance] = useContext(InstanceContext);

    async function joinInstance() {
        if (instanceId) {
            const doc = await getDoc(doc(FIREBASE_DB, "instances/" + instanceId));
            if (doc.exists()) {
                const title = await doc.data().title;
                await setDoc(doc(FIREBASE_DB, 'users/' + user.uid), { instance: instanceId }, { merge: true })
                setInstance(await getDoc(doc(FIREBASE_DB, "instances/" + instanceId)));
                alert("Successfully joined the following instance: " + title + ".")
            } else {
                alert("This instance does not seem to exist. Check for any mistakes and try again.")
            }
        } else {
            alert("The instance ID cannot be empty.")
        }
    }

    async function createInstance() {
        if (instanceTitle) {
            try {
                const docReference = await addDoc(collection(FIREBASE_DB, 'instances'), { title: instanceTitle, admins: [user.uid] });
                await setDoc(doc(FIREBASE_DB, 'users/' + user.uid), { instance: docReference.id }, { merge: true });
                setInstance(await getDoc(doc(FIREBASE_DB, "instances/" + docReference.id)));
            } catch (error) {
                alert("Could not create instance: " + error)
            } finally {
                alert("You have successfully created an instance with the following title: " + instanceTitle + ".")
            }
        } else {
            alert("The instance title cannot be empty.")
        }
    }

    return (
        <View>
            <Text>Join an existing instance</Text>
            <TextInput value={instanceId} placeholder="ID" autoCapitalize="none" onChangeText={(text) => setInstanceId(text)}></TextInput>
            <Button title="Join Existing Instance" onPress={joinInstance} />
            <Text>Create a new instance</Text>
            <TextInput value={instanceTitle} placeholder="Title" autoCapitalize="words" onChangeText={(text) => setInstanceTitle(text)}></TextInput>
            <Button title="Create New Instance" onPress={createInstance} />
        </View>
    )
}