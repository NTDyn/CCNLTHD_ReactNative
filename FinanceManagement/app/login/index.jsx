import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'
import introduceImg from '../../assets/images/introduce_1.png'
import Colors from '../../utils/Colors'
import { useRouter } from 'expo-router'


export default function Login() {
    const router = useRouter();

    const handleSignIn = async () => {
        router.push('/login/auth')
    };


    return (
        <View
            style={{
                display: 'flex',
                alignItems: 'center'
            }}
        >
            <Image
                source={introduceImg}
                style={styles.bgImage}
            ></Image>
            <View
                style={{
                    backgroundColor: Colors.PRIMARY,
                    width: '100%',
                    height: '100%',
                    padding: 20,
                    marginTop: -30,
                    borderTopLeftRadius: 30,
                    borderTopRightRadius: 30,
                }}
            >
                <Text
                    style={{
                        fontSize: 35,
                        fontWeight: 'bold',
                        textAlign: 'center',
                        color: Colors.WHITE
                    }}
                >
                    Personal Budget Planner
                </Text>
                <Text
                    style={{
                        fontSize: 18,
                        textAlign: 'center',
                        color: Colors.WHITE,
                        marginTop: 20
                    }}
                >
                    Stay on Track, Event by Event: Your Personal Budget Planner Application!
                </Text>

                <TouchableOpacity
                    style={styles.btnSignIn}
                    onPress={handleSignIn}
                >
                    <Text
                        style={{
                            fontSize: 16,
                            color: Colors.PRIMARY,
                            textAlign: 'center'
                        }}
                    >
                        Login/Signup
                    </Text>
                </TouchableOpacity>
                <Text
                    style={{
                        fontSize: 13,
                        color: Colors.WHITE,
                        marginTop: 15
                    }}
                >* By login/sigup you will agree to our terms and conditions</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    bgImage: {
        width: '100%',
        height: 400,
    },
    btnSignIn: {
        backgroundColor: Colors.WHITE,
        padding: 15,
        paddingHorizontal: 5,
        borderRadius: 99,
        marginTop: 30
    }
})