import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, TouchableOpacity, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/Feather';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';

const SignUpPage: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [profileImage, setProfileImage] = useState<string | null>(null);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setProfileImage(result.assets[0].uri);
    }
  };

  const handleSignUp = async () => {
    if (username.trim() === '' || password.trim() === '') {
      Alert.alert('Error', 'Username and password cannot be empty.');
      return;
    }

    if (!profileImage) {
      Alert.alert('Error', 'Profile image is required.');
      return;
    }

    try {
      const existingUser = await AsyncStorage.getItem(username);
      if (existingUser) {
        Alert.alert('Error', 'Username already exists.');
        return;
      }

      // Store the new user's credentials
      await AsyncStorage.setItem(username, password);

      // Store profile picture URI
      await AsyncStorage.setItem(`${username}_profileImage`, profileImage);

      await AsyncStorage.setItem('loggedIn', 'true');
      await AsyncStorage.setItem('loggedInUser', username);

      Alert.alert('Success', 'Account created successfully!');
      router.replace('/(tabs)/'); // Navigate to the home page
    } catch (error) {
      console.error('Failed to sign up:', error);
      Alert.alert('Error', 'An error occurred while creating the account.');
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.replace('/login')}>
        <Icon name="arrow-left" size={24} color="#4CAF50" />
      </TouchableOpacity>

      <Text style={styles.title}>Sign Up</Text>

      <TouchableOpacity onPress={pickImage} style={styles.imagePickerContainer}>
        {profileImage ? (
          <Image source={{ uri: profileImage }} style={styles.profileImage} />
        ) : (
          <Text style={styles.imagePlaceholder}>Profile Image</Text>
        )}
      </TouchableOpacity>

      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <Button title="Sign Up" onPress={handleSignUp} color="#4CAF50" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    padding: 10,
    zIndex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  imagePickerContainer: {
    alignSelf: 'center',
    marginBottom: 20,
    borderRadius: 50,
    overflow: 'hidden',
    width: 100,
    height: 100,
    borderColor: '#4CAF50',
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  profileImage: {
    width: '100%',
    height: '100%',
    borderRadius: 50,
  },
  imagePlaceholder: {
    color: '#4CAF50',
    fontSize: 14,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: '#4CAF50',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    paddingHorizontal: 10,
  },
});

export default SignUpPage;
