import { View, Text, Button } from 'react-native'
import React from 'react'
import { signOut } from 'firebase/auth'
import { FIREBASE_AUTH } from '../../FirebaseConfig'

export default function Account() {
    const logout = async() => {
        try {
            await signOut(FIREBASE_AUTH);
        } catch (error) {
            alert("Sign out failed: " + error)
        }
    }

    return (
        <View>
            <Text>Example</Text>
            <Button title="Sign out"  />
        </View>
    )
}