import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import TrendChart from '../../components/TrendChart';
import InstructorCourses from './InstructorCourses';
import { Ionicons } from '@expo/vector-icons';
import { API_URL } from '../../config/api';

const InstructorDashboard = () => {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState('dashboard');

  const [totalCourses, setTotalCourses] = useState(0);
  const [totalStudents, setTotalStudents] = useState(0);
  const [activeClasses, setActiveClasses] = useState(0);

  useEffect(() => {
    fetchCourses();
    fetchStudents();
    fetchActiveClasses();
  }, []);

  const fetchCourses = async () => {
    try {
      const res = await fetch(`${API_URL}/api/courses`);
      const data = await res.json();
      setTotalCourses(data.length);
    } catch (err) {
      console.error('Error fetching courses:', err);
    }
  };

  const fetchStudents = async () => {
    try {
      const res = await fetch(`${API_URL}/api/students`);
      const data = await res.json();
      setTotalStudents(data.length);
    } catch (err) {
      console.error('Error fetching students:', err);
    }
  };

  const fetchActiveClasses = async () => {
    try {
      const res = await fetch(`${API_URL}/api/sessions/active`);
      const data = await res.json();
      setActiveClasses(data.length);
    } catch (err) {
      console.error('Error fetching active classes:', err);
    }
  };

  const handleTabPress = (tabKey) => {
    setActiveTab(tabKey);
  };

  const renderContent = () => {
    if (activeTab === 'dashboard') {
      return (
        <ScrollView style={styles.content}>
          <TrendChart
            data={{
              labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
              datasets: [{ data: [75, 82, 88, 85, 90, 87, 85] }],
            }}
            title="Attendance Rate (Last 7 Days)"
          />
          <View style={styles.statsContainer}>
            {/* Students */}
            <View style={styles.statCard}>
              <Ionicons name="people-outline" size={30} color="#FFD700" />
              <Text style={styles.statValue}>{totalStudents}</Text>
              <Text style={styles.statLabel}>Total Students</Text>
            </View>
            {/* Courses */}
            <View style={styles.statCard}>
              <Ionicons name="book-outline" size={30} color="#00BCD4" />
              <Text style={styles.statValue}>{totalCourses}</Text>
              <Text style={styles.statLabel}>Total Courses</Text>
            </View>
            {/* Active Classes */}
            <View style={styles.statCard}>
              <Ionicons name="school-outline" size={30} color="#4CAF50" />
              <Text style={styles.statValue}>{activeClasses}</Text>
              <Text style={styles.statLabel}>Active Classes</Text>
            </View>
          </View>
        </ScrollView>
      );
    } else if (activeTab === 'courses') {
      return <InstructorCourses />;
    }

    return null;
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.sidebar}>
        <TouchableOpacity
          style={[
            styles.sidebarItem,
            activeTab === 'dashboard' && styles.activeSidebarItem,
          ]}
          onPress={() => handleTabPress('dashboard')}
        >
          <Ionicons name="grid-outline" size={22} color="#fff" />
          <Text style={styles.sidebarItemText}>Dashboard</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.sidebarItem,
            activeTab === 'courses' && styles.activeSidebarItem,
          ]}
          onPress={() => handleTabPress('courses')}
        >
          <Ionicons name="book-outline" size={22} color="#fff" />
          <Text style={styles.sidebarItemText}>Courses</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.sidebarItem}
          onPress={() => navigation.replace('RoleSelection')}
        >
          <Ionicons name="log-out-outline" size={22} color="#fff" />
          <Text style={styles.sidebarItemText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.mainContent}>{renderContent()}</View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#f0f4f8',
  },
  sidebar: {
    width: 100,
    backgroundColor: '#165973',
    paddingTop: 30,
    alignItems: 'center',
  },
  sidebarItem: {
    alignItems: 'center',
    marginVertical: 20,
  },
  activeSidebarItem: {
    backgroundColor: '#0E3B4A',
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  sidebarItemText: {
    color: '#fff',
    fontSize: 12,
    marginTop: 5,
    textAlign: 'center',
  },
  mainContent: {
    flex: 1,
    padding: 16,
  },
  content: {
    flex: 1,
  },
  statsContainer: {
    marginTop: 20,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  statCard: {
    width: '48%',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  statValue: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 10,
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
});

export default InstructorDashboard;
