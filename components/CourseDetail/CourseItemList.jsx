import { View, Text, StyleSheet, Image } from 'react-native'
import React from 'react'
import Colors from '../../utils/Colors'

export default function CourseItemList({ categoryData }) {

    console.log(categoryData)
    return (
        <View
            style={styles.container}
        >
            <Text style={styles.heading}>Item List</Text>
            <View style={{
                marginTop: 20
            }}>
                {categoryData?.CategoryItems?.length > 0 ? categoryData?.CategoryItems.map((item, index) => (
                    <>
                        <View key={index}
                            style={styles.itemContainer}
                        >
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
                                <Text style={styles.name} >

                                    {item.name}
                                </Text>
                                <Text style={styles.url}>{item.url}</Text>
                            </View>
                            <Text style={styles.cost}>${item.cost}</Text>
                        </View>
                        {categoryData?.CategoryItems.length - 1 != index &&
                            <View
                                style={{
                                    borderWidth: 0.5,
                                    marginTop: 10,
                                    borderColor: Colors.GRAY

                                }}
                            ></View>
                        }
                    </>
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
        alignItems: 'center'
    },
    name: {
        fontSize: 20,
        fontWeight: 'bold'
    },
    url: {
        fontWeight: 'bold',
        color: Colors.GRAY
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
    }
})