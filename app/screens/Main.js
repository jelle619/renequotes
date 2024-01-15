import { View, Text, FlatList, TextInput, Button } from 'react-native'
import React, { useState, useContext } from 'react'
import { doc, setDoc, getDocs, addDoc, collection, query } from 'firebase/firestore'
import { FIREBASE_DB } from '../../FirebaseConfig'
import { InstanceContext } from '../../src/contexts/InstanceContext'

// It is possibly a good idea to divide up this function, the if statement is making it quite long
export default function Main() {
    const [instance, setInstance] = useContext(InstanceContext);
    const [newItem, setNewItem] = useState(null);

    const addNewTask = async() => {
        await addDoc(collection(FIREBASE_DB, 'instances/' + instance.id + "/tasks"), { title: newItem, inProgress: false, done: false });
        setNewItem(null);
    }

    const fetchTasks = async() => {
        var tasks = [];
        const document = await getDocs(collection(FIREBASE_DB, "instance/" + instance.id + "/tasks"));
        console.log(document);
        document.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            console.log(doc);
            console.log(doc.data());
            // console.log(doc.id, " => ", doc.data());
            // tasks.push(doc.data());
          });
        // console.log(tasks);
    }

    if (instance === undefined) { // instance data is loading
        return (
            <View>
                <Text>Loading</Text>
            </View>
        )
    } else if (instance === null) { // user is in no instance
        return (
            <View>
                <Text>It looks like you haven't joined an instance yet. Visit the Settings to get started.</Text>
            </View>
        )
    } else if (instance) { // instance data loaded
        fetchTasks();
        return (
            <View>
                <Text>You are part of an instance! Amazing!</Text>
                <FlatList
                    data={[
                        { key: 'Devin' },
                        { key: 'Dan' },
                        { key: 'Dominic' },
                        { key: 'Jackson' },
                        { key: 'James' },
                        { key: 'Joel' },
                        { key: 'John' },
                        { key: 'Jillian' },
                        { key: 'Jimmy' },
                        { key: 'Julie' },
                    ]}
                    renderItem={({ item }) => <Text>{item.key}</Text>}
                />
                <TextInput value={newItem} placeholder="Create new item" autoCapitalize="sentences" onChangeText={(text) => setNewItem(text)}></TextInput>
                <Button title="Add" onPress={addNewTask}/>
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