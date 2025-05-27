import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  SafeAreaView,
  ScrollView,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

const Welcome = () => {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.logoContainer}>
          <Image
            source={require('../../assets/images/Logo2.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        <View style={styles.descriptionContainer}>
          <Text style={styles.description}>
            "Streamline Your Attendance Process{'\n'}
            Boost Efficiency, Save Time,{'\n'}
            and Access Real-Time Insights —{'\n'}
            All with One Intelligent Solution!"
          </Text>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.loginButton}
            onPress={() => navigation.navigate('RoleSelection')}
          >
            <Text style={styles.loginButtonText}>Login</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'space-evenly',
    paddingVertical: 30,
    paddingHorizontal: width * 0.05,
  },
  logoContainer: {
    alignItems: 'center',
    width: '100%',
  },
  logo: {
    width: width > 768 ? width * 0.4 : width * 0.8,
    height: width > 768 ? width * 0.3 : width * 0.5,
  },
  descriptionContainer: {
    width: '100%',
    marginTop: 20,
    paddingHorizontal: 10,
  },
  description: {
    fontSize: width > 768 ? 24 : 18,
    color: '#fff',
    textAlign: 'center',
    lineHeight: width > 768 ? 34 : 28,
    fontWeight: '600',
  },
  buttonContainer: {
    width: '100%',
    marginTop: 30,
    alignItems: 'center',
  },
  loginButton: {
    backgroundColor: '#89e4f0',
    paddingVertical: width > 768 ? 14 : 12,
    paddingHorizontal: 40,
    borderRadius: 10,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: width > 768 ? 24 : 20,
    fontWeight: 'bold',
  },
});

export default Welcome;
