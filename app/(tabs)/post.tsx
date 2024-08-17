import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, Image, StyleSheet, TouchableOpacity, ListRenderItem, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { User } from 'lucide-react';
interface Post {
  id: string;
  userName: string;
  userProfileImage: string; // Added field for profile image URL
  postContent: string;
  imageUrl?: string;
  likes: number;
  comments: number;
  source?: string;
}

const IndexPage: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [likedPosts, setLikedPosts] = useState<{ [key: string]: boolean }>({});
  const [loginButtonPressed, setLoginButtonPressed] = useState(false);
  const [newPostContent, setNewPostContent] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState<string | null>(null);
  const [profileImage, setProfileImage] = useState<string | null>(null); // New state for the profile image

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

    const checkLoginStatus = async () => {
      const loggedIn = await AsyncStorage.getItem('loggedIn');
      setIsLoggedIn(loggedIn === 'true');

      if (loggedIn === 'true') {
        const username = await AsyncStorage.getItem('loggedInUser');
        const userProfileImage = await AsyncStorage.getItem(`${username}_profileImage`); // Fetch the profile image URL
        setLoggedInUser(username);
        setProfileImage(userProfileImage);
      }
    };

    loadPosts();
    checkLoginStatus();
  }, []);

  const savePosts = async (posts: Post[]) => {
    try {
      await AsyncStorage.setItem('posts', JSON.stringify(posts));
    } catch (error) {
      console.error('Failed to save posts:', error);
    }
  };

  const toggleLike = (postId: string) => {
    setPosts(prevPosts =>
      prevPosts.map(post =>
        post.id === postId
          ? {
            ...post,
            likes: likedPosts[postId] ? post.likes - 1 : post.likes + 1
          }
          : post
      )
    );
    setLikedPosts(prevState => ({
      ...prevState,
      [postId]: !likedPosts[postId],
    }));
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const handlePost = async () => {
    if (!isLoggedIn) {
      router.replace('/login');
      return;
    }

    if (newPostContent.trim() === '') {
      Alert.alert('Error', 'Post content cannot be empty.');
      return;
    }

    if (!loggedInUser) {
      Alert.alert('Error', 'You must be logged in to post.');
      return;
    }

    const newPost: Post = {
      id: (posts.length + 1).toString(),
      userName: loggedInUser,
      userProfileImage: profileImage || 'https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png?20150327203541', // Default profile image if not available
      postContent: newPostContent,
      imageUrl: selectedImage || undefined,
      likes: 0,
      comments: 0,
    };
    const updatedPosts = [newPost, ...posts];
    setPosts(updatedPosts);
    setNewPostContent('');
    setSelectedImage(null);
    await savePosts(updatedPosts);
  };

  const handleLoginLogout = async () => {
    if (isLoggedIn) {
      await AsyncStorage.removeItem('loggedIn');
      await AsyncStorage.removeItem('loggedInUser');
      await AsyncStorage.removeItem(`${loggedInUser}_profileImage`); // Remove profile image URL on logout
      setIsLoggedIn(false);
      setLoggedInUser(null);
      setProfileImage(null);
      router.replace('/login');
    } else {
      router.replace('/login');
    }
  };

  const renderPost: ListRenderItem<Post> = ({ item }) => (
    <View style={styles.postCard}>
      <View style={styles.postHeader}>
        <Image source={{ uri: item.userProfileImage }} style={styles.profileImage} /> {/* Use profile image from post */}
        <Text style={styles.userName}>{item.userName}</Text>
      </View>
      {item.imageUrl && (
        <>
          <Image source={{ uri: item.imageUrl }} style={styles.postImage} />
          <Text style={styles.sourceText}>Source: {item.source}</Text>
        </>
      )}
      <Text style={styles.postContent}>{item.postContent}</Text>

      <View style={styles.interactionContainer}>
        <TouchableOpacity
          style={[
            styles.interactionButton,
            likedPosts[item.id] ? styles.likedButton : null
          ]}
          onPress={() => toggleLike(item.id)}
        >
          <Icon name="heart" size={18} color={likedPosts[item.id] ? "#FFFFFF" : "#4CAF50"} />
          <Text style={[styles.buttonText, { color: likedPosts[item.id] ? "#FFFFFF" : "#4CAF50" }]}>
            {item.likes}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.interactionButton}>
          <Icon name="message-square" size={18} color="#4CAF50" />
          <Text style={styles.buttonText}>{item.comments}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.mainContainer}>
      <View style={styles.header}>
        <Text style={styles.logo}>AgriVision</Text>
        <TouchableOpacity
          style={[
            styles.logButton,
            loginButtonPressed ? styles.loginButtonPressed : null
          ]}
          onPress={handleLoginLogout}
          onPressIn={() => setLoginButtonPressed(true)}
          onPressOut={() => setLoginButtonPressed(false)}
        >
          <User color="#FFFFFF" size={16} />
          <Text style={styles.loginText}>{isLoggedIn ? "Logout" : "Login"}</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.postCreation}>
        <View style={styles.postInputContainer}>
          <TextInput
            style={styles.postInput}
            placeholder="Update AgriVision about Agriculture in your area"
            placeholderTextColor="#888888" // Color matching the username color
            multiline
            value={newPostContent}
            onChangeText={setNewPostContent}
          />
          <TouchableOpacity onPress={pickImage} style={styles.imagePickerButton}>
            <Icon name="image" size={20} color="#4CAF50" />
          </TouchableOpacity>
        </View>
        <Button title="Post" color="#4CAF50" onPress={handlePost} />
      </View>
      <View style={styles.contentContainer}>
        <FlatList
          data={posts}
          renderItem={renderPost}
          keyExtractor={(item) => item.id}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#e8f5e9',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
    backgroundColor: '#4CAF50',
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  logo: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
  loginText: {
    color: '#ffffff',
    fontSize: 14,
    marginLeft: 5, // Adjust margin to position text next to icon
  },
  
  logButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 5,
    borderRadius: 20,
  },
  loginButtonPressed: {
    backgroundColor: '#4CAF50',
  },
  logButtonText: {
    color: '#4CAF50',
    fontSize: 14,
    marginRight: 5,
  },
  loginIcon: {
    marginLeft: 5,
  },
  postCreation: {
    marginBottom: 20,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  postInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#4CAF50',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  postInput: {
    flex: 1,
    height: 50,
    fontSize: 12,
  },
  imagePickerButton: {
    padding: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 5,
  },
  contentContainer: {
    flex: 1,
    padding: 10,
    backgroundColor: 'transparent',
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
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  userName: {
    fontSize: 14,
    fontWeight: 'semibold',
    color: '#888888',
  },
  postContent: {
    fontSize: 12,
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
    marginBottom: 10,
    textAlign: 'right',
  },
  interactionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  interactionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginRight: 10,
  },
  likedButton: {
    backgroundColor: '#4CAF50',
  },
  buttonText: {
    marginLeft: 5,
    fontSize: 12,
  },
});

export default IndexPage;
