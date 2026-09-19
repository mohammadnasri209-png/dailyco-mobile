import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import ScreenContainer from '../components/ScreenContainer';
import Card from '../components/Card';
import StreakBadge from '../components/StreakBadge';
import { colors, radius } from '../theme/theme';
import { useAuth } from '../context/AuthContext';
import { useContent } from '../context/ContentContext';
import { AppAPI } from '../api/client';

export default function HomeScreen({ navigation }) {
  const { user } = useAuth();
  const { get } = useContent();
  const [profile, setProfile] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    try {
      const p = await AppAPI.profile();
      setProfile(p);
    } catch (e) {
      // silently fall back to whatever we already have
    }
  }, []);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  const onRefresh = async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  };

  const displayName = profile?.name || user?.name || '';

  return (
    <ScreenContainer style={{ padding: 0 }}>
      <ScrollView
        contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <LinearGradient
          colors={[colors.primary, colors.primaryDark]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.headerGradient}
        >
          <View style={styles.headerRow}>
            <View>
              <Text style={styles.hello}>{get('home.welcome_prefix')} {displayName} 👋</Text>
              <Text style={styles.level}>سطح فعلی: {profile?.level || 'نامشخص'}</Text>
            </View>
            <StreakBadge count={profile?.streak_count || 0} />
          </View>
        </LinearGradient>

        <Card style={{ marginTop: 20 }}>
          <Text style={styles.cardTitle}>📚 درس امروز</Text>
          <Text style={styles.cardDesc}>۵ واژه جدید متناسب با سطح شما آماده است.</Text>
          <StatRow onPress={() => navigation.navigate('Lesson')} label="شروع درس" />
        </Card>

        <Card style={{ marginTop: 14 }}>
          <Text style={styles.cardTitle}>🔁 مرور واژه‌ها</Text>
          <Text style={styles.cardDesc}>واژه‌هایی که باید امروز مرور کنی.</Text>
          <StatRow onPress={() => navigation.navigate('Review')} label="مرور کن" />
        </Card>

        <Card style={{ marginTop: 14 }}>
          <Text style={styles.cardTitle}>🎮 بازی و تمرین</Text>
          <Text style={styles.cardDesc}>با بازی، لغت‌ها رو بهتر تو ذهنت بمون.</Text>
          <StatRow onPress={() => navigation.getParent()?.navigate('بازی‌ها')} label="برو به بازی‌ها" />
        </Card>

        <View style={styles.statsRow}>
          <Card style={styles.statCard}>
            <Text style={styles.statValue}>{profile?.mastered_words ?? '—'}</Text>
            <Text style={styles.statLabel}>واژه یاد گرفته‌شده</Text>
          </Card>
          <Card style={styles.statCard}>
            <Text style={styles.statValue}>{profile?.stars ?? '—'}</Text>
            <Text style={styles.statLabel}>ستاره</Text>
          </Card>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

function StatRow({ onPress, label }) {
  return (
    <Text onPress={onPress} style={styles.linkText}>
      {label} ←
    </Text>
  );
}

const styles = StyleSheet.create({
  headerGradient: { borderRadius: radius.lg, padding: 20 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  hello: { fontSize: 22, fontWeight: '800', color: '#fff', textAlign: 'right' },
  level: { fontSize: 14, color: 'rgba(255,255,255,0.85)', marginTop: 4, textAlign: 'right' },
  cardTitle: { fontSize: 17, fontWeight: '700', color: colors.text, textAlign: 'right' },
  cardDesc: { fontSize: 13, color: colors.textMuted, marginTop: 6, textAlign: 'right' },
  linkText: { color: colors.primary, fontWeight: '700', marginTop: 12, textAlign: 'right' },
  statsRow: { flexDirection: 'row', gap: 12, marginTop: 14 },
  statCard: { flex: 1, alignItems: 'center', paddingVertical: 20 },
  statValue: { fontSize: 24, fontWeight: '800', color: colors.primary },
  statLabel: { fontSize: 12, color: colors.textMuted, marginTop: 4 },
});
