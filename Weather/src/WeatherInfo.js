import { View, Text, SafeAreaView, StyleSheet, Image, Dimensions, ScrollView, TouchableOpacity, Alert } from "react-native";
import React, { useState, useEffect } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import WeatherSearch from "./search";
import WeatherForecast from "./WeatherForecast";

const WeatherInfo = ({ weatherData, forecastData, fetchWeatherData }) => { // nhận 3 props từ component cha
    const {
        name,
        visibility,
        weather: [{ icon, description }],
        main: { temp, humidity, feels_like },
        wind: { speed },
        sys: { sunrise, sunset },
    } = weatherData;

    const [favorites, setFavorites] = useState([]); // giá trị ban đầu là mảng rỗng

    // Tải danh sách vị trí yêu thích từ AsyncStorage
    useEffect(() => {
        const loadFavorites = async () => {
            try {
                // sử dụng AsyncStorage.getItem(...) để đọc dữ liệu đã lưu
                const storedFavorites = await AsyncStorage.getItem('favoriteCities');
                if (storedFavorites) {
                    setFavorites(JSON.parse(storedFavorites)); // chuyển từ chuỗi thành mảng
                }
            } catch (error) {
                console.error('Error loading favorites:', error);
            }
        };
        loadFavorites();
    }, []);

    // Lưu vị trí yêu thích
    const saveFavorite = async () => {
        try {
            if (favorites.includes(name)) { // Kiểm tra thành phố ${name} có trong mảng chưa
                Alert.alert('Thông báo', `${name} đã có trong danh sách yêu thích!`);
                return;
            }
            const newFavorites = [...favorites, name]; //Tạo một mảng mới chứa tất cả các thành phố cũ trong favorites và thêm name vào cuối.
            //  Dùng AsyncStorage.setItem() để lưu danh sách mới vào bộ nhớ cục bộ.
            await AsyncStorage.setItem('favoriteCities', JSON.stringify(newFavorites)); // Dữ liệu phải chuyển thành chuỗi JSON
            setFavorites(newFavorites);
            Alert.alert('Thông báo', `${name} đã được thêm vào yêu thích!`);
        } catch (error) {
            console.error('Error saving favorite:', error);
            Alert.alert('Thông báo', 'Lỗi khi lưu vị trí yêu thích!');
        }
    };

    // Xóa vị trí yêu thích
    const removeFavorite = async (city) => {
        try { 
            // Dùng filter() để tạo một mảng mới không chứa thành phố cần xóa.
            const newFavorites = favorites.filter(fav => fav !== city); // fav => fav !== city: giữ lại các phần tử mà khác với city cần xóa
            await AsyncStorage.setItem('favoriteCities', JSON.stringify(newFavorites));
            setFavorites(newFavorites);
            Alert.alert('Thông báo', `${city} đã được xóa khỏi yêu thích!`);
        } catch (error) {
            console.error('Error removing favorite:', error);
            Alert.alert('Thông báo', 'Lỗi khi xóa vị trí yêu thích!');
        }
    };

    return (
        <SafeAreaView style={styles.container}> // SafeAreaView đảm bảo rằng nội dung không bị che khuất
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={true} // hiển thị thanh cuộn dọc
                bounces={true} // cho phép có hiệu ứng nhún khi người dùng kéo đến cuối danh sách.
            >
                <WeatherSearch fetchWeatherData={fetchWeatherData} />
                <View style={styles.cityHeader}>
                    <Text style={styles.title}>{name}</Text>
                    <TouchableOpacity style={styles.favoriteButton} onPress={saveFavorite}> // Khi nhấn vào, hàm saveFavorite sẽ được gọi để lưu thành phố vào danh sách yêu thích.
                        <Text style={styles.favoriteButtonText}>Lưu vào yêu thích</Text>
                    </TouchableOpacity>
                </View>
                {favorites.length > 0 && ( // Kiểm tra nếu có thành phố yêu thích (tức là favorites không rỗng), nếu có, thì hiển thị phần yêu thích.
                    <View style={styles.favoritesContainer}>
                        <Text style={styles.favoritesTitle}>Vị trí yêu thích</Text>
                        {favorites.map((city, index) => ( // Duyệt qua danh sách thành phố yêu thích (favorites) và tạo ra các thành phần con cho từng thành phố trong danh sách.
                            <View key={index} style={styles.favoriteItem}>
                                <TouchableOpacity
                                    onPress={() => fetchWeatherData(city)}
                                    style={styles.favoriteCity}
                                >
                                    <Text style={styles.favoriteCityText}>{city}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => removeFavorite(city)}
                                    style={styles.removeButton}
                                >
                                    <Text style={styles.removeButtonText}>Xóa</Text>
                                </TouchableOpacity>
                            </View>
                        ))}
                    </View>
                )}
                <View style={styles.logo}>
                    <Image
                        style={styles.largeIcon}
                        source={{ uri: `https://openweathermap.org/img/wn/${icon}.png` }}
                    />
                    <Text style={styles.currentTemp}>{temp} °C</Text>
                </View>
                <Text style={styles.description}>{description}</Text>
                <View style={styles.extraInfo}>
                    <View style={styles.info}>
                        <Image
                            style={styles.smallIcon}
                            source={require('../assets/temperature.png')}
                        />
                        <Text style={styles.infoText}>{feels_like}°C</Text>
                        <Text style={styles.infoText}>Cảm giác như</Text>
                    </View>
                    <View style={styles.info}>
                        <Image
                            style={styles.smallIcon}
                            source={require('../assets/humidity.png')}
                        />
                        <Text style={styles.infoText}>{humidity} %</Text>
                        <Text style={styles.infoText}>Độ ẩm</Text>
                    </View>
                </View>
                <View style={styles.extraInfo}>
                    <View style={styles.info}>
                        <Image
                            style={styles.smallIcon}
                            source={require('../assets/visibility.png')}
                        />
                        <Text style={styles.infoText}>{visibility} m</Text>
                        <Text style={styles.infoText}>Tầm nhìn</Text>
                    </View>
                    <View style={styles.info}>
                        <Image
                            style={styles.smallIcon}
                            source={require('../assets/wind.png')}
                        />
                        <Text style={styles.infoText}>{speed} m/s</Text>
                        <Text style={styles.infoText}>Tốc độ gió</Text>
                    </View>
                </View>
                <View style={styles.extraInfo}>
                    <View style={styles.info}>
                        <Image
                            style={styles.smallIcon}
                            source={require('../assets/sunrise.png')}
                        />
                        <Text style={styles.infoText}>{new Date(sunrise * 1000).toLocaleString()}</Text>
                        <Text style={styles.infoText}>Mặt trời mọc</Text>
                    </View>
                    <View style={styles.info}>
                        <Image
                            style={styles.smallIcon}
                            source={require('../assets/sunset.png')}
                        />
                        <Text style={styles.infoText}>{new Date(sunset * 1000).toLocaleString()}</Text>
                        <Text style={styles.infoText}>Mặt trời lặn</Text>
                    </View>
                </View>
                <WeatherForecast forecastData={forecastData || []} />
            </ScrollView>
        </SafeAreaView>
    );
};

