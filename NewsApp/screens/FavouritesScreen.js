import React, { useEffect, useState } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  StatusBar
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NewsItem from '../components/NewsItem';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';


export default function FavoritesScreen() {
  const [favorites, setFavorites] = useState([]);
  const navigation = useNavigation();


  useFocusEffect(
    // React.useCallback là một hook giúp "ghi nhớ" (memoize) hàm để không tạo lại hàm đó mỗi khi component re-render. Nó chỉ tạo lại hàm callback nếu bất kỳ giá trị nào trong mảng phụ thuộc thay đổi.
    React.useCallback(() => {
      loadFavorites();
    }, [])
  );


  const loadFavorites = async () => {
    try {
      const stored = await AsyncStorage.getItem('favorites');
      const list = stored ? JSON.parse(stored) : [];
      setFavorites(list);
    } catch (error) {
      console.error('Error loading favorites:', error);
    }
  };


  const removeFavorite = async (article) => {
    Alert.alert(
      'Xác nhận',
      'Bạn có chắc muốn xóa bài viết này khỏi mục yêu thích?',
      [
        {
          text: 'Hủy',
          style: 'cancel',
        },
        {
          text: 'Xóa',
          onPress: async () => {
            try {
              const stored = await AsyncStorage.getItem('favorites');
              let list = stored ? JSON.parse(stored) : [];
              list = list.filter(item => item.url !== article.url);
              await AsyncStorage.setItem('favorites', JSON.stringify(list));
              setFavorites(list);
            } catch (error) {
              console.error('Error removing favorite:', error);
            }
          },
          style: 'destructive',
        },
      ]
    );
  };


  const renderItem = ({ item }) => (
    <View style={styles.favoriteItem}>
      <NewsItem
        article={item}
        onPress={() => navigation.navigate('Chi tiết', { article: item })}
      />
      <TouchableOpacity
        style={styles.removeButton}
        onPress={() => removeFavorite(item)}
      >
        <Ionicons name="trash-bin" size={20} color="#fff" />
        <Text style={styles.removeText}> Xóa khỏi yêu thích</Text>
      </TouchableOpacity>
    </View>
  );


  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <View style={styles.container}>
        <Text style={styles.headerTitle}>Bài viết yêu thích</Text>
       
        {favorites.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="heart-outline" size={60} color="#ddd" />
            <Text style={styles.emptyTitle}>Chưa có bài viết yêu thích</Text>
            <Text style={styles.emptySubtitle}>Nhấn vào biểu tượng trái tim để thêm bài viết</Text>
          </View>
        ) : (
          <FlatList
            data={favorites}
            keyExtractor={(item, index) => `${item.url}-${index}`}
            renderItem={renderItem}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginVertical: 20,
    paddingHorizontal: 8,
  },
  favoriteItem: {
    marginBottom: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  removeButton: {
    backgroundColor: '#ff4444',
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 15,
    marginLeft: 5,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 100,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    marginTop: 16,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
    textAlign: 'center',
    paddingHorizontal: 40,
  },
  listContent: {
    paddingBottom: 20,
  },
});
