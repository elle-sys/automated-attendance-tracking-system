import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  SafeAreaView,
  Dimensions,
  Image,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
  TouchableWithoutFeedback,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import CustomAlert from '../../components/CustomAlert';
import { ADMIN_CREDENTIALS } from '../../config/auth';
import { useAuth } from '../../context/AuthContext';

const { width, height } = Dimensions.get('window');

const AdminLogin = () => {
  const navigation = useNavigation();
  const { loginAdmin } = useAuth();
  const [adminId, setAdminId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [alert, setAlert] = useState({ visible: false, type: '', message: '' });
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!adminId || !password) {
      setAlert({
        visible: true,
        type: 'error',
        message: 'Please fill in all fields',
      });
      return;
    }

    setIsLoading(true);

    if (adminId === ADMIN_CREDENTIALS.ADMIN_ID && password === ADMIN_CREDENTIALS.ADMIN_PASSWORD) {
      loginAdmin();
      setAlert({ visible: true, type: 'success', message: 'Login successful!' });
      setAdminId('');
      setPassword('');
      setTimeout(() => navigation.navigate('Dashboard'), 1000);
    } else {
      setAlert({ visible: true, type: 'error', message: 'Invalid admin credentials' });
    }

    setIsLoading(false);
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
              <Text style={styles.title}>Admin Login</Text>
              <Text style={styles.subtitle}>Please login with your admin credentials</Text>
            </View>

            {/* Login Form */}
            <View style={styles.form}>
              {/* Admin ID */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Admin ID</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your admin ID"
                  value={adminId}
                  onChangeText={setAdminId}
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
                  isLoading && styles.loginButtonDisabled,
                  pressed && styles.loginButtonPressed,
                ]}
                onPress={handleLogin}
                disabled={isLoading}
              >
                {isLoading ? (
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
    alignItems: 'center', // Center horizontally for web
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
    maxWidth: 400, // Limit width for web
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

export default AdminLogin;
