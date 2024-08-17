import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, Image, StyleSheet, TouchableOpacity, ListRenderItem } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { User } from 'lucide-react';

interface Post {
    id: string;
    userName: string;
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
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [loggedInUser, setLoggedInUser] = useState<string | null>(null);
    const [profileImages, setProfileImages] = useState<{ [key: string]: string }>({});

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

        const loadProfileImages = async () => {
            try {
                const keys = await AsyncStorage.getAllKeys();
                const profileImageKeys = keys.filter(key => key.endsWith('_profileImage'));

                const imageUrls = await Promise.all(profileImageKeys.map(async key => {
                    const username = key.split('_')[0];
                    const imageUri = await AsyncStorage.getItem(key);
                    return { username, imageUri };
                }));

                const profileImagesObject = imageUrls.reduce((acc, { username, imageUri }) => {
                    acc[username] = imageUri || 'https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png?20150327203541';
                    return acc;
                }, {} as { [key: string]: string });

                setProfileImages(profileImagesObject);
            } catch (error) {
                console.error('Failed to load profile images:', error);
            }
        };

        const checkLoginStatus = async () => {
            const loggedIn = await AsyncStorage.getItem('loggedIn');
            setIsLoggedIn(loggedIn === 'true');

            if (loggedIn === 'true') {
                const username = await AsyncStorage.getItem('loggedInUser');
                setLoggedInUser(username);
            }
        };

        loadPosts();
        loadProfileImages();
        checkLoginStatus();
    }, []);

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

    const handleLoginLogout = async () => {
        if (isLoggedIn) {
            await AsyncStorage.removeItem('loggedIn');
            await AsyncStorage.removeItem('loggedInUser');
            setIsLoggedIn(false);
            setLoggedInUser(null);
            router.replace('/login');
        } else {
            router.replace('/login');
        }
    };

    const renderPost: ListRenderItem<Post> = ({ item }) => (
        <View style={styles.postCard}>
            <View style={styles.postHeader}>
                <Image
                    source={{ uri: profileImages[item.userName] || 'https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png?20150327203541' }}
                    style={styles.profileImage}
                />
                <Text style={styles.userName}>{item.userName}</Text>
            </View>

            {item.imageUrl && (
                <>
                    <Image source={{ uri: item.imageUrl }} style={styles.postImage} />
                    <Text style={styles.postContent}>{item.postContent}</Text>
                    <Text style={styles.sourceText}>Source: {item.source}</Text>
                </>
            )}
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
                <Text style={styles.logo}>Agri Vision</Text>
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
                    <Text style={styles.loginText}>{isLoggedIn ? "logout" : "login"}</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.postCreationContainer}>
                <FlatList
                    data={posts}
                    renderItem={renderPost}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.flatListContent}
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
    logButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 5,
        borderRadius: 20,
    },
    loginButtonPressed: {},
    loginText: {
        color: '#ffffff',
        fontSize: 14,
        marginLeft: 5, // Adjust margin to position text next to icon
    },
    postCreationContainer: {
        flex: 1,
    },
    flatListContent: {
        padding: 10,
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
        fontSize: 10,
    },
});

export default IndexPage;
