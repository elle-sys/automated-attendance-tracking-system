import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  SafeAreaView,
  Pressable,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../../config';
import CustomAlert from '../../components/CustomAlert';

const { width, height } = Dimensions.get('window');

const InstructorLogin = () => {
  const navigation = useNavigation();
  const [idNumber, setIdNumber] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({
    visible: false,
    type: 'error',
    message: ''
  });

  const handleLogin = async () => {
    if (!idNumber || !password) {
      setAlert({
        visible: true,
        type: 'error',
        message: 'Please fill in all fields'
      });
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(`${API_URL}/api/instructors/login`, {
        instructorId: idNumber,
        password,
      });

      if (response.data.success) {
        await AsyncStorage.multiSet([
          ['idNumber', response.data.instructor.idNumber],
          ['instructorName', response.data.instructor.fullName],
          ['userType', 'instructor']
        ]);

        setAlert({
          visible: true,
          type: 'success',
          message: 'Login successful!'
        });

        setTimeout(() => {
          navigation.replace('InstructorDashboard');
        }, 1500);
      }
    } catch (err) {
      setAlert({
        visible: true,
        type: 'error',
        message: err.response?.data?.message || 'An error occurred during login'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.navigate('RoleSelection')}
      >
        <Ionicons name="arrow-back-circle-outline" size={50} color="#fff" />
      </TouchableOpacity>

      {alert.visible && (
        <CustomAlert
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert({ ...alert, visible: false })}
        />
      )}

      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {/* Header */}
            <View style={styles.header}>
              <Image
                source={require('../../assets/images/Logo2.png')}
                style={styles.logo}
                resizeMode="contain"
              />
              <Text style={styles.title}>Instructor Login</Text>
              <Text style={styles.subtitle}>Please login to your instructor account</Text>
            </View>

            {/* Login Form */}
            <View style={styles.form}>
              {/* ID Number */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>ID Number</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your ID number"
                  value={idNumber}
                  onChangeText={setIdNumber}
                  keyboardType="default"
                  autoCapitalize="none"
                />
              </View>

              {/* Password */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Password</Text>
                <View style={styles.passwordContainer}>
                  <TextInput
                    style={styles.passwordInput}
                    placeholder="Enter your password"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                  />
                  <Pressable
                    style={styles.eyeIcon}
                    onPress={() => setShowPassword(!showPassword)}
                  >
                    <Ionicons
                      name={showPassword ? 'eye-off' : 'eye'}
                      size={24}
                      color="#999999"
                    />
                  </Pressable>
                </View>
              </View>

              <Pressable style={styles.forgotPassword}>
                <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
              </Pressable>

              {/* Login Button */}
              <Pressable
                style={({ pressed }) => [
                  styles.loginButton,
                  loading && styles.loginButtonDisabled,
                  pressed && styles.loginButtonPressed,
                ]}
                onPress={handleLogin}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <Text style={styles.loginButtonText}>Login</Text>
                )}
              </Pressable>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
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
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 10,
    zIndex: 2,
    padding: 8,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  logo: {
    width: width * 0.3,
    height: width * 0.2,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#fff',
    textAlign: 'center',
    paddingHorizontal: 10,
  },
  form: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 25,
    width: '100%',
    maxWidth: 400,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  inputContainer: {
    marginBottom: 22,
  },
  label: {
    fontSize: 20,
    color: '#333',
    marginBottom: 10,
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    height: 45,
    fontSize: 17,
    paddingHorizontal: 10,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    height: 45,
  },
  passwordInput: {
    flex: 1,
    fontSize: 17,
    paddingHorizontal: 10,
  },
  eyeIcon: {
    paddingHorizontal: 10,
  },
  forgotPassword: {
    marginBottom: 22,
    alignItems: 'flex-end',
  },
  forgotPasswordText: {
    color: '#007BFF',
    fontWeight: '500',
  },
  loginButton: {
    backgroundColor: '#89e4f0',
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 23,
  },
  loginButtonDisabled: {
    opacity: 0.6,
  },
  loginButtonPressed: {
    opacity: 0.9,
  },
});

export default InstructorLogin;
