// app/auth.js hoặc screens/AuthScreen.js
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { TextInput, Button } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { storeData } from '../../utils/services';
import { supabase } from '../../utils/SupabaseConfig';
import Colors from '../../utils/Colors';

export default function AuthScreen() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [secureTextEntry, setSecureTextEntry] = useState(true);
    const router = useRouter();

    const handleLogin = async () => {

        const { data: Account, error } = await supabase
            .from('Account')
            .select('*')
            .eq('username', username)
            .single();
        if (Account !== null) {
            if (Account.password === password) {
                await storeData('login', 'true');
                await storeData('user', JSON.stringify(Account))
                router.push('/')
            } else {
                alert('Password is wrong. Check again please!');
            }

        } else {
            alert('Account is not existing!');
        }
    };

    return (
        <View style={styles.container}>


            <Text style={styles.title}>Login</Text>


            <TextInput
                label="Username"
                mode="outlined"
                style={styles.input}
                value={username}
                onChangeText={setUsername}

                autoCapitalize="none"
            />
            <TextInput
                label="Password"
                mode="outlined"
                right={
                    <TextInput.Icon
                        name={secureTextEntry ? "eye-off" : "eye"}
                        onPress={() => setSecureTextEntry(!secureTextEntry)}
                    />
                }

                value={password}
                onChangeText={setPassword}
                secureTextEntry={secureTextEntry}
            />


            <View style={{ alignItems: 'center' }}>
                <TouchableOpacity
                    mode="contained"
                    style={styles.button}
                    onPress={handleLogin}
                    disabled={!username || !password}
                >
                    <Text style={styles.buttonText}> Sign In</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.signupContainer}>
                <Text style={styles.signupText}>Haven't have an account?</Text>
                <TouchableOpacity onPress={() => router.replace('/register')} >
                    <Text style={styles.signupLink}> Register now!</Text>
                </TouchableOpacity>
            </View>


        </View >
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
        backgroundColor: '#fff',

    },
    logo: {
        width: 150,
        height: 150,
        alignSelf: 'center',
        marginBottom: 30,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
        color: Colors.PRIMARY,
    },
    input: {
        marginBottom: 15,
        backgroundColor: '#fff',
    },
    button: {
        display: 'flex',
        marginTop: 20,
        padding: 15,
        borderRadius: 5,
        backgroundColor: Colors.PRIMARY,
        width: '50%',
        alignItems: 'center',

    },
    buttonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: Colors.WHITE,

    },
    forgotPassword: {
        alignSelf: 'flex-end',
        marginBottom: 15,
    },
    forgotPasswordText: {
        color: '#6200ee',
        fontSize: 14,
    },
    signupContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 20,
    },
    signupText: {
        color: '#666',
    },
    signupLink: {
        color: Colors.PRIMARY,
        fontWeight: 'bold',
    },
    socialLoginContainer: {
        marginTop: 30,
        alignItems: 'center',
    },
    socialLoginText: {
        color: '#666',
        marginBottom: 15,
    },
    socialIcons: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '60%',
    },
    socialIcon: {
        padding: 10,
    },
});
