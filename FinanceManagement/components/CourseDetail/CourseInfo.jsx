import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, Modal, Button } from 'react-native'
import React, { useEffect, useState } from 'react'
import Entypo from '@expo/vector-icons/Entypo';
import Colors from '../../utils/Colors';
import CourseItemList from './CourseItemList';
import { supabase } from '../../utils/SupabaseConfig';
import { useRouter } from 'expo-router';
import { formatCurrency } from '../../utils/FormatCurrency';
import ColorPicker from '../../components/ColorPicker';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';

export default function CourseInfo({ categoryData }) {

    const router = useRouter();
    const [totalCost, setTotalCost] = useState();
    const [percTotal, setPerTotal] = useState();
    const [modalEdit, setModalEdit] = useState(false);

    // Các biến dùng để sửa quỹ
    // const [selectedIcon, setSelectedIcon] = useState(categoryData?.icon);
    // const [selectedColor, setSelectedColor] = useState(categoryData?.color)
    const [categoryName, setCategoryName] = useState('');
    const [totalBudget, setTotalBudget] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        categoryData && calculateTotalPerc();
        setTotalBudget(String(categoryData?.assigned_budget ?? ''))
        setCategoryName(categoryData?.name)
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

    // Hàm sua quỹ 
    const onEditCategory = async () => {
        Alert.alert('Are you sure', 'Do you really want to edit this category', [
            {
                text: 'Cancel',
                style: 'cancel'
            },
            {
                text: 'Yes',
                style: 'destructive',
                onPress: async () => {


                    // Xóa quỹ 
                    await supabase
                        .from('Category')
                        .update({ name: categoryName, assigned_budget: totalBudget })
                        .eq('id', categoryData.id)

                    // Thông báo thành công 
                    Alert.alert('Success', 'Category Edited!')

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

                {/*Nút sửa quỹ*/}
                {/* <TouchableOpacity onPress={() => setModalEdit(true)}>
                    <Entypo name="edit" size={24} color="red" />
                </TouchableOpacity> */}
                {/*Nút xóa quỹ*/}
                <TouchableOpacity onPress={() => onDeleteCategory()}>
                    <Entypo name="trash" size={24} color="red" />
                </TouchableOpacity>
            </View>
            <View style={styles.amountContainer}>
                {/* Tổng số tiền đã dùng  */}
                <Text style={{ fontWeight: '700' }}>{formatCurrency(totalCost)}</Text>
                {/* Tổng số tiền ban đầu có trong quỹ  */}
                <Text style={{ fontWeight: '700' }} >Total Budget: {formatCurrency(categoryData.assigned_budget)}</Text>
            </View>
            <View style={styles.progressBarMainContainer}>
                {/* Hiển thị thanh phần trăm số tiền đã dùng  */}
                <View style={[styles.progressBarSubContainer, { width: percTotal + '%' }]}></View>
            </View>

            {/* SỬA QUỸ  */}

            {modalEdit && (
                <Modal
                    visible={modalEdit}
                    animationType="slide" // hoặc "fade", "none"
                    transparent={true}
                    onRequestClose={() => setModalEdit(false)}

                >
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            <View style={{
                                alignItems: 'flex-end',  // Căn phải
                                marginBottom: 10,
                            }}>
                                <TouchableOpacity
                                    onPress={() => setModalEdit(false)}
                                    style={{
                                        width: 30,
                                        height: 30,
                                        borderRadius: 15,
                                        backgroundColor: '#f0f0f0',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                    }}
                                >
                                    <Text style={styles.closeButtonText}>X</Text>
                                </TouchableOpacity>
                            </View>


                            {/* Điền tên quỹ  */}
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
                                    value={categoryName}
                                    onChangeText={(value) => setCategoryName(value)}
                                ></TextInput>
                            </View>

                            {/* Điền số tiền  */}
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
                                    value={totalBudget}
                                    onChangeText={(value) => setTotalBudget(value)}
                                ></TextInput>
                            </View>

                            {/* Nút thêm quỹ  */}
                            <TouchableOpacity
                                style={styles.buttonCreate}
                                disabled={!categoryName || !totalBudget || loading}
                                onPress={() => { onEditCategory() }}
                            >
                                {loading ?
                                    <ActivityIndicator style={{ color: Colors.WHITE }}></ActivityIndicator>
                                    :
                                    <Text
                                        style={{
                                            textAlign: 'center',
                                            fontSize: 18,
                                            color: Colors.WHITE
                                        }}
                                    >Edit</Text>
                                }
                            </TouchableOpacity>

                        </View>
                    </View>
                </Modal>
            )}
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
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        width: '80%',
    },
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