// app/auth.js hoặc screens/AuthScreen.js
import { View, Text, TextInput, Button } from 'react-native';
import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import { storeData } from '../../utils/services';
import { supabase } from '../../utils/SupabaseConfig';

export default function AuthScreen() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();

    const handleLogin = async () => {
        // Giả lập đăng nhập
        const { data: Account, error } = await supabase
            .from('Account')
            .select('*')
            .eq('username', username)
            .single();
        if (Account !== null) {
            if (Account.password === password) {
                await storeData('login', 'true');
                await storeData('user', JSON.stringify(Account))
                router.push('/home')
            } else {
                alert('Mật khẩu không đúng. Vui lòng kiểm tra lại!');
            }

        } else {
            alert('Tài khoản chưa tồn tại!');
        }
    };

    return (
        <View style={{ padding: 20, marginTop: '10%' }}>
            <Text style={{ fontSize: 24, marginBottom: 20 }}>Login or Signup</Text>
            <TextInput
                placeholder="Username"
                value={username}
                onChangeText={setUsername}
                style={{ borderBottomWidth: 1, marginBottom: 15 }}
            />
            <TextInput
                placeholder="Password"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
                style={{ borderBottomWidth: 1, marginBottom: 15 }}
            />
            <Button title="Login" onPress={handleLogin} />
        </View>
    );
}
