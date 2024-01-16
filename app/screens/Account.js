import { View, Text, Button } from 'react-native'
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
            alert("You have been successfully signed out. We hope to see you soon!")
        }
    }

    return (
        <View>
            <Text>{"Currently logged in as: " + user.email}</Text>
            <Button title="Sign out" onPress={logout} />
        </View>
    )
}