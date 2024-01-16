import { View, Text, FlatList, TextInput, Button, Alert, KeyboardAvoidingView, StyleSheet, ActivityIndicator } from 'react-native'
import React, { useState, useContext } from 'react'
import { doc, setDoc, deleteDoc, getDocs, addDoc, collection } from 'firebase/firestore'
import { FIREBASE_DB } from '../../FirebaseConfig'

import { InstanceContext } from '../../src/contexts/InstanceContext'
import { TasksContext } from '../../src/contexts/TasksContext'

// It is possibly a good idea to divide up this function, the if statement is making it quite long
export default function Main() {
    const [instance, setInstance] = useContext(InstanceContext);
    const [tasks, setTasks] = useContext(TasksContext);
    const [newItem, setNewItem] = useState(null);
    const [refreshing, setRefreshing] = useState(false);
    const [filter, setFilter] = useState(0);
    const [filterName, setFilterName] = useState("Planned");

    const addTask = async () => {
        if (newItem != null) {
            setTasks(tasks.concat([{ "status": 0, "title": newItem, "date": new Date() }]))
            setNewItem(null);
            try {
                const document = await addDoc(collection(FIREBASE_DB, 'instances/' + instance.id + "/tasks"), { title: newItem, date: new Date(), status: 0 });
                setTasks(tasks.concat([{ "id": document.id, "status": 0, "title": newItem, "date": new Date() }]))
            } catch (error) {
                alert("Task couldn't be saved to database: " + error)
            }
        } else {
            alert("Task name cannot be empty.")
        }
    }

    const removeTask = async (task) => {
        const taskDoc = doc(FIREBASE_DB, "instances/" + instance.id + "/tasks/" + task.id);
        setTasks(tasks.filter(entry => entry.id !== task.id));
        try {
            await deleteDoc(taskDoc);
        } catch (error) {
            alert("Could not remove task from database: " + error)
        }
    }

    const removeTaskPrompt = (task) => {
        Alert.alert(
            'Delete Task',
            "\"" + task.title + "\" will be permanently deleted.",
            [
                {
                    text: 'Cancel',
                    style: 'cancel'
                },
                {
                    text: 'OK',
                    onPress: () => { removeTask(task) }
                }
            ]
        );
    }

    const refreshTasks = async () => {
        setRefreshing(true);
        var tasks = [];
        const taskDocs = await getDocs(collection(FIREBASE_DB, "instances/" + instance.id + "/tasks"));
        taskDocs.forEach((doc) => {
            const taskData = doc.data();
            taskData["id"] = doc.id;
            tasks.push(taskData);
        });
        setTasks(tasks);
        setRefreshing(false);
    }

    const changeTaskStatus = async (task, status) => {
        const taskDoc = doc(FIREBASE_DB, "instances/" + instance.id + "/tasks/" + task.id)
        const updatedTasks = tasks.map(entry => {
            if (entry.id === task.id) {
                return { ...entry, status: status };
            }
            return entry;
        });
        setTasks(updatedTasks);
        await setDoc(taskDoc, { status: status }, { merge: true });
    }

    const parseTasks = () => {
        var filteredTasks = tasks;
        if (filter != null) filteredTasks = tasks.filter(entry => entry.status === filter);
        const sortedTasks = filteredTasks.sort((a, b) => new Date(a.date) - new Date(b.date));
        return sortedTasks;
    }

    const cycleFilter = () => {
        if (filter === 0) {
            setFilter(1);
            setFilterName("In progress");
        } else if (filter === 1) {
            setFilter(2);
            setFilterName("Done");
        } else if (filter === 2) {
            setFilter(0);
            setFilterName("Planned");
        }
    }

    if (instance === undefined) { // instance data is loading
        return (
            <View>
                <ActivityIndicator size={'large'} />
            </View>
        )
    } else if (instance === null) { // user is in no instance
        return (
            <View>
                <Text>It looks like you haven't joined an instance yet. Visit the Settings to get started.</Text>
            </View>
        )
    } else if (instance) { // instance data loaded
        return (
            <View style={styles.container}>
                <Button title={"Showing " + filterName + " tasks"} onPress={() => cycleFilter()} />
                <FlatList
                    style={styles.list}
                    data={parseTasks()}
                    renderItem={({ item }) => <>
                        <Text>{item.title}</Text>
                        <Button title="Planned" onPress={() => changeTaskStatus(item, 0)} disabled={item.status === 0} />
                        <Button title="In progress" onPress={() => changeTaskStatus(item, 1)} disabled={item.status === 1} />
                        <Button title="Done" onPress={() => changeTaskStatus(item, 2)} disabled={item.status === 2} />
                        <Button title="Remove" onPress={() => removeTaskPrompt(item)} />
                    </>
                    }
                    onRefresh={refreshTasks}
                    refreshing={refreshing}
                />
                <TextInput style={styles.input} value={newItem} placeholder="Create new item" autoCapitalize="sentences" onChangeText={(text) => setNewItem(text)}></TextInput>
                <Button title="Add" onPress={addTask} />
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

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center'
    },
    list: {
        // paddingVertical: 8
    },
    input: {
        height: 50,
        // borderWidth: 1,
        // borderRadius: 4,
        padding: 10,
        backgroundColor: '#fff'
    }
})