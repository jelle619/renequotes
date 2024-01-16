import { View, Text, TextInput, Button, Share, StyleSheet, KeyboardAvoidingView, Alert } from 'react-native';
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
                Alert.alert(
                    'Successfully joined instance',
                    'You successfully joined ' + title + ' with instance ID ' + instanceId + '.',
                    [
                        {
                            text: 'OK',
                        }
                    ]
                );
            } else {
                alert("This instance does not seem to exist. Check for any mistakes and try again.")
                Alert.alert(
                    'Instance does not exist',
                    'The instance ID you have entered does not seem to exist. Check for any mistakes and try again.',
                    [
                        {
                            text: 'OK',
                        }
                    ]
                );
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
                Alert.alert(
                    'Instance creation',
                    'You successfully joined ' + title + ' with instance ID ' + instanceId + '.',
                    [
                        {
                            text: 'OK',
                        }
                    ]
                );
            }
        } else {
            alert("The instance title cannot be empty.")
        }
    }

    return (
        <View style={styles.container}>
            {instance && <>
                <View>
                <Text>{"Current instance ID: " + instance.id}</Text>
                <Button title="Invite others to instance" onPress={() => Share.share({message: instance.id})}/>
                </View>
            </>}

            <KeyboardAvoidingView>
            <Text>Join an existing instance</Text>
            <TextInput style={styles.input} value={instanceId} placeholder="ID" autoCapitalize="none" onChangeText={(text) => setInstanceId(text)}></TextInput>
            <Button title="Join Existing Instance" onPress={joinInstance} />
            </KeyboardAvoidingView>

            <KeyboardAvoidingView>
            <Text>Create a new instance</Text>
            <TextInput style={styles.input} value={instanceTitle} placeholder="Title" autoCapitalize="words" onChangeText={(text) => setInstanceTitle(text)}></TextInput>
            <Button title="Create New Instance" onPress={createInstance} />
            </KeyboardAvoidingView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        marginHorizontal: 20,
        gap: 10,
        flex: 1,
        justifyContent: 'center'
    },
    input: {
        marginVertical: 4,
        height: 50,
        borderWidth: 1,
        borderRadius: 4,
        padding: 10,
        backgroundColor: '#fff'
    }
})