import { View, Text, Button, StyleSheet, ScrollView, RefreshControl } from 'react-native'
import React, { useEffect, useState } from 'react'
import { getData, storeData } from '../../utils/services';
import { Link, useRouter } from 'expo-router';
import Header from '../../components/Header';
import Colors from '../../utils/Colors';
import CircularChart from '../../components/CircularChart';
import Ionicons from '@expo/vector-icons/Ionicons';
import CategoryList from '../../components/CategoryList';
import { supabase } from '../../utils/SupabaseConfig';

export default function Home() {

    const router = useRouter();
    const [CategoryData, setCategoryData] = useState([]);
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        getCategoryList();
    }, [])


    const getCategoryList = async () => {
        setLoading(true)
        const user = await getData('user');
        const { data: Category, error } = await supabase
            .from('Category')
            .select('*, CategoryItems(*)')
            .eq('created_by', JSON.parse(user).username)
        setCategoryData(Category)
        setLoading(false)
        data && setLoading(false)
    }

    return (
        <View
            style={{
                marginTop: 20,
                flex: 1,
            }}
        >
            <ScrollView
                refreshControl={
                    <RefreshControl
                        onRefresh={() => getCategoryList()}
                        refreshing={loading}
                    />

                }
            >
                <View
                    style={{
                        marginTop: 20,
                        padding: 20,
                        backgroundColor: Colors.PRIMARY,
                        height: 150
                    }}
                >
                    <Header></Header>
                </View>
                <View
                    style={{
                        padding: 20,
                        marginTop: -75
                    }}>
                    <CircularChart
                        CategoryData={CategoryData}
                    ></CircularChart>
                    <CategoryList
                        CategoryData={CategoryData}
                    ></CategoryList>
                </View>
            </ScrollView>
            <Link
                href={'/add-new-category'}
                style={styles.adBtnContainer}
            >
                <Ionicons name="add-circle" size={64} color={Colors.PRIMARY} />
            </Link>
        </View >
    )
}

const styles = StyleSheet.create({
    adBtnContainer: {
        position: 'absolute',
        bottom: 16,
        right: 16,

    }
})