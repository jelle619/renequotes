import React, { useState, useContext } from 'react';
import { View, Text, TextInput, Button, KeyboardAvoidingView, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { FIREBASE_AUTH, FIREBASE_DB } from '../../FirebaseConfig';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail, signOut } from "firebase/auth";
import { UserContext } from '../../src/contexts/UserContext';
import { setDoc } from 'firebase/firestore';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const [user, setUser] = useContext(UserContext);

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
            Alert.alert(
                'Sign up successful',
                'Welcome aboard! You can now use your new account to log in and start using the app.',
                [
                    {
                        text: 'OK',
                    }
                ]
            );
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
            Alert.alert(
                'Password request sent',
                'We have sent you an e-mail. Follow the instructions to reset your password.',
                [
                    {
                        text: 'OK',
                    }
                ]
            );
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