import React, { useState } from 'react';
import { View, Text, TextInput, Button, KeyboardAvoidingView, StyleSheet, ActivityIndicator } from 'react-native';
import { FIREBASE_AUTH, FIREBASE_DB } from '../../FirebaseConfig';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const signIn = async () => {
        setLoading(true);
        try {
            await signInWithEmailAndPassword(FIREBASE_AUTH, email, password);
        } catch (error) {
            alert('Sign in failed: ' + error.message);
        } finally {
            setLoading(false);
        }
    }
    const signUp = async () => {
        setLoading(true);
        try {
            await createUserWithEmailAndPassword(FIREBASE_AUTH, email, password);
            await setDoc(doc(FIREBASE_DB, 'users', user.uid), { instance: null })
            alert('Welcome! You successfully signed up for an account.');
        } catch (error) {
            alert('Sign up failed: ' + error.message);
        } finally {
            setLoading(false);
        }
    }

    const forgotPassword = async () => {
        setLoading(true);
        try {
            await sendPasswordResetEmail(FIREBASE_AUTH, email);
            alert('We have sent you an e-mail. Follow the instructions to reset your password.')
        } catch (error) {
            alert('Failed to reset password: ' + error.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <View style={styles.container}>
            <KeyboardAvoidingView>
                <TextInput value={email} style={styles.input} placeholder="E-mail" autoCapitalize="none" onChangeText={(text) => setEmail(text)}></TextInput>
                <TextInput secureTextEntry={true} value={password} style={styles.input} placeholder="Password" autoCapitalize="none" onChangeText={(text) => setPassword(text)}></TextInput>
                {loading ?
                    <ActivityIndicator size="large" color="#0000ff" /> :
                    <>
                        <Button title="Login" onPress={signIn} />
                        <Button title="Create account" onPress={signUp} />
                        <Button title="Forgot password" onPress={forgotPassword} />
                    </>
                }
            </KeyboardAvoidingView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        marginHorizontal: 20,
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