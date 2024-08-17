import React, { useState, useEffect } from 'react';
import { StyleSheet, ImageBackground, View, Text, Image, TouchableOpacity, Linking, ScrollView } from 'react-native';

const Image1 = require('../../assets/images/1.png');
const Image2 = require('../../assets/images/2.png');
const Image3 = require('../../assets/images/3.png');
const Image4 = require('../../assets/images/4.png');
const Image5 = require('../../assets/images/5.png');
const Image6 = require('../../assets/images/6.png');
const Image7 = require('../../assets/images/af.png');
const arrow = require('../../assets/images/arrow.png'); 
const Image8 = require('../../assets/images/gr.png'); 

const images = [Image1, Image4, Image5];

export default function ExploreScreen() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const handleLinkPress = () => {
    Linking.openURL('https://www.aagwa.org/home#');
  };

  const handleArticlePress = () => {
    Linking.openURL('https://www.aagwa.org/home#');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.textContainer}>
        <Text style={styles.headerText}>
          Agriculture in Africa: A Growing Future That Can Only Be Limited By Our Visions
        </Text>
        <Image
          source={arrow} 
          style={styles.rightImage}
        />
      </View>

      {/* Image7 Full-Width Container */}
      <View style={styles.image7Container}>
        <Image
          source={Image7}
          style={styles.image7}
          resizeMode="cover"
        />
      </View>

      {/* Shuffling Images Container */}
      <View style={styles.imageContainer}>
        <ImageBackground
          source={images[currentImageIndex]}
          style={styles.image}
          resizeMode="contain"
        />
      </View>

      {/* Articles Section */}
      <View style={styles.articlesContainer}>
        <Text style={styles.sectionHeader}>Articles</Text>

        {/* Article 1 */}
        <TouchableOpacity onPress={handleArticlePress} style={styles.articleCard}>
          <Image source={Image1} style={styles.articleImage} />
          <View style={styles.articleContent}>
            <Text style={styles.articleTitle}>The Future of Farming in Africa</Text>
            <Text style={styles.articleDescription}>
              Explore how innovative farming techniques are changing the landscape of agriculture in Africa.
            </Text>
          </View>
        </TouchableOpacity>

        {/* Article 2 */}
        <TouchableOpacity onPress={handleArticlePress} style={styles.articleCard}>
          <Image source={Image2} style={styles.articleImage} />
          <View style={styles.articleContent}>
            <Text style={styles.articleTitle}>Sustainable Agriculture</Text>
            <Text style={styles.articleDescription}>
              Learn about the sustainable practices that are being adopted to protect Africa’s resources.
            </Text>
          </View>
        </TouchableOpacity>

        {/* Article 3 */}
        <TouchableOpacity onPress={handleArticlePress} style={styles.articleCard}>
          <Image source={Image3} style={styles.articleImage} />
          <View style={styles.articleContent}>
            <Text style={styles.articleTitle}>Impact of Technology</Text>
            <Text style={styles.articleDescription}>
              Discover how technology is revolutionizing the agriculture industry across the continent.
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Image8 Container */}
      <View style={styles.image8Container}>
        <Image
          source={Image8}
          style={styles.image8}
          resizeMode="cover"
        />
      </View>

      {/* Footer Section - Moved Below Image8 */}
      <View style={styles.footerContainer}>
        <Text style={styles.footerText}>
          AgriVision is here to assist with the latest updates from the most reliable of sources in their own areas with data visualisation tools including those of{' '}
          <TouchableOpacity onPress={handleLinkPress}>
            <Text style={styles.linkText}>RESAKSS</Text>
          </TouchableOpacity>
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingBottom: 20, // Added padding to ensure space at the bottom
  },
  textContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  headerText: {
    flex: 1,
    fontSize: 16,
    fontWeight: 'bold',
    color: 'green',
    flexWrap: 'wrap',
  },
  rightImage: {
    width: '50%',
    height: 80,
    resizeMode: 'contain',
  },
  image7Container: {
    width: '100%',
    height: 200,
    marginBottom: 10,
  },
  image7: {
    width: '100%',
    height: '100%',
  },
  imageContainer: {
    flex: 1,
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: 200,
  },
  articlesContainer: {
    paddingHorizontal: 10,
    paddingTop: 20,
    backgroundColor: '#f0f0f0',
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'green',
    marginBottom: 15,
  },
  articleCard: {
    flexDirection: 'row',
    marginBottom: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  articleImage: {
    width: 100,
    height: 100,
  },
  articleContent: {
    flex: 1,
    padding: 10,
  },
  articleTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'green',
    marginBottom: 5,
  },
  articleDescription: {
    fontSize: 14,
    color: '#555',
  },
  image8Container: {
    width: '100%',
    height: 150, // Adjust height as needed
    marginBottom: 20,
  },
  image8: {
    width: '100%',
    height: '100%',
  },
  footerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingTop: 20, 
  },
  footerText: {
    fontSize: 14,
    textAlign: 'center',
    flexWrap: 'wrap',
    color: 'green'
  },
  linkText: {
    color: 'blue',
    textDecorationLine: 'underline',
  },
});
