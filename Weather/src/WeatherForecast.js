import { View, Text, StyleSheet, Image, Dimensions } from "react-native";
import React from "react";

const WeatherForecast = ({ forecastData }) => {
    const getDayOfWeek = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN', { weekday: 'long' });
    };

    return (
        <View style={styles.forecastContainer}>
            <Text style={styles.forecastTitle}>Dự báo 5 ngày</Text>
            {forecastData && forecastData.length > 0 ? ( // Kiểm tra có dữ liệu dự báo không
                forecastData.map((item, index) => (
                    // Sử dụng key={index}: Khóa duy nhất cho từng item trong danh sách
                    <View key={index} style={styles.forecastItem}> 
                        <Text style={styles.forecastDay}>{getDayOfWeek(item.dt_txt)}</Text>
                        <Image
                            style={styles.forecastIcon}
                            source={{ uri: `https://openweathermap.org/img/wn/${item.weather[0].icon}.png` }}
                        />
                        <Text style={styles.forecastTemp}>{item.main.temp} °C</Text>
                        <Text style={styles.forecastDesc}>{item.weather[0].description}</Text>
                    </View>
                ))
            ) : ( // Nếu không có dữ liệu
                <Text style={styles.noDataText}>Không có dữ liệu dự báo</Text>
            )}
        </View>
    );
};

export default WeatherForecast;

const styles = StyleSheet.create({
    forecastContainer: {
        margin: 10,
        padding: 10,
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        borderRadius: 15,
    },
    forecastTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 10,
        color: '#e96e50',
    },
    forecastItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    forecastDay: {
        fontSize: 16,
        fontWeight: 'bold',
        flex: 1,
    },
    forecastIcon: {
        width: 50,
        height: 50,
    },
    forecastTemp: {
        fontSize: 16,
        fontWeight: 'bold',
        flex: 1,
        textAlign: 'center',
    },
    forecastDesc: {
        fontSize: 14,
        flex: 1,
        textAlign: 'right',
    },
    noDataText: {
        textAlign: 'center',
        fontSize: 16,
        color: '#ff0000',
    },
});