import React, { useState, useEffect } from 'react';
import { View, Text, Image, Linking, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';


export default function NewsDetailScreen({ route }) {
  const { article } = route.params;
  const [isFavorite, setIsFavorite] = useState(false);


  useEffect(() => {
    checkIfFavorite();
  }, []);


  const checkIfFavorite = async () => {
    try {
      const stored = await AsyncStorage.getItem('favorites');
      const favorites = stored ? JSON.parse(stored) : [];
      const exists = favorites.some(item => item.url === article.url);
      setIsFavorite(exists);
    } catch (error) {
      console.error('Error checking favorites:', error);
    }
  };


  const toggleFavorite = async () => {
    try {
      const stored = await AsyncStorage.getItem('favorites');
      let favorites = stored ? JSON.parse(stored) : [];


      if (isFavorite) {
        favorites = favorites.filter(item => item.url !== article.url);
        Alert.alert("Thông báo", "Đã xóa khỏi mục yêu thích");
      } else {
        favorites.push(article);
        Alert.alert("Thông báo", "Đã thêm vào mục yêu thích");
      }


      await AsyncStorage.setItem('favorites', JSON.stringify(favorites));
      setIsFavorite(!isFavorite);
    } catch (error) {
      console.error('Error toggling favorite:', error);
      Alert.alert("Lỗi", "Đã có lỗi xảy ra khi thao tác");
    }
  };


  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };


  return (
    <ScrollView style={styles.container}>
     
      <View style={styles.header}>
       
        <TouchableOpacity style={styles.favoriteIcon} onPress={toggleFavorite}>
          <Ionicons
            name={isFavorite ? "heart" : "heart-outline"}
            size={24}
            color={isFavorite ? "#FF6B6B" : "#fff"}
          />
        </TouchableOpacity>
      </View>


      {article.urlToImage && (
        <Image
          source={{ uri: article.urlToImage }}
          style={styles.image}
          resizeMode="cover"
        />
      )}


      <View style={styles.content}>


        <View style={styles.categoryBadge}>
          <Text style={styles.categoryText}>{article.source?.name || 'Tin tức'}</Text>
        </View>


 
        <Text style={styles.title}>{article.title}</Text>


     
        <View style={styles.metaContainer}>
          <Text style={styles.metaText}>
            <Ionicons name="person-outline" size={14} /> {article.author || 'Không rõ tác giả'}
          </Text>
          <Text style={styles.metaText}>
            <Ionicons name="time-outline" size={14} /> {formatDate(article.publishedAt)}
          </Text>
        </View>


        <Text style={styles.description}>{article.description}</Text>


        <Text style={styles.contentText}>{article.content}</Text>


        <TouchableOpacity
          style={styles.readMoreButton}
          onPress={() => Linking.openURL(article.url)}
        >
          <Text style={styles.readMoreText}>Đọc toàn bài trên website</Text>
          <Ionicons name="open-outline" size={18} color="#FF6B6B" />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    position: 'absolute',
    top: 40,
    left: 20,
    right: 20,
    zIndex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backButton: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 20,
    padding: 8,
  },
  favoriteIcon: {


    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 20,
    padding: 8,
    left:'90%',
    top:'-20%'
  },
  image: {
    width: '100%',
    height: 300,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  categoryBadge: {
    backgroundColor: '#FF6B6B',
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginBottom: 16,
  },
  categoryText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    lineHeight: 32,
    marginBottom: 16,
    color: '#333',
  },
  metaContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  metaText: {
    fontSize: 13,
    color: '#666',
  },
  description: {
    fontSize: 18,
    lineHeight: 26,
    marginBottom: 20,
    color: '#444',
    fontWeight: '500',
  },
  contentText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
    marginBottom: 30,
  },
  readMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#FF6B6B',
    borderRadius: 12,
  },
  readMoreText: {
    color: '#FF6B6B',
    fontWeight: '600',
    marginRight: 8,
  },
});
