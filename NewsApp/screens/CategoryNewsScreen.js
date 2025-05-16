import React, { useEffect, useState } from 'react';
import { View, FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import { fetchCategoryNews } from '../services/NewsApi';
import NewsItem from '../components/NewsItem';


const CategoryNewsScreen = ({ route, navigation }) => {
  const { category } = route.params;
  const [articles, setArticles] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true); // đang tải
  const [isMoreLoading, setIsMoreLoading] = useState(false); // đang tải thêm

  useEffect(() => {
    loadArticles(page);
  }, []);

  const loadArticles = async (currentPage) => {
    if (currentPage === 1) setLoading(true);
    else setIsMoreLoading(true);

    try {
      const newArticles = await fetchCategoryNews(category, currentPage);
      if (currentPage === 1) {
        setArticles(newArticles);
      } else {
        setArticles(prev => [...prev, ...newArticles]);
      }
    } catch (error) {
      console.log('Error fetching category news:', error);
    }

    setLoading(false);
    setIsMoreLoading(false);
  };

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    loadArticles(nextPage);
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" style={{ marginTop: 20 }} />
      ) : (
        <FlatList
          data={articles}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <NewsItem
              article={item}
              onPress={() => navigation.navigate('Chi tiết', { article: item })}
            />
          )}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            isMoreLoading ? <ActivityIndicator size="small" color="#999" /> : null
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2',
  },
});

export default CategoryNewsScreen;
