import { View, Text, StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'
import Entypo from '@expo/vector-icons/Entypo';
import Colors from '../../utils/Colors';
import CourseItemList from './CourseItemList';

export default function CourseInfo({ categoryData }) {

    const [totalCost, setTotalCost] = useState();
    const [percTotal, setPerTotal] = useState();
    const calculateTotalPerc = () => {
        let total = 0;
        categoryData?.CategoryItems?.forEach(item => {
            total = total + item.cost
        })
        setTotalCost(total)
        const perc = total / categoryData.assigned_budget * 100
        setPerTotal(perc)
    }
    useEffect(() => {
        categoryData && calculateTotalPerc();
    }, [categoryData])
    return (
        <View>
            <View style={styles.container}>
                <View style={styles.iconContainer}>
                    <Text style={[styles.textIcon, { backgroundColor: categoryData.color }]}>{categoryData.icon}</Text>
                </View>
                <View
                    style={{
                        flex: 1,
                        marginLeft: 20
                    }}
                >
                    <Text style={styles.categoryName}>{categoryData.name}</Text>
                    <Text style={styles.categoryItemText}>{categoryData.CategoryItems?.length} Items</Text>
                </View>
                <Entypo name="trash" size={24} color="red" />
            </View>
            <View style={styles.amountContainer}>
                <Text style={{ fontWeight: '700' }}>${totalCost}</Text>
                <Text style={{ fontWeight: '700' }} >Total Budget: {categoryData.assigned_budget}</Text>
            </View>
            <View style={styles.progressBarMainContainer}>
                <View style={[styles.progressBarSubContainer, { width: percTotal + '%' }]}>

                </View>
            </View>
            <CourseItemList
                categoryData={categoryData}
            ></CourseItemList>
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
        height: 15
    }
})