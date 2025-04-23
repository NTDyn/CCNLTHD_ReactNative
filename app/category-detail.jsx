import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import React, { useEffect } from 'react'
import { Stack, useLocalSearchParams, useRouter } from 'expo-router'
import { supabase } from '../utils/SupabaseConfig';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useState } from 'react';
import CourseInfo from '../components/CourseDetail/CourseInfo';
import Colors from '../utils/Colors';

export default function CategoryDetail() {

    const { categoryId } = useLocalSearchParams();
    const [categoryData, setCategoryData] = useState([])
    const router = useRouter()

    useEffect(() => {
        console.log(categoryId);
        categoryId && getCategoryDetail();
    }, [categoryId])

    const getCategoryDetail = async () => {
        const { data: Category, error } = await supabase
            .from('Category')
            .select('*, CategoryItems(*)')
            .eq('id', categoryId)
        setCategoryData(Category[0])

    }
    return (

        <View
            style={{
                padding: 20,
                marginTop: 20,
                flex: 1
            }}
        >
            <TouchableOpacity onPress={() => router.back()}>
                <Ionicons name="arrow-back-circle" size={44} color="black" />

            </TouchableOpacity>
            <CourseInfo
                categoryData={categoryData}
            ></CourseInfo>
            <TouchableOpacity style={styles.floatingBtn}>
                <Ionicons name="add-circle" size={54} color={Colors.PRIMARY} />
            </TouchableOpacity>
        </View >


    )
}

const styles = StyleSheet.create({
    floatingBtn: {
        position: 'absolute',
        bottom: 16,
        right: 16
    }
})
