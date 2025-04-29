import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Image, TouchableOpacity, Text, Alert } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Colors from '../../utils/Colors';
import { supabase } from '../../utils/SupabaseConfig';

const RegisterScreen = ({ navigation }) => {
    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [secureTextEntry, setSecureTextEntry] = useState(true);

    const router = useRouter();

    const handleRegister = async () => {
        const { data: Account, error } = await supabase
            .from('Account')
            .select('*')
        if (error) {
            Alert.alert('Lỗi', 'Không thể kết nối đến cơ sở dữ liệu!');
            return;
        }
        if (confirmPassword !== password) {
            Alert.alert('error', 'Password is not same')
            return;
        }

        if (Account.find(us => us.username === username)) {
            Alert.alert('error', 'Username is existing')
            return;
        }
        const { data, error1 } = await supabase
            .from('Account')
            .insert([
                {
                    name: name,
                    username: username,
                    password: password
                },
            ])
            .select()

        if (data) {
            Alert.alert('Success', 'Account created!')
        }
        router.replace('/login/auth');
    };

    return (
        <View style={styles.container}>


            <Text style={styles.title}>Đăng ký tài khoản</Text>

            <TextInput
                label="Họ và tên"
                mode="outlined"
                style={styles.input}
                value={name}
                onChangeText={setName}
            />

            <TextInput
                label="Username"
                mode="outlined"
                style={styles.input}
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
            />

            <TextInput
                label="Mật khẩu"
                mode="outlined"
                right={
                    <TextInput.Icon
                        name={secureTextEntry ? "eye-off" : "eye"}
                        onPress={() => setSecureTextEntry(!secureTextEntry)}
                    />
                }
                style={styles.input}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={secureTextEntry}
            />

            <TextInput
                label="Nhập lại mật khẩu"
                mode="outlined"
                right={
                    <TextInput.Icon
                        name={secureTextEntry ? "eye-off" : "eye"}
                        onPress={() => setSecureTextEntry(!secureTextEntry)}
                    />
                }
                style={styles.input}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={secureTextEntry}
            />
            <View style={{ alignItems: 'center' }}>
                <TouchableOpacity
                    mode="contained"
                    style={styles.button}
                    onPress={handleRegister}

                >
                    <Text style={styles.buttonText}>Signup</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.loginContainer}>
                <Text style={styles.loginText}>Đã có tài khoản?</Text>
                <TouchableOpacity onPress={() => router.replace('/login/auth')}>
                    <Text style={styles.loginLink}> Đăng nhập ngay</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

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
        marginTop: 10,
        padding: 15,
        borderRadius: 5,
        backgroundColor: Colors.PRIMARY,
        width: '50%',
        alignItems: 'center'
    },
    buttonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff',
    },
    loginContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 20,
    },
    loginText: {
        color: '#666',
    },
    loginLink: {
        color: Colors.PRIMARY,
        fontWeight: 'bold',
    },
});

export default RegisterScreen;