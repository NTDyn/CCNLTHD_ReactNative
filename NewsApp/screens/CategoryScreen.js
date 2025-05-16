import React from 'react';
import { View, FlatList, StyleSheet, SafeAreaView, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';


const categories = [
  { name: 'business', icon: 'briefcase' },
  { name: 'entertainment', icon: 'film' },
  { name: 'general', icon: 'newspaper' },
  { name: 'health', icon: 'medkit' },
  { name: 'science', icon: 'flask' },
  { name: 'sports', icon: 'trophy' },
  { name: 'technology', icon: 'laptop' }
];


const CategoryScreen = () => {
  const navigation = useNavigation();


  const handleCategoryPress = (category) => {
    navigation.navigate('CategoryNews', { category: category.name });
  };


  const renderCategoryItem = ({ item }) => (
    <TouchableOpacity
      style={styles.categoryCard}
      onPress={() => handleCategoryPress(item)}
      activeOpacity={0.8}
    >
      <View style={[styles.iconContainer, { backgroundColor: getCategoryColor(item.name) }]}>
        <Ionicons
          name={item.icon}
          size={24}
          color="#fff"
        />
      </View>
      <Text style={styles.categoryName}>
        {item.name.charAt(0).toUpperCase() + item.name.slice(1)}
      </Text>
    </TouchableOpacity>
  );


  const getCategoryColor = (category) => {
    const colors = {
      business: '#4E8AF4',
      entertainment: '#FF6B6B',
      general: '#20C997',
      health: '#F06595',
      science: '#94D82D',
      sports: '#FF922B',
      technology: '#7950F2'
    };
    return colors[category] || '#4E8AF4';
  };


  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Danh mục tin tức</Text>
        <Text style={styles.subtitle}>Chọn danh mục bạn quan tâm</Text>

        <FlatList
          data={categories}
          renderItem={renderCategoryItem}
          keyExtractor={(item) => item.name}
          numColumns={2}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </SafeAreaView>
  );
};


const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 24,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  listContent: {
    paddingBottom: 24,
  },
  categoryCard: {
    flex: 1,
    margin: 8,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
});


export default CategoryScreen;
