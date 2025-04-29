import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, Button, Alert } from 'react-native';
import { getData, storeData } from '../../utils/services'
import { useRouter } from 'expo-router';
const ProfileScreen = ({ navigation }) => {
    const [user, setUser] = useState(null);
    const router = useRouter();
    useEffect(() => {
        userInfor();
    }, [])
    const userInfor = async () => {
        const acc = await getData('user');
        if (acc) {
            setUser(JSON.parse(acc));
            console.log(acc)
        }

    }


    const getInitials = (name) => {
        if (!name) return ''; // Nếu không có tên thì trả về rỗng
        return name
            .split(' ')
            .map(part => part[0])
            .join('')
            .toUpperCase();
    };

    const handleLogout = async () => {
        await storeData('login', 'false');  // Xoá thông tin đăng nhập
        await storeData('user', 'false');
        router.replace('/login/auth');           // Chuyển hướng về trang login
    }

    return (
        <View style={styles.container}>
            <View style={styles.avatar}>
                <Text style={styles.avatarText}>{getInitials(user?.name)}</Text>
            </View>
            <Text style={styles.name}>{user?.name}</Text>
            <Text style={styles.email}>{user?.email}</Text>
            <View style={styles.button}>
                <Button title="Đăng xuất" onPress={() => handleLogout()} color="#d9534f" />
            </View>
        </View>
    );
};

export default ProfileScreen;

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        backgroundColor: '#f2f2f2',
    },
    avatar: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: '#007bff',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
    },
    avatarText: {
        color: '#fff',
        fontSize: 36,
        fontWeight: 'bold',
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    email: {
        fontSize: 16,
        color: '#666',
        marginBottom: 30,
    },
    button: {
        width: '60%',
    },
});
