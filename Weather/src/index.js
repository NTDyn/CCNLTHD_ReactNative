import { View, Text, StyleSheet, Alert, ActivityIndicator, ImageBackground } from 'react-native'
import React, { useState, useEffect } from 'react'
import Constants from 'expo-constants'
import WeatherInfo from './WeatherInfo';

const API_KEY = 'c94d893d5f790cc8f20106ee9a41872e';

const Weather = () => {
    const [weatherData, setWeatherData] = useState(null);
    const [forecastData, setForecastData] = useState(null);
    const [loaded, setLoaded] = useState(false);

    // Hàm lấy thông tin thời tiết hiện tại
    const fetchWeatherData = async (cityName) => {
        try {
            setLoaded(false);
            const weatherResponse = await fetch(
                `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}&units=metric&lang=vi`
            );
            const weatherJson = await weatherResponse.json();
            if (weatherResponse.status === 200) {
                setWeatherData(weatherJson);
                await fetchForecastData(cityName);
            } else {
                Alert.alert('Thông báo', `Không tìm thấy thành phố: ${weatherJson.message}`);
                console.log('Weather API error:', weatherJson);
                setLoaded(true);
            }
        } catch (error) {
            Alert.alert('Thông báo', 'Lỗi khi lấy dữ liệu thời tiết. Vui lòng kiểm tra lại!');
            console.error('Weather fetch error:', error);
            setLoaded(true);
        }
    };

    // Hàm lấy dữ liệu dự báo 5 ngày
    const fetchForecastData = async (cityName) => {
        try {
            const forecastResponse = await fetch(
                `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${API_KEY}&units=metric&lang=vi`
            );
            const forecastJson = await forecastResponse.json();
            if (forecastResponse.status === 200) {
                const dailyForecast = [];
                const seenDates = new Set();
                for (const item of forecastJson.list) {
                    const date = item.dt_txt.split(' ')[0];
                    if (!seenDates.has(date)) {
                        seenDates.add(date);
                        dailyForecast.push(item);
                    }
                    if (dailyForecast.length >= 5) break;
                }
                setForecastData(dailyForecast);
                console.log('Forecast data loaded:', dailyForecast);
                setLoaded(true);
            } else {
                Alert.alert('Thông báo', `Không thể lấy dữ liệu dự báo: ${forecastJson.message}`);
                console.log('Forecast API error:', forecastJson);
                setForecastData([]);
                setLoaded(true);
            }
        } catch (error) {
            Alert.alert('Thông báo', 'Lỗi khi lấy dữ liệu dự báo. Vui lòng thử lại!');
            console.error('Forecast fetch error:', error);
            setForecastData([]);
            setLoaded(true);
        }
    };

    // Nhớ tên thành phố của mình
    useEffect(() => {
        fetchWeatherData('Ho Chi Minh City');
    }, []);

    // Nếu dữ liệu không được tải, hiển thị thông báo đang tải
    if (!loaded) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color="red" />
            </View>
        );
    }

    return (
        <ImageBackground
            source={require('../assets/sky.png')}
            style={styles.container}
            resizeMode="cover"
        >
            <View style={styles.header}>
                <Text style={styles.headerTitle}>ỨNG DỤNG THỜI TIẾT</Text>
            </View>
            <WeatherInfo
                weatherData={weatherData}
                forecastData={forecastData}
                fetchWeatherData={fetchWeatherData}
            />
        </ImageBackground>
    );
};

export default Weather;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FCF5DB',
        paddingTop: Constants.statusBarHeight,
    },
    header: {
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        height: 50,
        justifyContent: 'center',
    },
    headerTitle: {
        fontSize: 23,
        fontWeight: 'bold',
    },
});