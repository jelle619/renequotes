import { View, Text, FlatList, TextInput, Button, Alert, Modal, Pressable, KeyboardAvoidingView, StyleSheet, ActivityIndicator } from 'react-native'
import React, { useState, useContext } from 'react'
import { doc, setDoc, deleteDoc, getDocs, addDoc, collection } from 'firebase/firestore'
import { FIREBASE_DB } from '../../FirebaseConfig'

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { InstanceContext } from '../../src/contexts/InstanceContext'
import { UserContext } from '../../src/contexts/UserContext';
import { TasksContext } from '../../src/contexts/TasksContext'

// It is possibly a good idea to divide up this function, the if statement is making it quite long
export default function Main() {
    const [instance, setInstance] = useContext(InstanceContext);
    const [user, setUser] = useContext(UserContext);
    const [tasks, setTasks] = useContext(TasksContext);
    const [newItem, setNewItem] = useState(null);
    const [refreshing, setRefreshing] = useState(false);
    const [filter, setFilter] = useState(0);
    const [filterName, setFilterName] = useState("Recent");
    const [modalVisible, setModalVisible] = useState(false);
    const [modalItem, setModalItem] = useState(null);

    const addTask = async () => {
        if (newItem != null) {
            setTasks(tasks.concat([{ "creator": user.uid, "upvotes": [user.uid], "downvotes": [], "status": 0, "title": newItem, "date": new Date() }]))
            setNewItem(null);
            try {
                const document = await addDoc(collection(FIREBASE_DB, 'instances/' + instance.id + "/quotes"), { "creator": user.uid, "upvotes": [user.uid], "downvotes": [], title: newItem, date: new Date(), status: 0 });
                setTasks(tasks.concat([{ "id": document.id, "creator": user.uid, "upvotes": [user.uid], "downvotes": [], "status": 0, "title": newItem, "date": new Date() }]))
            } catch (error) {
                alert("Task couldn't be saved to database: " + error)
            }
        } else {
            alert("Task name cannot be empty.")
        }
    }

    const removeTask = async (task) => {
        const taskDoc = doc(FIREBASE_DB, "instances/" + instance.id + "/quotes/" + task.id);
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
        const taskDocs = await getDocs(collection(FIREBASE_DB, "instances/" + instance.id + "/quotes"));
        taskDocs.forEach((doc) => {
            const taskData = doc.data();
            taskData["id"] = doc.id;
            tasks.push(taskData);
        });
        setTasks(tasks);
        setRefreshing(false);
    }

    const changeTaskStatus = async (task, status) => {
        const taskDoc = doc(FIREBASE_DB, "instances/" + instance.id + "/quotes/" + task.id)
        const updatedTasks = tasks.map(entry => {
            if (entry.id === task.id) {
                return { ...entry, status: status };
            }
            return entry;
        });
        setTasks(updatedTasks);
        await setDoc(taskDoc, { status: status }, { merge: true });
    }

    const parseTasks = (filter) => {
        var sortedTasks;
        if (filter == 0) {
            return tasks.sort((a, b) => b.date - a.date);
        } else if (filter == 1) {
            return tasks.sort((a, b) => (b.upvotes.length - b.downvotes.length) - (a.upvotes.length - a.downvotes.length));
        }
        return sortedTasks;
    }

    const upvote = async (task) => {
        const taskDoc = doc(FIREBASE_DB, "instances/" + instance.id + "/quotes/" + task.id)
        const upvotesArray = task.upvotes.concat([user.uid]);
        const downvotesArray = task.downvotes.filter(id => id !== user.uid);
        const updatedTasks = tasks.map(entry => {
            if (entry.id === task.id) {
                return { ...entry, upvotes: upvotesArray, downvotes: downvotesArray };
            }
            return entry;
        });
        setTasks(updatedTasks);
        await setDoc(taskDoc, { upvotes: upvotesArray, downvotes: downvotesArray }, { merge: true });
    }

    const downvote = async (task) => {
        const taskDoc = doc(FIREBASE_DB, "instances/" + instance.id + "/quotes/" + task.id)
        const upvotesArray = task.upvotes.filter(id => id !== user.uid);
        const downvotesArray = task.downvotes.concat([user.uid]);
        const updatedTasks = tasks.map(entry => {
            if (entry.id === task.id) {
                return { ...entry, upvotes: upvotesArray, downvotes: downvotesArray };
            }
            return entry;
        });
        setTasks(updatedTasks);
        await setDoc(taskDoc, { upvotes: upvotesArray, downvotes: downvotesArray }, { merge: true });
    }

    const cycleFilter = () => {
        if (filter === 0) {
            setFilter(1);
            setFilterName("Most upvoted");
        } else if (filter === 1) {
            setFilter(0);
            setFilterName("Recent");
        }
    }

    if (instance === undefined) { // instance data is loading
        return (
            <View style={styles.container}>
                <ActivityIndicator size={'large'} />
            </View>
        )
    } else if (instance === null) { // user is in no instance
        return (
            <View style={styles.noInstance}>
                <Text style={styles.noInstanceText}>It looks like you haven't joined an instance yet. Visit the Settings to get started.</Text>
            </View>
        )
    } else if (instance) { // instance data loaded
        return (
            <View style={styles.container}>
                <Button title={"Showing " + filterName + " quotes"} onPress={() => cycleFilter()} />
                <FlatList
                    style={styles.list}
                    data={parseTasks(filter)}
                    renderItem={({ item }) => <>
                        <View style={styles.item}>
                            <View style={styles.itemText}>
                                <Text style={styles.voteCounter}>{item.upvotes.length - item.downvotes.length}</Text>
                                <Text style={styles.itemText} numberOfLines={1}>{item.title}</Text>
                            </View>
                            {item.creator == user.uid || instance.admins[0] == user.uid ?
                            <Button title="Delete" color={"#D50000"} onPress={() => { removeTaskPrompt(item) }} /> :
                            <Button title="Vote" onPress={() => { setModalItem(item); setModalVisible(true) }} />
                            }
                            {/* <Button title="Vote" onPress={() => { setModalItem(item); setModalVisible(true) }} /> */}
                            {/* <MaterialCommunityIcons name="checkbox-marked" color="#000000" /> */}
                        </View>
                    </>
                    }
                    onRefresh={refreshTasks}
                    refreshing={refreshing}
                />

                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => {
                        Alert.alert('Modal has been closed.');
                        setModalVisible(!modalVisible);
                    }}>
                    <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                            <Text style={styles.modalText}>{modalItem ? modalItem.title : "Item"}</Text>
                            <Button style={styles.modalButton} title="Upvote" onPress={() => { setModalVisible(!modalVisible); upvote(modalItem); }} disabled={modalItem ? modalItem.upvotes.includes(user.uid): true} />
                            <Button style={styles.modalButton} title="Downvote" onPress={() => { setModalVisible(!modalVisible); downvote(modalItem); }} disabled={modalItem ? modalItem.downvotes.includes(user.uid) : true} />
                            <Button style={styles.modalButton} title="Close" onPress={() => setModalVisible(!modalVisible)} />
                        </View>
                    </View>
                </Modal>

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
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22,
    },
    modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2,
    },
    buttonOpen: {
        backgroundColor: '#F194FF',
    },
    buttonClose: {
        backgroundColor: '#2196F3',
    },
    textStyle: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    modalText: {
        marginBottom: 15,
        textAlign: 'center',
    },
    modalButton: {
        flex: 1
    },
    item: {
        marginTop: 5,
        marginBottom: 5,
        flex: 1,
        flexDirection: "row",
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 5,
        marginHorizontal: 5
    },
    itemText: {
        flexShrink: 1,
    },
    noInstance: {
        marginHorizontal: 20,
        flex: 1,
        justifyContent: 'center'
    },
    noInstanceText: {
        textAlign: 'center'
    },
    itemText: {
        flex: 1,
        flexDirection: "row"
    },
    voteCounter: {
        borderRadius: 100,
        backgroundColor: "black",
        color: "white",
        paddingHorizontal: 5,
        marginRight: 5
    }
})