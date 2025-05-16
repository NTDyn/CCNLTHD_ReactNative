import React, { useEffect, useState, useCallback } from "react";
import { useNavigation } from '@react-navigation/native';
import {
  View,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  Text,
  SafeAreaView,
  StatusBar
} from "react-native";
import NewsItem from "../components/NewsItem";
import { getTopHeadlines } from "../services/NewsApi";


export default function HomeScreen() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const navigation = useNavigation();

  // Tải danh sách tin tức nổi bật
  const loadNews = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true); //Đang tải
    try {
      const articles = await getTopHeadlines(page); // Gọi hàm getTopHeadlines với số trang hiện tại (page)
      if (articles.length === 0) {
        setHasMore(false);
      } else {
        setNews(prev => [...prev, ...articles]);
        setPage(prev => prev + 1);
      }
    } catch (error) {
      console.log("Error fetching news:", error);
    }
    setLoading(false);
  }, [page, hasMore, loading]);


  useEffect(() => {
    loadNews();
  }, []);

  // Footer
  const renderFooter = () => {
    if (!loading) return null;
    return (
      <View style={styles.footerContainer}>
        <ActivityIndicator size="large" color="#4E8AF4" />
        <Text style={styles.loadingText}>Đang tải thêm...</Text>
      </View>
    );
  };

  // Header
  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <Text style={styles.headerTitle}>Tin tức nổi bật</Text>
    </View>
  );


  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <FlatList // FlatList là một component dùng để hiển thị danh sách các mục dữ liệu hiệu quả hơn
        data={news}
        keyExtractor={(item, index) => `${item.url}-${index}`} //  hàm để xác định "key" duy nhất cho mỗi phần tử trong danh sách
        renderItem={({ item }) => (
          <NewsItem
            article={item}
            onPress={() => navigation.navigate('Chi tiết', { article: item })}
          />
        )}
        onEndReached={loadNews} // một sự kiện được kích hoạt khi người dùng cuộn đến cuối danh sách.
        onEndReachedThreshold={0.2} //  xác định khoảng cách từ cuối danh sách (tính theo tỉ lệ phần trăm) khi sự kiện onEndReached được gọi.
        ListFooterComponent={renderFooter} //  hiển thị một phần tử đặc biệt ở cuối danh sách
        ListHeaderComponent={renderHeader} //  hiển thị một phần tử đặc biệt ở đầu danh sách.
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
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
    backgroundColor: "#fff",
    paddingHorizontal: 16,
  },
  listContent: {
    paddingBottom: 16,
  },
  headerContainer: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
 
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',


  },
  footerContainer: {
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 8,
    color: '#666',
    fontSize: 14,
  },
});
