import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'
import Colors from '../utils/Colors'
import { useRouter } from 'expo-router'

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
                            <View>
                                <Text style={styles.categoryText}>{category.name}</Text>
                                <Text style={styles.itemCount}>{category.CategoryItems?.length} Items</Text>
                            </View>
                            <Text style={styles.totalAmountText}>60</Text>
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
    categoryText: {
        fontWeight: 'bold',
        fontSize: 20,
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
        fontWeight: 'bold',
        fontSize: 20,

    }
})