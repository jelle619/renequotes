import { View, Text, Button, StyleSheet, Alert } from 'react-native'
import React, { useContext } from 'react'
import { signOut } from 'firebase/auth'
import { FIREBASE_AUTH } from '../../FirebaseConfig'
import { UserContext } from '../../src/contexts/UserContext'

export default function Account() {
    const [user, setUser] = useContext(UserContext);

    const logout = async() => {
        try {
            await signOut(FIREBASE_AUTH);
        } catch (error) {
            alert("Sign out failed: " + error)
        } finally {
            Alert.alert(
                'Signed out',
                "You have been successfully signed out. We hope to see you again soon!",
                [
                    {
                        text: 'OK',
                    }
                ]
            );
        }
    }

    return (
        <View style={styles.container}>
            <Text>{"Currently logged in as: " + user.email}</Text>
            <Button title="Sign out" onPress={logout} />
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