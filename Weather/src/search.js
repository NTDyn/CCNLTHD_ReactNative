import { View, TextInput, StyleSheet, Dimensions, Alert } from "react-native";
import React, { useState } from "react";
import { EvilIcons } from "@expo/vector-icons";

const WeatherSearch = ({ fetchWeatherData }) => {
    const [cityName, setCityName] = useState('');
    const handleSearch = () => {
        if (cityName.trim() === '') {
            Alert.alert('Thông báo', 'Vui lòng nhập tên thành phố');
        } else {
            fetchWeatherData(cityName);
        }
    };
    return (
        <View style={styles.searchBar}>
            <TextInput
                placeholder='Tìm kiếm Thành phố'
                value={cityName}
                onChangeText={(text) => setCityName(text)}
            />
            <EvilIcons name='search' size={28} color='black'
                onPress={handleSearch}
            />
        </View>
    )
}

export default WeatherSearch

const styles = StyleSheet.create({
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: Dimensions.get('screen').width - 20,
        borderWidth: 1.5,
        paddingVertical: 5,
        borderRadius: 25,
        marginHorizontal: 10,
        paddingHorizontal: 10,
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
        opacity: 0.9,
    }
})