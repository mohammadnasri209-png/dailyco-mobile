import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import ScreenContainer from '../components/ScreenContainer';
import Card from '../components/Card';
import PrimaryButton from '../components/PrimaryButton';
import { colors } from '../theme/theme';
import { AppAPI } from '../api/client';

// SM-2 style review: user rates how well they remembered each due word.
export default function ReviewScreen({ navigation }) {
  const [words, setWords] = useState(null);
  const [index, setIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);

  useEffect(() => {
    AppAPI.reviewDue().then(d => setWords(d.words)).catch(() => setWords([]));
  }, []);

  const rate = async (quality) => {
    const word = words[index];
    try {
      await AppAPI.submitReview(word.word, quality);
    } catch (e) {}
    setShowAnswer(false);
    setIndex(i => i + 1);
  };

  if (words === null) {
    return <ScreenContainer style={styles.center}><ActivityIndicator color={colors.primary} size="large" /></ScreenContainer>;
  }

  if (words.length === 0 || index >= words.length) {
    return (
      <ScreenContainer style={styles.center}>
        <Text style={styles.doneEmoji}>✅</Text>
        <Text style={styles.doneText}>{words.length === 0 ? 'چیزی برای مرور نداری' : 'مرور امروز تمام شد!'}</Text>
        <PrimaryButton title="بازگشت به خانه" onPress={() => navigation.goBack()} style={{ marginTop: 24 }} />
      </ScreenContainer>
    );
  }

  const word = words[index];

  return (
    <ScreenContainer>
      <Text style={styles.progress}>{index + 1} / {words.length}</Text>
      <Card style={styles.wordCard}>
        <Text style={styles.word}>{word.word}</Text>
        {showAnswer && <Text style={styles.meaning}>{word.meaning_fa}</Text>}
      </Card>

      {!showAnswer ? (
        <PrimaryButton title="نمایش معنی" onPress={() => setShowAnswer(true)} style={{ marginTop: 24 }} />
      ) : (
        <View style={styles.ratingRow}>
          <RatingButton label="سخت بود" color={colors.danger} onPress={() => rate(2)} />
          <RatingButton label="خوب بود" color={colors.accent} onPress={() => rate(4)} />
          <RatingButton label="آسون بود" color={colors.success} onPress={() => rate(5)} />
        </View>
      )}
    </ScreenContainer>
  );
}

function RatingButton({ label, color, onPress }) {
  return (
    <Text onPress={onPress} style={[styles.ratingBtn, { color, borderColor: color }]}>
      {label}
    </Text>
  );
}

const styles = StyleSheet.create({
  center: { justifyContent: 'center', alignItems: 'center' },
  progress: { textAlign: 'center', color: colors.textMuted, marginBottom: 16, fontWeight: '600' },
  wordCard: { alignItems: 'center', paddingVertical: 50 },
  word: { fontSize: 32, fontWeight: '800', color: colors.primary },
  meaning: { fontSize: 22, fontWeight: '700', color: colors.text, marginTop: 16 },
  ratingRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 24, gap: 10 },
  ratingBtn: {
    flex: 1, textAlign: 'center', paddingVertical: 14, borderRadius: 14,
    borderWidth: 1.5, fontWeight: '700', fontSize: 13,
  },
  doneEmoji: { fontSize: 50 },
  doneText: { fontSize: 18, fontWeight: '700', color: colors.text, marginTop: 12 },
});
