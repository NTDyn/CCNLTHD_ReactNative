import { View, Text, Image } from 'react-native'
import React, { useEffect, useState } from 'react';
import { getData } from '../utils/services';
import avata from '../assets/images/avata.png'
import Colors from '../utils/Colors';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function Header() {
    const [user, setUser] = useState();

    useEffect(() => {
        getUser();
    }, [])

    const getUser = async () => {
        const user = await getData('user');
        setUser(JSON.parse(user))
    }
    return (
        <View
            style={{
                display: 'flex',
                flexDirection: 'row',
                gap: 8,
                alignItems: 'center'
            }}
        >
            <Image
                source={avata}
                style={{
                    width: 50,
                    height: 50,
                    borderRadius: 99
                }}
            ></Image>
            <View
                style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '85%'

                }}
            >
                <View>
                    <Text
                        style={{
                            color: Colors.WHITE,
                            fontSize: 16
                        }}
                    > Welcome,
                    </Text>
                    <Text
                        style={{
                            color: Colors.WHITE,
                            fontSize: 20,
                            fontWeight: 'bold'
                        }}
                    > {user?.name}
                    </Text>
                </View>
                <Ionicons name="notifications" size={24} color="white" />
            </View>
        </View>
    )
}