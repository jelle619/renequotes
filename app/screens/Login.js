import React, { useState } from 'react';
import { View, Text, TextInput, Button, KeyboardAvoidingView, StyleSheet, ActivityIndicator } from 'react-native';
import { FIREBASE_AUTH } from '../../FirebaseConfig';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const auth = FIREBASE_AUTH;
    const signIn = async () => {
        setLoading(true);
        try {
            const response = await signInWithEmailAndPassword(auth, email, password);
            console.log(response);
        } catch (error) {
            alert('Sign in failed: ' + error.message);
        } finally {
            setLoading(false);
        }
    }
    const signUp = async () => {
        setLoading(true);
        try {
            const response = await createUserWithEmailAndPassword(auth, email, password);
            console.log(response);
            alert('Thanks! Please check your inbox to verify your account and complete sign up.');
        } catch (error) {
            alert('Sign in failed: ' + error.message);
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
                    <ActivityIndicator size="large" color="#0000ff" />
                    :
                    <>
                        <Button title="Login" onPress={signIn} />
                        <Button title="Create account" onPress={signUp} />
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