export default WeatherInfo;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 15, // Tạo khoảng cách từ phía trên
    },
    scrollContent: {
        paddingBottom: 20, // Tạo khoảng cách ở dưới cùng của nội dung trong
    },
    cityHeader: {
        flexDirection: 'row', // Xếp các thành phần trong View theo chiều ngang (cùng một hàng)
        alignItems: 'center', //  Căn giữa các thành phần theo chiều dọc
        justifyContent: 'space-between', // Tạo khoảng cách đều giữa các thành phần
        paddingHorizontal: 10, // Tạo khoảng cách 10px ở hai bên trái và phải của phần tử.
        marginTop: 10,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#e96e50',
    },
    favoriteButton: {
        backgroundColor: '#e96e50',
        padding: 8, // Tạo khoảng cách bên trong
        borderRadius: 10,
    },
    favoriteButtonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
    },
    favoritesContainer: {
        margin: 10, // Tạo khoảng cách xung quanh
        padding: 10,
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        borderRadius: 15,
    },
    favoritesTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#e96e50',
        marginBottom: 10, 
    },
    favoriteItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 5,
    },
    favoriteCity: {
        flex: 1,
    },
    favoriteCityText: {
        fontSize: 16,
        color: '#333',
    },
    removeButton: {
        backgroundColor: '#ff4444',
        padding: 5,
        borderRadius: 5,
    },
    removeButtonText: {
        color: '#fff',
        fontSize: 12,
    },
    logo: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
    },
    largeIcon: {
        width: 180,
        height: 180,
    },
    currentTemp: {
        fontSize: 30,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    description: {
        textAlign: 'center',
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    extraInfo: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 10,
    },
    info: {
        width: Dimensions.get('screen').width / 2.5,
        backgroundColor: '#D0EAFA',
        padding: 10,
        borderRadius: 15,
        justifyContent: 'center',
    },
    smallIcon: {
        height: 40,
        width: 40,
        borderRadius: 20,
        marginLeft: 50,
    },
    infoText: {
        textAlign: 'center',
        fontSize: 16,
    },
});