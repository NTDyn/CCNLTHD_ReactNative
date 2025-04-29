import { View, Text, Image, StyleSheet, TextInput, Button, TouchableOpacity, KeyboardAvoidingView, ScrollView, ActivityIndicator } from 'react-native'
import React, { useState } from 'react'
import Colors from '../utils/Colors'
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Foundation from '@expo/vector-icons/Foundation';
import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons';
import * as ImagePicker from 'expo-image-picker';
import { decode } from 'base64-arraybuffer'
import { supabase } from '../utils/SupabaseConfig';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Alert } from 'react-native';


const placeholderImage = 'https://t4.ftcdn.net/jpg/06/71/92/37/360_F_671923740_x0zOL3OIuUAnSF6sr7PuznCI5bQFKhI0.jpg'
export default function AddCategoryItem() {
    const router = useRouter();
    const [image, setImage] = useState(placeholderImage)
    const [previewImage, setPreviewImage] = useState(placeholderImage);
    const { categoryId } = useLocalSearchParams();
    const [name, setName] = useState()
    const [cost, setCost] = useState()
    const [note, setNote] = useState()
    const [loading, setLoading] = useState(false)

    const onImagePick = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images', 'videos'],
            allowsEditing: true,
            quality: 1,
            base64: true
        })
        if (!result.canceled) {
            setPreviewImage(result.assets[0].uri)
            setImage(result.assets[0].base64)
        }
    }

    const onClickAdd = async () => {
        setLoading(true)
        const fileName = Date.now();
        const { data, error } = await supabase
            .storage
            .from('images')
            .upload(fileName + '.png', decode(image), {
                contentType: 'image/png'
            })
        if (data) {
            const fileUrl = "https://zdtkbwdpucurfjbiyaps.supabase.co/storage/v1/object/public/images/" + fileName + ".png"

            const { data, error } = await supabase
                .from('CategoryItems')
                .insert([{
                    name: name,
                    cost: cost,
                    image: fileUrl,
                    note: note,
                    category_id: categoryId
                }]).select()

            Alert.alert('Success', 'Item Created!', [{ text: 'OK' }]);
            setLoading(false)
            router.replace({
                pathname: '/category-detail',
                params: {
                    categoryId: categoryId
                }
            })
        }



    }

    return (
        <KeyboardAvoidingView>
            <ScrollView
                style={{
                    padding: 20
                }}
            >
                <TouchableOpacity onPress={() => onImagePick()}>
                    <Image
                        source={{ uri: previewImage }}
                        style={styles.image}
                    ></Image>
                </TouchableOpacity>
                <View style={styles.textInputContainer}>
                    <MaterialIcons name="label" size={24} color={Colors.GRAY} />
                    <TextInput
                        placeholder='Item Name'
                        style={styles.input}
                        onChangeText={(value) => setName(value)}
                    >

                    </TextInput>
                </View>
                <View style={styles.textInputContainer}>
                    <Foundation name="dollar-bill" size={24} color={Colors.GRAY} />
                    <TextInput
                        placeholder='Cost'
                        style={styles.input}
                        keyboardType='number-pad'
                        onChangeText={(value) => setCost(value)}
                    >

                    </TextInput>
                </View>
                <View style={styles.textInputContainer}>
                    <SimpleLineIcons name="note" size={24} color={Colors.GRAY} />
                    <TextInput
                        placeholder='Note'
                        style={styles.input}
                        onChangeText={(value) => setNote(value)}
                    >

                    </TextInput>
                </View>
                <TouchableOpacity
                    style={styles.button}
                    disabled={!name || !cost || loading}
                    onPress={() => onClickAdd()}
                >
                    {loading ?
                        <ActivityIndicator style={{ color: Colors.WHITE }}></ActivityIndicator>
                        :

                        <Text
                            style={{
                                textAlign: 'center',
                                fontWeight: 'bold',
                                backgroundColor: Colors.PRIMARY,
                                color: Colors.WHITE
                            }}
                        >Add Item</Text>
                    }
                </TouchableOpacity>

            </ScrollView>
        </KeyboardAvoidingView >

    )
}

const styles = StyleSheet.create({
    image: {

        width: 150,
        height: 150,
        backgroundColor: Colors.GRAY,
        borderRadius: 15
    },
    textInputContainer: {
        padding: 10,
        borderWidth: 1,
        display: 'flex',
        flexDirection: 'row',
        gap: 10,
        alignItems: 'center',
        borderRadius: 10,
        borderColor: Colors.GRAY,
        marginTop: 10
    },
    input: {
        fontSize: 17,
        width: '100%'
    },
    button: {
        padding: 20,
        backgroundColor: Colors.PRIMARY,
        borderRadius: 99,
        marginTop: 25
    }
})