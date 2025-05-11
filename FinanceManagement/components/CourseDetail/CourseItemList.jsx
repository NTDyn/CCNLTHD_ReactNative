import { View, Text, StyleSheet, Image, TouchableOpacity, Alert, Linking } from 'react-native'
import React, { useState } from 'react'
import Colors from '../../utils/Colors'
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Feather from '@expo/vector-icons/Feather';
import { supabase } from '../../utils/SupabaseConfig';
import { formatCurrency } from '../../utils/FormatCurrency';

export default function CourseItemList({ categoryData, setUpdateRecord }) {

    const [expandItem, setExpandItem] = useState();

    // Hàm xóa các mục chi tiêu 
    const onDeleteItem = async (id) => {
        Alert.alert('Are you sure', 'Do you really want to delete this item', [
            {
                text: 'Cancel',
                style: 'cancel'
            },
            {
                text: 'Yes',
                style: 'destructive',
                onPress: async () => {
                    const { error } = await supabase
                        .from('CategoryItems')
                        .delete()
                        .eq('id', id);

                    Alert.alert('Success', 'Item was deleted!')
                    setUpdateRecord(true)
                }
            }
        ])

    }

    return (
        <View
            style={styles.container}
        >
            <Text style={styles.heading}>Item List</Text>
            <View style={{
                marginTop: 20
            }}>
                {categoryData?.CategoryItems?.length > 0 ? categoryData?.CategoryItems.map((item, index) => (
                    <React.Fragment key={index}>
                        <TouchableOpacity
                            onPress={() => setExpandItem(index)}
                            style={styles.itemContainer}
                        >
                            {/* Hiển thị hình ảnh của mục chi tiêu  */}
                            <Image
                                source={{ uri: item.image }}
                                style={styles.image}
                            ></Image>
                            <View
                                style={{
                                    flex: 1,
                                    marginLeft: 10
                                }}
                            >
                                {/* Hiển thị tên mục chi tiêu  */}
                                <Text style={styles.name} >

                                    {item.name}
                                </Text>
                                {/* Hiển thị ghi chú cho mục  */}
                                <Text style={styles.note}>{item.note}</Text>
                            </View>
                            {/* Hiển thị số tiền của mục */}
                            <Text style={styles.cost}>${formatCurrency(item.cost)}</Text>
                        </TouchableOpacity>
                        {expandItem == index &&
                            <View style={styles.actionItemContainer}>
                                {/* Nút xóa mục chi tiêu  */}
                                <TouchableOpacity onPress={() => onDeleteItem(item.id)}>
                                    <FontAwesome name="trash-o" size={24} color="red" />
                                </TouchableOpacity>

                            </View>
                        }
                        {categoryData?.CategoryItems.length - 1 != index &&
                            <View key={index}
                                style={{
                                    borderWidth: 0.5,
                                    marginTop: 10,
                                    borderColor: Colors.GRAY

                                }}
                            ></View>
                        }
                    </React.Fragment>
                )) :
                    <Text style={styles.noItemText}>No item found</Text>
                }
            </View>
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        marginTop: 20
    },
    heading: {
        fontWeight: 'bold',
        fontSize: 20
    },
    image: {
        width: 90,
        height: 90,
        borderRadius: 15
    },
    itemContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 10
    },
    name: {
        fontSize: 20,
        fontWeight: 'bold'
    },
    note: {
        fontWeight: 'bold',
        color: Colors.BLACK
    },
    cost: {
        fontWeight: 'bold',
        fontSize: 16,
        marginLeft: 10
    },
    noItemText: {
        fontWeight: 'bold',
        fontSize: 25,
        textAlign: 'center',
        color: Colors.GRAY
    },
    actionItemContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: 10
    }
})