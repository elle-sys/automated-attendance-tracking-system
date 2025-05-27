import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import StatisticsChart from '../../components/StatisticsChart';
import TrendChart from '../../components/TrendChart';
import { useAuth } from '../../context/AuthContext';
import { API_URL } from '../../config/api';
import { ADMIN_CREDENTIALS } from '../../config/auth';
import Courses from './Courses';
import Users from './Users';
import Ionicons from 'react-native-vector-icons/Ionicons';

const Dashboard = () => {
  const navigation = useNavigation();
  const { loginAdmin, logoutAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const [statistics, setStatistics] = useState({
    students: 0,
    instructors: 0,
    courses: 0,
  });

  const [trendData, setTrendData] = useState({
    labels: [],
    datasets: [{ data: [0] }],
  });

  useEffect(() => {
    loginAdmin();
    fetchStatistics();
    fetchTrendData();
  }, []);

  const fetchStatistics = async () => {
    try {
      const headers = {
        'Content-Type': 'application/json',
        'admin-id': ADMIN_CREDENTIALS.ADMIN_ID,
        'admin-password': ADMIN_CREDENTIALS.ADMIN_PASSWORD,
      };

      const [studentsRes, instructorsRes, coursesRes] = await Promise.all([
        fetch(`${API_URL}/api/students`, { headers }),
        fetch(`${API_URL}/api/instructors`, { headers }),
        fetch(`${API_URL}/api/courses`, { headers }),
      ]);

      const [students, instructors, courses] = await Promise.all([
        studentsRes.json(),
        instructorsRes.json(),
        coursesRes.json(),
      ]);

      setStatistics({
        students: Array.isArray(students) ? students.length : 0,
        instructors: Array.isArray(instructors) ? instructors.length : 0,
        courses: Array.isArray(courses) ? courses.length : 0,
      });
    } catch (error) {
      console.error('Error fetching statistics:', error);
    }
  };

  const fetchTrendData = async () => {
    try {
      const studentsRes = await fetch(`${API_URL}/api/students`, {
        headers: {
          'Content-Type': 'application/json',
          'admin-id': ADMIN_CREDENTIALS.ADMIN_ID,
          'admin-password': ADMIN_CREDENTIALS.ADMIN_PASSWORD,
        },
      });
      const students = await studentsRes.json();

      const last7Days = Array.from({ length: 7 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - i);
        return date;
      }).reverse();

      const counts = last7Days.map(date => {
        const dayStart = new Date(date.setHours(0, 0, 0, 0));
        const dayEnd = new Date(date.setHours(23, 59, 59, 999));
        return students.filter(student => {
          const createdAt = new Date(student.createdAt);
          return createdAt >= dayStart && createdAt <= dayEnd;
        }).length;
      });

      const labels = last7Days.map(date => {
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        return `${month}/${day}`;
      });

      setTrendData({
        labels,
        datasets: [
          {
            data: counts,
            color: (opacity = 1) => `rgba(76, 175, 80, ${opacity})`,
            strokeWidth: 2,
          },
        ],
      });
    } catch (error) {
      console.error('Error fetching trend data:', error);
      setTrendData({
        labels: [''],
        datasets: [{ data: [0] }],
      });
    }
  };

  const handleLogout = () => {
    logoutAdmin();
    navigation.replace('RoleSelection');
  };

  const handleStatPress = type => {
    if (type === 'students') setActiveTab('users');
    else if (type === 'courses') setActiveTab('courses');
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <ScrollView style={styles.dashboardContent}>
            <TrendChart
              data={trendData}
              title="New Accounts Created (Last 7 Days)"
            />
            <View style={styles.statsContainer}>
              <View style={styles.statsRow}>
                <TouchableOpacity
                  style={[styles.statCard, { backgroundColor: '#89e4f0' }]}
                  onPress={() => handleStatPress('students')}
                >
                  <Ionicons name="people-outline" size={28} color="#fff" />
                  <Text style={styles.statValue}>{statistics.students}</Text>
                  <Text style={styles.statLabel}>Total Students</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.statCard, { backgroundColor: '#89e4f0' }]}
                  onPress={() => handleStatPress('students')}
                >
                  <Ionicons name="school-outline" size={28} color="#fff" />
                  <Text style={styles.statValue}>{statistics.instructors}</Text>
                  <Text style={styles.statLabel}>Total Instructors</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.statsRow}>
                <TouchableOpacity
                  style={[styles.statCard, { backgroundColor: '#89e4f0' }]}
                  onPress={() => handleStatPress('courses')}
                >
                  <Ionicons name="book-outline" size={28} color="#fff" />
                  <Text style={styles.statValue}>{statistics.courses}</Text>
                  <Text style={styles.statLabel}>Total Courses</Text>
                </TouchableOpacity>
                <View style={[styles.statCard, { backgroundColor: '##89e4f0' }]}>
                  <Ionicons name="stats-chart" size={28} color="#fff" />
                  <Text style={styles.statValue}>
                    {((statistics.students / (statistics.courses || 1)) || 0).toFixed(1)}
                  </Text>
                  <Text style={styles.statLabel}>Students per Course</Text>
                </View>
              </View>
            </View>
          </ScrollView>
        );
      case 'users':
        return <Users onUpdate={() => { fetchStatistics(); fetchTrendData(); }} />;
      case 'courses':
        return <Courses onUpdate={fetchStatistics} />;
      default:
        return null;
    }
  };

  const sidebarWidth = sidebarCollapsed ? 45 : 150;

  return (
    <SafeAreaView style={styles.container}>
      {/* Sidebar */}
      <View style={[styles.sidebar, { width: sidebarWidth }]}>
        <TouchableOpacity onPress={() => setSidebarCollapsed(!sidebarCollapsed)} style={styles.sidebarToggle}>
          <Ionicons name="reorder-three-outline" size={28} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.sidebarItem} onPress={() => setActiveTab('dashboard')}>
          <Ionicons name="home-outline" size={24} color="#fff" />
          {!sidebarCollapsed && <Text style={styles.sidebarText}>Dashboard</Text>}
        </TouchableOpacity>
        <TouchableOpacity style={styles.sidebarItem} onPress={() => setActiveTab('users')}>
          <Ionicons name="people-outline" size={24} color="#fff" />
          {!sidebarCollapsed && <Text style={styles.sidebarText}>Users</Text>}
        </TouchableOpacity>
        <TouchableOpacity style={styles.sidebarItem} onPress={() => setActiveTab('courses')}>
          <Ionicons name="book-outline" size={24} color="#fff" />
          {!sidebarCollapsed && <Text style={styles.sidebarText}>Courses</Text>}
        </TouchableOpacity>

        {/* Logout button at the bottom */}
        <View style={styles.sidebarBottom}>
          <TouchableOpacity style={styles.sidebarItem} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={24} color="#fff" />
            {!sidebarCollapsed && <Text style={styles.sidebarText}>Logout</Text>}
          </TouchableOpacity>
        </View>
      </View>

      {/* Main Content */}
      <View style={styles.content}>{renderContent()}</View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#000',
  },
  sidebar: {
    backgroundColor: '#1c2a48',
    paddingTop: 50,
    paddingHorizontal: 10,
  },
  sidebarToggle: {
    alignItems: 'center',
    marginBottom: 50,
  },
  sidebarItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 10,
  },
  sidebarText: {
    color: '#fff',
    fontSize: 20,
  },
  sidebarBottom: {
    flex: 1,
    justifyContent: 'flex-end',
    marginTop: 'auto',
    marginBottom: 20,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingBottom: 0,
    marginTop: 30,
  },
  dashboardContent: {
    flex: 1,
  },
  statsContainer: {
    paddingVertical: 20,
    gap: 20,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
  },
  statCard: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    minHeight: 120,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 4.65,
    elevation: 6,
  },
  statValue: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.9,
  },
});

export default Dashboard;
