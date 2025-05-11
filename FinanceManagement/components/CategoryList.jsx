import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'
import Colors from '../utils/Colors'
import { useRouter } from 'expo-router'
import { formatCurrency } from '../utils/FormatCurrency'

export default function CategoryList({ CategoryData }) {

    // hook để điều hướng trang 
    const router = useRouter();

    const onCategoryClick = (category) => {
        // Điều hướng đến trang chi tiết và gửi tham số category id 
        router.push({
            pathname: '/category-detail',
            params: {
                categoryId: category.id
            }
        })
    }

    // Tính số tiền còn lại của mỗi quỹ 
    const calculateTotalCost = (category) => {
        let total = 0;
        // Tính tổng số tiền đã dùng 
        category?.CategoryItems?.forEach(item => {
            total = total + item.cost
        })
        // Tiền còn = tiền ban đầu - tiền đã dùng 
        let leftCost = category?.assigned_budget - total;
        return leftCost;
    }
    return (
        <View
            style={{
                marginTop: 20
            }}
        >
            <Text
                style={{
                    fontWeight: 'bold',
                    fontSize: 25,
                    marginBottom: 10
                }}
            >Latest Budget</Text>
            <View >
                {/* Chạy qua từng quỹ để hiển thị  */}
                {CategoryData.map((category, index) => (
                    <TouchableOpacity
                        key={index}
                        style={styles.container}
                        onPress={() => onCategoryClick(category)}
                    >
                        <View style={styles.iconContainer}>
                            {/* Hiển thị icon và màu sắc của quỹ  */}
                            <Text style={[styles.iconText, { backgroundColor: category?.color }]}>{category?.icon}</Text>
                        </View>
                        <View
                            style={styles.subContainer}
                        >
                            <View style={styles.textContainer}>
                                {/* Hiển thị tên của quỹ  */}
                                <Text style={styles.categoryText} >{category.name}</Text>
                                {/* Hiển thị số lượng mục trong quỹ  */}
                                <Text style={styles.itemCount}>{category?.CategoryItems?.length} Items</Text>
                            </View>
                            {/* Dùng hàm để format dạng tiền  */}
                            <Text style={styles.totalAmountText}>{formatCurrency(calculateTotalCost(category))}</Text>
                        </View>
                    </TouchableOpacity>

                ))}
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    iconText: {
        fontSize: 25,
        padding: 10,
        borderRadius: 15
    },
    iconContainer: {
        justifyContent: 'center',
        alignItems: 'baseline'
    },
    container: {
        marginBottom: 10,
        display: 'flex',
        flexDirection: 'row',
        gap: 10,
        alignItems: 'center',
        backgroundColor: Colors.WHITE,
        padding: 10,
        borderRadius: 15
    },
    textContainer: {
        padding: 5,
    },
    categoryText: {
        fontWeight: 'bold',
        fontSize: 16,
        flexWrap: 'wrap',
        flexShrink: 1,
        maxWidth: 150
    },
    itemCount: {
        fontFamily: 'outfit'
    },
    subContainer: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '80%'
    },
    totalAmountText: {
        fontWeight: '700',
        fontSize: 14,
    }
})