import { View, Text, StyleSheet, Alert, ActivityIndicator, ImageBackground } from 'react-native'
import React, { useState, useEffect } from 'react'
import Constants from 'expo-constants'
import WeatherInfo from './WeatherInfo';

const API_KEY = 'c94d893d5f790cc8f20106ee9a41872e';

const Weather = () => {
    
    const [weatherData, setWeatherData] = useState(null); // biến state: weatherData để lấy dữ liệu thời tiết, và hàm setWeatherData để cập nhật giá trị
    const [forecastData, setForecastData] = useState(null); // biến state: forecastData để lấy dữ liệu dự báo thời tiết, và hàm setForecastData để cập nhật giá trị
    const [loaded, setLoaded] = useState(false); // biến state: loaded để kiểm soát dữ liệu tải xong chưa, và hàm setLoaded để cập nhật giá trị

    // Hàm lấy thông tin thời tiết hiện tại
    const fetchWeatherData = async (cityName) => {
        try {
            setLoaded(false); // đang tải dữ liệu
            // Gọi API lấy dữ liệu thời tiết hiện tại
            const weatherResponse = await fetch( // await: đợi phản hồi từ server trước khi chạy tiếp.
                `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}&units=metric&lang=vi` // units=metric: lấy nhiệt độ theo độ C
            );
            const weatherJson = await weatherResponse.json(); // chuyển nội dung phản hồi thành json dễ xử lý
            if (weatherResponse.status === 200) { // Nếu lấy dữ liệu thành công (200 là thành công)
                setWeatherData(weatherJson); // 
                await fetchForecastData(cityName); // sau khi có dữ liệu thời tiết hiện tại -> gọi hàm dự báo để lấy dữ báo 5 ngày tới
            } else { // Nếu lấy dữ liệu ko thành công
                Alert.alert('Thông báo', `Không tìm thấy thành phố: ${weatherJson.message}`);
                console.log('Weather API error:', weatherJson);
                setLoaded(true); // kết thúc quá trình tải
            }
        } catch (error) { // Nếu có lỗi khi gọi API
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
            if (forecastResponse.status === 200) { // Nếu lấy dữ liệu dự báo thành công
                const dailyForecast = []; // mảng 5 dữ liệu mỗi ngày 1 lần
                const seenDates = new Set(); // tạo 1 Set() để không lấy dữ liệu trùng trong 1 ngày (vì API dự báo 3 giờ 1 lần)
                for (const item of forecastJson.list) { // Mỗi item chứa dữ liệu cho 1 thời điểm (3 giờ 1 lần)
                    const date = item.dt_txt.split(' ')[0]; // item.dt_txt có định dạng "2025-05-11 12:00:00"/ split(' ')[0] tách lấy phần "2025-05-11" để so sánh theo ngày.
                    if (!seenDates.has(date)) { // Kiểm tra nếu ngày này chưa xuất hiện
                        seenDates.add(date);
                        dailyForecast.push(item); // Thêm item đó vào dailyForecast
                    }
                    if (dailyForecast.length >= 5) break; // đủ 5 ngày dừng lại
                }
                setForecastData(dailyForecast); // cập nhật mảng
                console.log('Forecast data loaded:', dailyForecast);
                setLoaded(true);
            } else {
                Alert.alert('Thông báo', `Không thể lấy dữ liệu dự báo: ${forecastJson.message}`);
                console.log('Forecast API error:', forecastJson);
                setForecastData([]); // đặt lại trạng thái
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
        return ( // sử dụng ActivityIndicator: vòng tròn quay biểu thị đang xử lý
            <View style={styles.container}> 
                <ActivityIndicator size="large" color="red" /> 
            </View>
        );
    }

    return (
        <ImageBackground
            source={require('../assets/sky.png')}
            style={styles.container}
            resizeMode="cover" // Ảnh sẽ được phóng to/cắt bớt để che kín toàn bộ khung hình mà không bị méo.
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
        flex: 1, // chiếm toàn bộ không gian màn hình
        backgroundColor: '#FCF5DB',
        paddingTop: Constants.statusBarHeight, //Thêm khoảng cách trên cùng = chiều cao thanh trạng thái (tránh bị che).
    },
    header: {
        alignItems: 'center', // Căn nội dung con theo trục ngang (ngang giữa).
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        height: 50,
        justifyContent: 'center', // Căn nội dung con theo chiều dọc (giữa khối).
    },
    headerTitle: {
        fontSize: 23,
        fontWeight: 'bold',
    },
});