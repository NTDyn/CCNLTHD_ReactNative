import { View, Text, StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'
import PieChart from 'react-native-pie-chart'
import Colors from '../utils/Colors';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { formatCurrency } from '@/utils/FormatCurrency';

export default function CircularChart({ CategoryData }) {
    const widthAndHeight = 150;
    const [totalCalEstimate, setTotalCalEstimate] = useState(0);
    const [values, setValues] = useState([1]);
    const [sliceColors, setSliceColors] = useState([Colors.GRAY]);
    // Thêm state mới để lưu danh sách đã sắp xếp
    const [sortedCategories, setSortedCategories] = useState([]);
    const [otherCost, setOtherCost] = useState(0);

    useEffect(() => {
        updateCircilarChart();
    }, [CategoryData]);

    const updateCircilarChart = () => {
        let totalEstimate = 0;
        setSliceColors([]);
        setValues([]);
        setOtherCost(0);

        if (!CategoryData || CategoryData.length === 0) {
            setSliceColors([Colors.GRAY]);
            setValues([1]);
            setTotalCalEstimate(0);
            setSortedCategories([]);
            return;
        }

        // Tính toán và sắp xếp categories
        const calculatedCategories = CategoryData.map(category => {
            const categoryTotal = category.CategoryItems?.reduce(
                (sum, item) => sum + (item.cost || 0), 0
            ) || 0;
            totalEstimate += categoryTotal;
            return { ...category, total: categoryTotal };
        }).sort((a, b) => b.total - a.total);

        // Lưu danh sách đã sắp xếp vào state
        setSortedCategories(calculatedCategories);

        let newOtherCost = 0;
        const topCategories = calculatedCategories.slice(0, 4);

        // Cập nhật values và sliceColors cho 4 category đầu
        topCategories.forEach((category, index) => {
            if (category.total > 0) {
                setSliceColors(prev => [...prev, Colors.COLOR_LIST[index]]);
                setValues(prev => [...prev, category.total]);
            }
        });

        // Tính toán otherCost cho các category còn lại
        if (calculatedCategories.length > 4) {
            newOtherCost = calculatedCategories.slice(4).reduce(
                (sum, category) => sum + category.total, 0
            );
            setOtherCost(newOtherCost);
        }

        // Thêm otherCost nếu có
        if (newOtherCost > 0) {
            setSliceColors(prev => [...prev, Colors.COLOR_LIST[4]]);
            setValues(prev => [...prev, newOtherCost]);
        }

        // Fallback nếu không có dữ liệu
        if (values.length === 0 && newOtherCost === 0) {
            setSliceColors([Colors.GRAY]);
            setValues([1]);
        }

        setTotalCalEstimate(totalEstimate);
    }

    return (
        <View style={styles.container}>
            <Text style={{ fontSize: 20 }}>
                Total Estimate:
                <Text style={{ fontWeight: 'bold' }}> {formatCurrency(totalCalEstimate)}</Text>
            </Text>
            <View style={styles.subContainer}>
                <PieChart
                    widthAndHeight={widthAndHeight}
                    series={values}
                    sliceColor={sliceColors}
                    coverRadius={0.65}
                />
                {sortedCategories.length === 0 ? (
                    <View style={{ display: 'flex', flexDirection: 'row', gap: 5, alignItems: 'center' }}>
                        <MaterialCommunityIcons
                            name="checkbox-blank-circle"
                            size={24}
                            color={Colors.GRAY} />
                        <Text>NA</Text>
                    </View>
                ) : (
                    <View>
                        {/* Hiển thị 4 category đầu tiên từ sortedCategories */}
                        {sortedCategories.slice(0, 4).map((category, index) => (
                            <View key={index} style={{
                                display: 'flex',
                                flexDirection: 'row',
                                gap: 5,
                                alignItems: 'center',
                                marginBottom: 5,
                                maxWidth: 150
                            }}>
                                <MaterialCommunityIcons
                                    name="checkbox-blank-circle"
                                    size={24}
                                    color={Colors.COLOR_LIST[index]} />
                                <Text
                                    style={{
                                        flexShrink: 1, // Cho phép text co lại khi cần
                                        flexWrap: 'wrap',
                                        maxWidth: 150,
                                    }}

                                >{category.name}</Text>
                            </View>
                        ))}
                        {/* Hiển thị Other nếu có */}
                        {otherCost > 0 && (
                            <View style={{
                                display: 'flex',
                                flexDirection: 'row',
                                gap: 5,
                                alignItems: 'center'
                            }}>
                                <MaterialCommunityIcons
                                    name="checkbox-blank-circle"
                                    size={24}
                                    color={Colors.COLOR_LIST[4]} />
                                <Text>Other</Text>
                            </View>
                        )}
                    </View>
                )}
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        marginTop: 20,
        backgroundColor: Colors.WHITE,
        padding: 20,
        borderRadius: 15,
        elevation: 1
    },
    subContainer: {
        marginTop: 20,
        display: 'flex',
        flexDirection: 'row',
        gap: 40,

    },
    chartNameContainer: {

    }
}) 