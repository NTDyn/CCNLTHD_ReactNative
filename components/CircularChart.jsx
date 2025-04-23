import { View, Text, StyleSheet } from 'react-native'
import React, { useState } from 'react'
import PieChart from 'react-native-pie-chart'
import Colors from '../utils/Colors';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

export default function CircularChart() {

    const widthAndHeight = 150;
    const series = [
        { value: 430, color: '#fbd203' },
        { value: 321, color: '#ffb300' },
        { value: 185, color: '#ff9100' },
        { value: 123, color: '#ff6c00' },
    ]


    const [values, setValues] = useState([1]);
    const [sliceColors, setSliceColors] = useState([Colors.GRAY])
    return (
        <View
            style={styles.container}
        >
            <Text
                style={{
                    fontSize: 20,
                }}
            >Total Estimate:
                <Text style={{ fontWeight: 'bold' }}>0$</Text>
            </Text>
            <View
                style={styles.subContainer}
            >
                <PieChart
                    widthAndHeight={widthAndHeight}
                    series={series}
                    cover={0.65}

                />
                <View
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                        gap: 5,
                        alignItems: 'center'
                    }}
                >
                    <MaterialCommunityIcons
                        name="checkbox-blank-circle"
                        size={24}
                        color={Colors.GRAY} />
                    <Text>NA</Text>
                </View>
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

    }
}) 