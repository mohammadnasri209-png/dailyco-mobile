import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import ScreenContainer from '../components/ScreenContainer';
import Card from '../components/Card';
import { colors } from '../theme/theme';
import { TeacherAPI } from '../api/client';
import { useAuth } from '../context/AuthContext';

export default function TeacherHomeScreen() {
  const { user } = useAuth();
  const [students, setStudents] = useState(null);

  useFocusEffect(useCallback(() => {
    TeacherAPI.listStudents().then(setStudents).catch(() => setStudents([]));
  }, []));

  return (
    <ScreenContainer>
      <Text style={styles.title}>سلام {user?.name} 👋</Text>
      <Text style={styles.subtitle}>لیست زبان‌آموزها</Text>

      {students === null ? (
        <ActivityIndicator color={colors.primary} size="large" style={{ marginTop: 30 }} />
      ) : (
        <FlatList
          data={students}
          keyExtractor={s => String(s.id)}
          contentContainerStyle={{ gap: 10, paddingTop: 14, paddingBottom: 30 }}
          ListEmptyComponent={<Text style={styles.empty}>هنوز زبان‌آموزی ثبت‌نام نکرده.</Text>}
          renderItem={({ item }) => (
            <Card style={styles.row}>
              <View>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.email}>{item.email}</Text>
              </View>
              <View style={{ alignItems: 'flex-start' }}>
                <Text style={styles.level}>{item.level || '—'}</Text>
                <Text style={styles.stars}>⭐ {item.stars} · 🔥 {item.streak_count}</Text>
              </View>
            </Card>
          )}
        />
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 22, fontWeight: '800', color: colors.text, textAlign: 'right' },
  subtitle: { fontSize: 14, color: colors.textMuted, textAlign: 'right', marginTop: 4 },
  row: { flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'center' },
  name: { fontWeight: '800', color: colors.text, textAlign: 'right' },
  email: { fontSize: 12, color: colors.textMuted, textAlign: 'right', marginTop: 2 },
  level: { fontWeight: '700', color: colors.primary },
  stars: { fontSize: 12, color: colors.textMuted, marginTop: 4 },
  empty: { textAlign: 'center', color: colors.textMuted, marginTop: 30 },
});
