import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, radius } from '../theme/theme';

export default function StreakBadge({ count = 0 }) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.emoji}>🔥</Text>
      <Text style={styles.count}>{count}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF1E6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: radius.pill,
    gap: 4,
  },
  emoji: { fontSize: 16 },
  count: { fontWeight: '800', color: colors.streak, fontSize: 15 },
});
