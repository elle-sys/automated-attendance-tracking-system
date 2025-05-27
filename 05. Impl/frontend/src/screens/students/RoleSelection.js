import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  SafeAreaView,
  Image,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const RoleSelection = () => {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Back Button */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.navigate('Welcome')}
        >
          <Ionicons name="arrow-back-circle-outline" size={50} color="#fff" />
        </TouchableOpacity>

        <View style={styles.headerContainer}>
          <Image
            source={require('../../assets/images/Logo2.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        <View style={styles.loginSection}>
          <Text style={styles.title}>Select a Role</Text>
          <Text style={styles.subtitle}>Choose how you want to access the App</Text>

          <View style={styles.buttonsContainer}>
            <TouchableOpacity
              style={[styles.button, styles.loginButton]}
              onPress={() => navigation.navigate('AdminLogin')}
            >
              <Text style={styles.buttonText}>Admin</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.loginButton]}
              onPress={() => navigation.navigate('InstructorLogin')}
            >
              <Text style={styles.buttonText}>Instructor</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.loginButton]}
              onPress={() => navigation.navigate('StudentLogin')}
            >
              <Text style={styles.buttonText}>Student</Text>
            </TouchableOpacity>
          </View>
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
    paddingVertical: 30,
    paddingHorizontal: width * 0.05,
    justifyContent: 'flex-start',
  },
  backButton: {
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logo: {
    width: width > 768 ? width * 0.4 : width * 0.8,
    height: width > 768 ? width * 0.3 : width * 0.5,
  },
  loginSection: {
    width: '100%',
    alignItems: 'center',
    marginTop: 10,
  },
  title: {
    fontSize: width > 768 ? 30 : 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: width > 768 ? 18 : 16,
    color: '#fff',
    marginBottom: 24,
    textAlign: 'center',
  },
  buttonsContainer: {
    width: '100%',
    alignItems: 'center',
    gap: 16,
  },
  button: {
    width: '50%',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2.0,
  },
  loginButton: {
    backgroundColor: '#89e4f0',
  },
  buttonText: {
    color: '#fff',
    fontSize: width > 768 ? 20 : 16,
    fontWeight: '600',
  },
});

export default RoleSelection;
