import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'
import Colors from '../utils/Colors'
import { useRouter } from 'expo-router'
import { formatCurrency } from '../utils/FormatCurrency'

export default function CategoryList({ CategoryData }) {

    const router = useRouter();
    const onCategoryClick = (category) => {
        router.push({
            pathname: '/category-detail',
            params: {
                categoryId: category.id
            }
        })
    }

    const calculateTotalCost = (category) => {
        let total = 0;
        category?.CategoryItems?.forEach(item => {
            total = total + item.cost
        })
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
                {CategoryData.map((category, index) => (
                    <TouchableOpacity
                        key={index}
                        style={styles.container}
                        onPress={() => onCategoryClick(category)}
                    >
                        <View style={styles.iconContainer}>
                            <Text style={[styles.iconText, { backgroundColor: category?.color }]}>{category?.icon}</Text>
                        </View>
                        <View
                            style={styles.subContainer}
                        >
                            <View style={styles.textContainer}>
                                <Text style={styles.categoryText} >{category.name}</Text>
                                <Text style={styles.itemCount}>{category?.CategoryItems?.length} Items</Text>
                            </View>
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
        fontSize: 35,
        padding: 15,
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
        flexShrink: 1, // Thêm dòng này
    },
    categoryText: {
        fontWeight: 'bold',
        fontSize: 18,
        flexWrap: 'wrap', // Thêm dòng này
    },
    itemCount: {
        fontFamily: 'outfit'
    },
    subContainer: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '70%'
    },
    totalAmountText: {
        fontWeight: '700',
        fontSize: 16,
    }
})