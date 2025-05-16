import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import HomeScreen from './screens/HomeScreen';
import SearchScreen from './screens/SearchScreen';
import FavoritesScreen from './screens/FavouritesScreen';
import NewsDetailScreen from './screens/NewsDetailScreen';
import CategoryScreen from './screens/CategoryScreen';
import CategoryNewsScreen from './screens/CategoryNewsScreen';


const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();
function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#1e90ff',
        tabBarInactiveTintColor: 'gray',
        tabBarIcon: ({ color, size }) => {
          let iconName;


          if (route.name === 'Trang chủ') {
            iconName = 'home-outline';
          } else if (route.name === 'Tìm kiếm') {
            iconName = 'search-outline';
          } else if (route.name === 'Yêu thích') {
            iconName = 'heart-outline';
          } else if (route.name === "Danh mục") {
            iconName = "apps-outline"
          }


          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Trang chủ" component={HomeScreen} />
      <Tab.Screen name="Danh mục" component={CategoryScreen} />
      <Tab.Screen name="Tìm kiếm" component={SearchScreen} />
      <Tab.Screen name="Yêu thích" component={FavoritesScreen} />

    </Tab.Navigator>
  );
}


export default function App() {


  return (

    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Main"
          component={TabNavigator}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Chi tiết"
          component={NewsDetailScreen}
          options={{ title: 'Chi tiết bài viết' }}
        />
        <Stack.Screen name="CategoryNews" component={CategoryNewsScreen} options={{ title: 'Tin tức danh mục' }} />


      </Stack.Navigator>
    </NavigationContainer>
  );
}