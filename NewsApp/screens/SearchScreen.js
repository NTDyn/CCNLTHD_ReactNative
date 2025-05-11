import React, { useState } from 'react';
import {
  View,
  TextInput,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Keyboard
} from 'react-native';
import { fetchNewsByKeyword } from '../services/NewsApi.js';
import NewsItem from '../components/NewsItem';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

export default function SearchScreen() {
  const [keyword, setKeyword] = useState('');
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  const handleSearch = async () => {
    if (keyword.trim() === '') return;
    Keyboard.dismiss(); 
    setLoading(true);
    try {
      const articles = await fetchNewsByKeyword(keyword);
      setNews(articles);
    } catch (error) {
      console.error("Search error:", error);
    }
    setLoading(false);
  };

  const clearSearch = () => {
    setKeyword('');
    setNews([]);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <View style={styles.container}>
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.input}
            placeholder="Tìm kiếm tin tức..."
            placeholderTextColor="#999"
            value={keyword}
            onChangeText={setKeyword}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
            clearButtonMode="while-editing"
          />
          {keyword ? (
            <TouchableOpacity onPress={clearSearch} style={styles.clearButton}>
              <Ionicons name="close-circle" size={22} color="#ccc" />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={handleSearch} style={styles.searchButton}>
              <Ionicons name="search" size={22} color="#4E8AF4" />
            </TouchableOpacity>
          )}
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#4E8AF4" />
            <Text style={styles.loadingText}>Đang tìm kiếm...</Text>
          </View>
        ) : news.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="newspaper-outline" size={60} color="#ddd" />
            <Text style={styles.noResult}>Không có kết quả nào được tìm thấy</Text>
            <Text style={styles.noResultSub}>Hãy thử với từ khóa khác</Text>
          </View>
        ) : (
          <FlatList
            data={news}
            keyExtractor={(item, index) => `${item.url}-${index}`}
            renderItem={({ item }) => (
              <NewsItem
                article={item}
                onPress={() => navigation.navigate('Chi tiết', { article: item })}
              />
            )}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            ListHeaderComponent={<Text style={styles.resultsText}>{news.length} kết quả tìm kiếm</Text>}
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
    position: 'relative',
  },
  input: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 24,
    fontSize: 16,
    color: '#333',
    paddingRight: 50,
  },
  clearButton: {
    position: 'absolute',
    right: 16,
    padding: 8,
  },
  searchButton: {
    position: 'absolute',
    right: 16,
    padding: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    color: '#666',
    fontSize: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 100,
  },
  noResult: {
    marginTop: 16,
    fontSize: 18,
    color: '#666',
    fontWeight: '500',
  },
  noResultSub: {
    marginTop: 8,
    fontSize: 14,
    color: '#999',
  },
  listContent: {
    paddingBottom: 16,
  },
  resultsText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
    marginLeft: 8,
  },
});