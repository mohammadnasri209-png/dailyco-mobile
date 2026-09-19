import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import ScreenContainer from '../components/ScreenContainer';
import Card from '../components/Card';
import PrimaryButton from '../components/PrimaryButton';
import { colors } from '../theme/theme';
import { AppAPI } from '../api/client';

// Simple swipeable flashcard flow through today's words.
export default function LessonScreen({ navigation }) {
  const [words, setWords] = useState(null);
  const [index, setIndex] = useState(0);
  const [showMeaning, setShowMeaning] = useState(false);

  useEffect(() => {
    AppAPI.lessonToday().then(d => setWords(d.words)).catch(() => setWords([]));
  }, []);

  if (words === null) {
    return (
      <ScreenContainer style={styles.center}>
        <ActivityIndicator color={colors.primary} size="large" />
      </ScreenContainer>
    );
  }

  if (words.length === 0) {
    return (
      <ScreenContainer style={styles.center}>
        <Text style={styles.doneText}>واژه‌ای برای امروز پیدا نشد 🙁</Text>
        <PrimaryButton title="بازگشت" onPress={() => navigation.goBack()} style={{ marginTop: 20 }} />
      </ScreenContainer>
    );
  }

  if (index >= words.length) {
    return (
      <ScreenContainer style={styles.center}>
        <Text style={styles.doneEmoji}>🎉</Text>
        <Text style={styles.doneText}>درس امروز تمام شد!</Text>
        <PrimaryButton title="بازگشت به خانه" onPress={() => navigation.goBack()} style={{ marginTop: 24 }} />
      </ScreenContainer>
    );
  }

  const word = words[index];
  const next = () => { setShowMeaning(false); setIndex(i => i + 1); };

  return (
    <ScreenContainer>
      <Text style={styles.progress}>{index + 1} / {words.length}</Text>
      <Card style={styles.wordCard}>
        <Text style={styles.word}>{word.word}</Text>
        <Text style={styles.example}>{word.example_en}</Text>
        {showMeaning && (
          <View style={styles.meaningBox}>
            <Text style={styles.meaning}>{word.meaning_fa}</Text>
            <Text style={styles.exampleFa}>{word.example_fa}</Text>
          </View>
        )}
      </Card>

      {!showMeaning ? (
        <PrimaryButton title="نمایش معنی" onPress={() => setShowMeaning(true)} style={{ marginTop: 24 }} />
      ) : (
        <PrimaryButton title={index + 1 === words.length ? 'پایان' : 'واژه بعدی'} onPress={next} style={{ marginTop: 24 }} />
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  center: { justifyContent: 'center', alignItems: 'center' },
  progress: { textAlign: 'center', color: colors.textMuted, marginBottom: 16, fontWeight: '600' },
  wordCard: { alignItems: 'center', paddingVertical: 40 },
  word: { fontSize: 32, fontWeight: '800', color: colors.primary },
  example: { fontSize: 15, color: colors.textMuted, marginTop: 10, textAlign: 'center' },
  meaningBox: { marginTop: 24, alignItems: 'center' },
  meaning: { fontSize: 22, fontWeight: '700', color: colors.text },
  exampleFa: { fontSize: 14, color: colors.textMuted, marginTop: 8, textAlign: 'center' },
  doneEmoji: { fontSize: 50 },
  doneText: { fontSize: 18, fontWeight: '700', color: colors.text, marginTop: 12 },
});
