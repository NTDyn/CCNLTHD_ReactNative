import { View, Text, TextInput, StyleSheet, TouchableOpacity, ToastAndroid } from 'react-native'
import React, { useState } from 'react'
import Colors from '../utils/Colors';
import ColorPicker from '../components/ColorPicker';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { supabase } from '../utils/SupabaseConfig';
import { getData } from '../utils/services';
import { Alert } from 'react-native';
import { useRouter } from 'expo-router';


export default function AddNewCategory() {

    const [selectedIcon, setSelectedIcon] = useState('IC');
    const [selectedColor, setSelectedColor] = useState(Colors.PURPLE)
    const [categoryName, setCategoryName] = useState();
    const [totalBudget, setTotalBudget] = useState();
    const router = useRouter();

    const onCreateCategory = async () => {
        const user = await getData('user');
        const { data, error } = await supabase
            .from('Category')
            .insert([{
                name: categoryName,
                assigned_budget: totalBudget,
                icon: selectedIcon,
                color: selectedColor,
                created_by: JSON.parse(user).username
            }])
            .select()
        console.log(data)
        if (data) {
            router.replace({
                pathname: '/category-detail',
                params: {
                    categoryId: data[0].id
                }
            })
            Alert.alert('Success', 'Category Created!', [{ text: 'OK' }]);
        }
    }


    return (
        <View
            style={{
                marginTop: 20, padding: 20
            }}
        >
            <View
                style={{
                    justifyContent: 'center',
                    alignItems: 'center'
                }}
            >
                <TextInput
                    style={[styles.iconInput, { backgroundColor: selectedColor }]}
                    maxLength={2}
                    onChangeText={(value) => setSelectedIcon(value)}
                >{selectedIcon}</TextInput>
                <ColorPicker
                    selectedColor={selectedColor}
                    setSelectedColor={(color) => setSelectedColor(color)}
                ></ColorPicker>
            </View>
            <View
                style={styles.inputView}
            >
                <MaterialIcons name="local-offer" size={24} color={Colors.GRAY} />
                <TextInput
                    placeholder='Category Name'
                    style={{
                        width: '100%',
                        fontSize: 16
                    }}
                    onChangeText={(value) => setCategoryName(value)}
                ></TextInput>
            </View>
            <View
                style={styles.inputView}
            >
                <FontAwesome6 name="sack-dollar" size={24} color={Colors.GRAY} />
                <TextInput
                    keyboardType='numeric'
                    placeholder='Total Budget'
                    style={{
                        width: '100%',
                        fontSize: 16
                    }}
                    onChangeText={(value) => setTotalBudget(value)}
                ></TextInput>
            </View>
            <TouchableOpacity
                style={styles.buttonCreate}
                disabled={!categoryName || !totalBudget}
                onPress={() => { onCreateCategory() }}
            >
                <Text
                    style={{
                        textAlign: 'center',
                        fontSize: 18,
                        color: Colors.WHITE
                    }}
                >Create</Text>
            </TouchableOpacity>
        </View>

    )
}

const styles = StyleSheet.create({
    iconInput: {
        textAlign: 'center',
        fontSize: 30,
        padding: 20,
        borderRadius: 99,
        paddingHorizontal: 27,
        color: Colors.WHITE
    },
    inputView: {
        borderWidth: 1,
        display: 'flex',
        flexDirection: 'row',
        gap: 5,
        padding: 14,
        borderRadius: 10,
        borderColor: Colors.GRAY,
        backgroundColor: Colors.WHITE,
        alignItems: 'center',
        marginTop: 20,
    },
    buttonCreate: {
        backgroundColor: Colors.PRIMARY,
        padding: 15,
        borderRadius: 10,
        marginTop: 30
    }
})

