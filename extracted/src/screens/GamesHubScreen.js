import React from 'react';
import { Text, StyleSheet, ScrollView } from 'react-native';
import ScreenContainer from '../components/ScreenContainer';
import Card from '../components/Card';
import { colors } from '../theme/theme';

const GAMES = [
  {
    key: 'WordMatch',
    emoji: '🧠',
    title: 'حدس معنی کلمه',
    desc: 'یک کلمه انگلیسی می‌بینی، معنی درستش رو از بین ۴ گزینه پیدا کن.',
  },
  {
    key: 'SentenceScramble',
    emoji: '🧩',
    title: 'جمله‌ی به‌هم‌ریخته',
    desc: 'کلمه‌های پخش‌شده رو به ترتیب درست بچین تا جمله درست بشه.',
  },
];

export default function GamesHubScreen({ navigation }) {
  return (
    <ScreenContainer style={{ padding: 0 }}>
      <ScrollView contentContainerStyle={{ padding: 20, gap: 14 }}>
        <Text style={styles.title}>🎮 بازی‌ها</Text>
        {GAMES.map(g => (
          <Card key={g.key} style={styles.card}>
            <Text style={styles.emoji}>{g.emoji}</Text>
            <Text style={styles.gameTitle}>{g.title}</Text>
            <Text style={styles.gameDesc}>{g.desc}</Text>
            <Text style={styles.play} onPress={() => navigation.navigate(g.key)}>شروع بازی ←</Text>
          </Card>
        ))}
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 22, fontWeight: '800', color: colors.text, textAlign: 'right' },
  card: { alignItems: 'flex-end' },
  emoji: { fontSize: 30 },
  gameTitle: { fontSize: 17, fontWeight: '800', color: colors.text, marginTop: 8, textAlign: 'right' },
  gameDesc: { fontSize: 13, color: colors.textMuted, marginTop: 6, textAlign: 'right' },
  play: { color: colors.primary, fontWeight: '700', marginTop: 12 },
});
