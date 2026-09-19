import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import ScreenContainer from '../components/ScreenContainer';
import Card from '../components/Card';
import { colors } from '../theme/theme';
import { AppAPI } from '../api/client';

export default function LeaderboardScreen() {
  const [rows, setRows] = useState(null);

  useEffect(() => {
    AppAPI.leaderboard().then(d => setRows(d.leaderboard)).catch(() => setRows([]));
  }, []);

  if (rows === null) {
    return <ScreenContainer style={styles.center}><ActivityIndicator color={colors.primary} size="large" /></ScreenContainer>;
  }

  return (
    <ScreenContainer>
      <Text style={styles.title}>🏆 جدول امتیازات</Text>
      <FlatList
        data={rows}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={{ gap: 10, paddingTop: 10 }}
        renderItem={({ item, index }) => (
          <Card style={styles.row}>
            <Text style={styles.rank}>#{index + 1}</Text>
            <Text style={styles.name}>{item.name || 'کاربر'}</Text>
            <Text style={styles.stars}>⭐ {item.stars}</Text>
          </Card>
        )}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  center: { justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 22, fontWeight: '800', color: colors.text, textAlign: 'right' },
  row: { flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'space-between' },
  rank: { fontWeight: '800', color: colors.primary, width: 36 },
  name: { flex: 1, textAlign: 'right', color: colors.text, fontWeight: '600' },
  stars: { color: colors.accent, fontWeight: '700' },
});
