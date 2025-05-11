import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import Entypo from '@expo/vector-icons/Entypo';
import Colors from '../../utils/Colors';
import CourseItemList from './CourseItemList';
import { supabase } from '../../utils/SupabaseConfig';
import { useRouter } from 'expo-router';
import { formatCurrency } from '../../utils/FormatCurrency';

export default function CourseInfo({ categoryData }) {

    const router = useRouter();
    const [totalCost, setTotalCost] = useState();
    const [percTotal, setPerTotal] = useState();

    useEffect(() => {
        categoryData && calculateTotalPerc();
    }, [categoryData])

    // Hàm tính tổng theo phần trăm 
    const calculateTotalPerc = () => {
        let total = 0;
        // Tính tổng số tiền đã dùng trong quỹ 
        categoryData?.CategoryItems?.forEach(item => {
            total = total + item.cost
        })
        setTotalCost(total)

        // Tính phần trăm số tiền đã dùng trong quỹ 
        const perc = total / categoryData.assigned_budget * 100
        setPerTotal(perc)
    }

    // Hàm xóa quỹ 
    const onDeleteCategory = async () => {
        Alert.alert('Are you sure', 'Do you really want to delete this category', [
            {
                text: 'Cancel',
                style: 'cancel'
            },
            {
                text: 'Yes',
                style: 'destructive',
                onPress: async () => {
                    // Xóa các mục con trong quỹ  
                    const { error } = await supabase
                        .from('CategoryItems')
                        .delete()
                        .eq('category_id', categoryData.id);

                    // Xóa quỹ 
                    await supabase
                        .from('Category')
                        .delete()
                        .eq('id', categoryData.id)

                    // Thông báo thành công 
                    Alert.alert('Success', 'Category Deleted!')

                    // Điều hướng về trang chính 
                    router.replace('/(tabs)')
                }
            }
        ])
    }

    return (
        <View>
            <View style={styles.container}>
                {/* Hiển thị icon quỹ   */}
                <View style={styles.iconContainer}>
                    <Text style={[styles.textIcon, { backgroundColor: categoryData.color }]}>{categoryData.icon}</Text>
                </View>
                <View
                    style={{
                        flex: 1,
                        marginLeft: 20
                    }}
                >
                    {/* Hiển thị tên quỹ  */}
                    <Text style={styles.categoryName}>{categoryData.name}</Text>
                    {/* Hiển thị số mục trong quỹ  */}
                    <Text style={styles.categoryItemText}>{categoryData.CategoryItems?.length} Items</Text>
                </View>

                {/*Nút xóa quỹ*/}
                <TouchableOpacity onPress={() => onDeleteCategory()}>
                    <Entypo name="trash" size={24} color="red" />
                </TouchableOpacity>
            </View>
            <View style={styles.amountContainer}>
                {/* Tổng số tiền đã dùng  */}
                <Text style={{ fontWeight: '700' }}>${formatCurrency(totalCost)}</Text>
                {/* Tổng số tiền ban đầu có trong quỹ  */}
                <Text style={{ fontWeight: '700' }} >Total Budget: {formatCurrency(categoryData.assigned_budget)}</Text>
            </View>
            <View style={styles.progressBarMainContainer}>
                {/* Hiển thị thanh phần trăm số tiền đã dùng  */}
                <View style={[styles.progressBarSubContainer, { width: percTotal + '%' }]}></View>
            </View>

        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        marginTop: 20,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    textIcon: {
        fontSize: 35,
        padding: 20,
        borderRadius: 15
    },
    iconContainer: {
        justifyContent: 'center'
    },
    categoryName: {
        fontWeight: 'bold',
        fontSize: 24,

    },
    categoryItemText: {
        fontSize: 16
    },
    amountContainer: {
        display: 'flex',
        justifyContent: 'space-between',
        flexDirection: 'row',
        marginTop: 10,
    },
    progressBarMainContainer: {
        width: '100%',
        height: 15,
        backgroundColor: Colors.GRAY,
        borderRadius: 99,
        marginTop: 7
    },
    progressBarSubContainer: {
        backgroundColor: Colors.PRIMARY,
        borderRadius: 99,
        height: 15,
        maxWidth: '100%'
    }
})