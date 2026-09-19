import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Pressable } from 'react-native';
import ScreenContainer from '../components/ScreenContainer';
import Card from '../components/Card';
import PrimaryButton from '../components/PrimaryButton';
import { colors, radius } from '../theme/theme';
import { AppAPI } from '../api/client';
import BadgeToast from '../components/BadgeToast';

export default function WordMatchGameScreen({ navigation }) {
  const [rounds, setRounds] = useState(null);
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState(null); // { chosen, correctAnswer, correct }
  const [busy, setBusy] = useState(false);
  const [badgeQueue, setBadgeQueue] = useState([]);

  useEffect(() => {
    AppAPI.wordMatchStart().then(d => setRounds(d.rounds)).catch(() => setRounds([]));
  }, []);

  const choose = async (option) => {
    if (busy || feedback) return;
    setBusy(true);
    const round = rounds[index];
    try {
      const res = await AppAPI.wordMatchAnswer(round.word, option);
      if (res.correct) setScore(s => s + 1);
      setFeedback({ chosen: option, ...res });
      if (res.newBadges && res.newBadges.length) setBadgeQueue(q => [...q, ...res.newBadges]);
    } catch (e) {
      setFeedback({ chosen: option, correct: false, correctAnswer: '؟' });
    } finally {
      setBusy(false);
    }
  };

  const next = () => {
    setFeedback(null);
    setIndex(i => i + 1);
  };

  if (rounds === null) {
    return <ScreenContainer style={styles.center}><ActivityIndicator size="large" color={colors.primary} /></ScreenContainer>;
  }
  if (rounds.length === 0) {
    return (
      <ScreenContainer style={styles.center}>
        <Text style={styles.doneText}>فعلاً کلمه‌ی کافی برای این بازی نداری 🙁</Text>
        <PrimaryButton title="بازگشت" onPress={() => navigation.goBack()} style={{ marginTop: 20 }} />
      </ScreenContainer>
    );
  }
  if (index >= rounds.length) {
    return (
      <ScreenContainer style={styles.center}>
        <Text style={styles.doneEmoji}>🏁</Text>
        <Text style={styles.doneText}>{score} از {rounds.length} درست بود!</Text>
        <PrimaryButton title="بازگشت به بازی‌ها" onPress={() => navigation.goBack()} style={{ marginTop: 24 }} />
      </ScreenContainer>
    );
  }

  const round = rounds[index];

  return (
    <ScreenContainer>
      <Text style={styles.progress}>{index + 1} / {rounds.length} · ⭐ {score}</Text>
      <Card style={styles.wordCard}>
        <Text style={styles.word}>{round.word}</Text>
        <Text style={styles.example}>{round.example_en}</Text>
      </Card>

      <View style={{ marginTop: 20, gap: 10 }}>
        {round.options.map(opt => {
          let optionStyle = styles.option;
          if (feedback) {
            if (opt === feedback.correctAnswer) optionStyle = [styles.option, styles.optionCorrect];
            else if (opt === feedback.chosen) optionStyle = [styles.option, styles.optionWrong];
          }
          return (
            <Pressable key={opt} onPress={() => choose(opt)} style={optionStyle}>
              <Text style={styles.optionText}>{opt}</Text>
            </Pressable>
          );
        })}
      </View>

      {feedback && (
        <PrimaryButton
          title={index + 1 === rounds.length ? 'پایان' : 'بعدی'}
          onPress={next}
          style={{ marginTop: 20 }}
        />
      )}
      {badgeQueue.length > 0 && (
        <BadgeToast badge={badgeQueue[0]} onHide={() => setBadgeQueue(q => q.slice(1))} />
      )}
      </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  center: { justifyContent: 'center', alignItems: 'center' },
  progress: { textAlign: 'center', color: colors.textMuted, marginBottom: 16, fontWeight: '700' },
  wordCard: { alignItems: 'center', paddingVertical: 30 },
  word: { fontSize: 28, fontWeight: '800', color: colors.primary },
  example: { fontSize: 14, color: colors.textMuted, marginTop: 8, textAlign: 'center' },
  option: {
    backgroundColor: colors.card, borderWidth: 1.5, borderColor: colors.border,
    borderRadius: radius.md, padding: 16,
  },
  optionCorrect: { borderColor: colors.success, backgroundColor: '#EAFBF0' },
  optionWrong: { borderColor: colors.danger, backgroundColor: '#FDEDED' },
  optionText: { fontSize: 15, textAlign: 'right', color: colors.text, fontWeight: '600' },
  doneEmoji: { fontSize: 50 },
  doneText: { fontSize: 18, fontWeight: '700', color: colors.text, marginTop: 12, textAlign: 'center' },
});
