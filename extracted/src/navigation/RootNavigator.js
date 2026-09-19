import React from 'react';
import { ActivityIndicator, View, Text, Pressable, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import { useAuth } from '../context/AuthContext';
import { colors } from '../theme/theme';

import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen';
import SupportScreen from '../screens/SupportScreen';

import HomeScreen from '../screens/HomeScreen';
import LessonScreen from '../screens/LessonScreen';
import ReviewScreen from '../screens/ReviewScreen';
import LevelTestScreen from '../screens/LevelTestScreen';
import LeaderboardScreen from '../screens/LeaderboardScreen';
import ProfileScreen from '../screens/ProfileScreen';
import GamesHubScreen from '../screens/GamesHubScreen';
import WordMatchGameScreen from '../screens/WordMatchGameScreen';
import SentenceScrambleGameScreen from '../screens/SentenceScrambleGameScreen';

import TeacherHomeScreen from '../screens/TeacherHomeScreen';
import AdminHomeScreen from '../screens/AdminHomeScreen';
import AdminUsersScreen from '../screens/AdminUsersScreen';
import AdminContentScreen from '../screens/AdminContentScreen';
import AdminSupportScreen from '../screens/AdminSupportScreen';

const AuthStackNav = createNativeStackNavigator();
const HomeStackNav = createNativeStackNavigator();
const Tabs = createBottomTabNavigator();

// ------------------------- Auth (logged-out) ---------------------------
function AuthStack() {
  return (
    <AuthStackNav.Navigator screenOptions={{ headerShown: false }}>
      <AuthStackNav.Screen name="Login" component={LoginScreen} />
      <AuthStackNav.Screen name="Signup" component={SignupScreen} />
      <AuthStackNav.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
      <AuthStackNav.Screen name="Support" component={SupportScreen} options={{ headerShown: true, title: 'پشتیبانی' }} />
    </AuthStackNav.Navigator>
  );
}

// ------------------------- Student experience ---------------------------
function HomeStack() {
  return (
    <HomeStackNav.Navigator screenOptions={{ headerTitleAlign: 'center' }}>
      <HomeStackNav.Screen name="HomeMain" component={HomeScreen} options={{ headerShown: false }} />
      <HomeStackNav.Screen name="Lesson" component={LessonScreen} options={{ title: 'درس امروز' }} />
      <HomeStackNav.Screen name="Review" component={ReviewScreen} options={{ title: 'مرور واژه‌ها' }} />
      <HomeStackNav.Screen name="LevelTest" component={LevelTestScreen} options={{ title: 'آزمون تعیین سطح' }} />
    </HomeStackNav.Navigator>
  );
}

function GamesStack() {
  return (
    <HomeStackNav.Navigator screenOptions={{ headerTitleAlign: 'center' }}>
      <HomeStackNav.Screen name="GamesHub" component={GamesHubScreen} options={{ headerShown: false }} />
      <HomeStackNav.Screen name="WordMatch" component={WordMatchGameScreen} options={{ title: 'حدس معنی کلمه' }} />
      <HomeStackNav.Screen name="SentenceScramble" component={SentenceScrambleGameScreen} options={{ title: 'جمله‌ی به‌هم‌ریخته' }} />
    </HomeStackNav.Navigator>
  );
}

function ProfileStack() {
  return (
    <HomeStackNav.Navigator screenOptions={{ headerTitleAlign: 'center' }}>
      <HomeStackNav.Screen name="ProfileMain" component={ProfileScreen} options={{ headerShown: false }} />
      <HomeStackNav.Screen name="LevelTest" component={LevelTestScreen} options={{ title: 'آزمون تعیین سطح' }} />
      <HomeStackNav.Screen name="Support" component={SupportScreen} options={{ title: 'پشتیبانی' }} />
    </HomeStackNav.Navigator>
  );
}

function StudentTabs() {
  const iconFor = { 'خانه': 'home', 'بازی‌ها': 'game-controller', 'رتبه‌بندی': 'trophy', 'پروفایل': 'person-circle' };
  return (
    <Tabs.Navigator screenOptions={({ route }) => ({
      headerShown: false,
      tabBarActiveTintColor: colors.primary,
      tabBarInactiveTintColor: colors.textMuted,
      tabBarStyle: { height: 60, paddingBottom: 8, paddingTop: 6 },
      tabBarIcon: ({ color, size }) => <Ionicons name={iconFor[route.name] || 'ellipse'} size={size} color={color} />,
    })}>
      <Tabs.Screen name="خانه" component={HomeStack} />
      <Tabs.Screen name="بازی‌ها" component={GamesStack} />
      <Tabs.Screen name="رتبه‌بندی" component={LeaderboardScreen} />
      <Tabs.Screen name="پروفایل" component={ProfileStack} />
    </Tabs.Navigator>
  );
}

// ------------------------- Teacher experience ----------------------------
function TeacherProfileStack() {
  return (
    <HomeStackNav.Navigator screenOptions={{ headerTitleAlign: 'center' }}>
      <HomeStackNav.Screen name="ProfileMain" component={ProfileScreen} options={{ headerShown: false }} />
      <HomeStackNav.Screen name="Support" component={SupportScreen} options={{ title: 'پشتیبانی' }} />
    </HomeStackNav.Navigator>
  );
}

function TeacherTabs() {
  const iconFor = { 'زبان‌آموزها': 'people', 'پروفایل': 'person-circle' };
  return (
    <Tabs.Navigator screenOptions={({ route }) => ({
      headerShown: false,
      tabBarActiveTintColor: colors.primary,
      tabBarInactiveTintColor: colors.textMuted,
      tabBarIcon: ({ color, size }) => <Ionicons name={iconFor[route.name] || 'ellipse'} size={size} color={color} />,
    })}>
      <Tabs.Screen name="زبان‌آموزها" component={TeacherHomeScreen} />
      <Tabs.Screen name="پروفایل" component={TeacherProfileStack} />
    </Tabs.Navigator>
  );
}

// ------------------------- Admin experience ------------------------------
function AdminStack() {
  return (
    <HomeStackNav.Navigator screenOptions={{ headerTitleAlign: 'center' }}>
      <HomeStackNav.Screen name="AdminHomeMain" component={AdminHomeScreen} options={{ headerShown: false }} />
      <HomeStackNav.Screen name="AdminUsers" component={AdminUsersScreen} options={{ title: 'کاربران' }} />
      <HomeStackNav.Screen name="AdminContent" component={AdminContentScreen} options={{ title: 'متن‌های اپ' }} />
      <HomeStackNav.Screen name="AdminSupport" component={AdminSupportScreen} options={{ title: 'تیکت‌های پشتیبانی' }} />
    </HomeStackNav.Navigator>
  );
}

function AdminTabs() {
  const iconFor = { 'مدیریت': 'settings', 'پروفایل': 'person-circle' };
  return (
    <Tabs.Navigator screenOptions={({ route }) => ({
      headerShown: false,
      tabBarActiveTintColor: colors.primary,
      tabBarInactiveTintColor: colors.textMuted,
      tabBarIcon: ({ color, size }) => <Ionicons name={iconFor[route.name] || 'ellipse'} size={size} color={color} />,
    })}>
      <Tabs.Screen name="مدیریت" component={AdminStack} />
      <Tabs.Screen name="پروفایل" component={TeacherProfileStack} />
    </Tabs.Navigator>
  );
}

// ------------------------- Root ------------------------------------------
function ImpersonationBanner() {
  const { exitImpersonation, user } = useAuth();
  return (
    <Pressable onPress={exitImpersonation} style={styles.banner}>
      <Text style={styles.bannerText}>👑 تو داری به‌جای «{user?.name}» اپ رو می‌بینی — لمس کن تا برگردی</Text>
    </Pressable>
  );
}

export default function RootNavigator() {
  const { user, booting, isImpersonating } = useAuth();

  if (booting) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.bg }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  const MainByRole = !user ? null
    : user.role === 'admin' && !isImpersonating ? AdminTabs
    : user.role === 'teacher' && !isImpersonating ? TeacherTabs
    : StudentTabs;

  return (
    <NavigationContainer>
      {isImpersonating && <ImpersonationBanner />}
      {user ? <MainByRole /> : <AuthStack />}
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  banner: { backgroundColor: '#FFB020', paddingVertical: 8, paddingHorizontal: 14 },
  bannerText: { color: '#3A2400', fontWeight: '800', fontSize: 12, textAlign: 'center' },
});
