import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, StyleSheet, Image, TouchableOpacity, ListRenderItem } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Post {
  id: string;
  userName: string;
  postContent: string;
  imageUrl?: string;
  likes: number;
  comments: number;
  source?: string;
}

const SearchPage: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const storedPosts = await AsyncStorage.getItem('posts');
        if (storedPosts) {
          setPosts(JSON.parse(storedPosts));
        }
      } catch (error) {
        console.error('Failed to load posts:', error);
      }
    };

    loadPosts();
  }, []);

  useEffect(() => {
    const results = posts.filter(post =>
      post.postContent.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredPosts(results);
  }, [searchQuery, posts]);

  const renderPost: ListRenderItem<Post> = ({ item }) => (
    <View style={styles.postCard}>
      <View style={styles.postHeader}>
        <Image
          source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png?20150327203541' }} // Placeholder profile image
          style={styles.profileImage}
        />
        <Text style={styles.userName}>{item.userName}</Text>
      </View>
      {item.imageUrl && (
        <>
          <Image source={{ uri: item.imageUrl }} style={styles.postImage} />
          <Text style={styles.sourceText}>Source: {item.source}</Text>
        </>
      )}
      <Text style={styles.postContent}>{item.postContent}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search posts..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      <FlatList
        data={filteredPosts}
        renderItem={renderPost}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.flatListContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e8f5e9',
    padding: 10,
  },
  searchInput: {
    height: 60,
    borderColor: '#4CAF50',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  postCard: {
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginBottom: 10,
    backgroundColor: '#ffffff',
    elevation: 2,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  profileImage: {
    width: 30,
    height: 30,
    borderRadius: 20,
    marginRight: 10,
  },
  userName: {
    fontSize: 14,
    fontWeight: 'semibold',
    color: '#888888',
  },
  postContent: {
    fontSize: 13,
    color: '#000',
    marginBottom: 10,
  },
  postImage: {
    width: '100%',
    height: 150,
    borderRadius: 10,
    marginBottom: 5,
  },
  sourceText: {
    fontSize: 12,
    color: '#888888',
    marginBottom: 5,
    textAlign: 'right',
  },
  flatListContent: {
    padding: 10,
  },
});

export default SearchPage;
