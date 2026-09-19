import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Pressable } from 'react-native';
import ScreenContainer from '../components/ScreenContainer';
import Card from '../components/Card';
import PrimaryButton from '../components/PrimaryButton';
import { colors, radius } from '../theme/theme';
import { AppAPI } from '../api/client';

export default function SentenceScrambleGameScreen({ navigation }) {
  const [rounds, setRounds] = useState(null);
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [pool, setPool] = useState([]);
  const [chosen, setChosen] = useState([]);
  const [feedback, setFeedback] = useState(null); // 'correct' | 'wrong' | null

  useEffect(() => {
    AppAPI.scrambleStart().then(d => {
      setRounds(d.rounds);
      if (d.rounds[0]) setPool(d.rounds[0].scrambled.map((w, i) => ({ id: i, word: w })));
    }).catch(() => setRounds([]));
  }, []);

  const pick = (item) => {
    if (feedback) return;
    setPool(p => p.filter(x => x.id !== item.id));
    setChosen(c => [...c, item]);
  };

  const unpick = (item) => {
    if (feedback) return;
    setChosen(c => c.filter(x => x.id !== item.id));
    setPool(p => [...p, item]);
  };

  const check = async () => {
    try {
      const res = await AppAPI.scrambleAnswer(chosen.map(c => c.word));
      if (res.correct) setScore(s => s + 1);
      setFeedback(res.correct ? 'correct' : 'wrong');
    } catch (e) {
      setFeedback('wrong');
    }
  };

  const next = () => {
    const nextIndex = index + 1;
    setFeedback(null);
    setChosen([]);
    if (rounds[nextIndex]) {
      setPool(rounds[nextIndex].scrambled.map((w, i) => ({ id: i, word: w })));
    }
    setIndex(nextIndex);
  };

  if (rounds === null) {
    return <ScreenContainer style={styles.center}><ActivityIndicator size="large" color={colors.primary} /></ScreenContainer>;
  }
  if (rounds.length === 0) {
    return (
      <ScreenContainer style={styles.center}>
        <Text style={styles.doneText}>فعلاً جمله‌ی کافی نداریم 🙁</Text>
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

  return (
    <ScreenContainer>
      <Text style={styles.progress}>{index + 1} / {rounds.length} · ⭐ {score}</Text>

      <Card style={styles.answerBox}>
        <View style={styles.chipsRow}>
          {chosen.length === 0 && <Text style={styles.placeholder}>کلمه‌ها رو از پایین بچین اینجا</Text>}
          {chosen.map(item => (
            <Pressable key={item.id} onPress={() => unpick(item)} style={[styles.chip, styles.chipChosen]}>
              <Text style={styles.chipText}>{item.word}</Text>
            </Pressable>
          ))}
        </View>
      </Card>

      <View style={[styles.chipsRow, { marginTop: 20 }]}>
        {pool.map(item => (
          <Pressable key={item.id} onPress={() => pick(item)} style={styles.chip}>
            <Text style={styles.chipText}>{item.word}</Text>
          </Pressable>
        ))}
      </View>

      {feedback && (
        <Text style={[styles.feedbackText, feedback === 'correct' ? styles.feedbackOk : styles.feedbackBad]}>
          {feedback === 'correct' ? '✅ درست بود!' : '❌ اشتباه بود.'}
        </Text>
      )}

      {!feedback ? (
        <PrimaryButton title="بررسی" onPress={check} disabled={pool.length > 0} style={{ marginTop: 24 }} />
      ) : (
        <PrimaryButton title={index + 1 === rounds.length ? 'پایان' : 'جمله بعدی'} onPress={next} style={{ marginTop: 24 }} />
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  center: { justifyContent: 'center', alignItems: 'center' },
  progress: { textAlign: 'center', color: colors.textMuted, marginBottom: 16, fontWeight: '700' },
  answerBox: { minHeight: 90, justifyContent: 'center' },
  chipsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, justifyContent: 'flex-end' },
  placeholder: { color: colors.textMuted, fontSize: 13 },
  chip: {
    backgroundColor: colors.card, borderWidth: 1.5, borderColor: colors.border,
    borderRadius: radius.pill, paddingHorizontal: 14, paddingVertical: 10,
  },
  chipChosen: { backgroundColor: colors.primarySoft, borderColor: colors.primary },
  chipText: { fontSize: 14, fontWeight: '700', color: colors.text },
  feedbackText: { textAlign: 'center', fontWeight: '800', fontSize: 16, marginTop: 20 },
  feedbackOk: { color: colors.success },
  feedbackBad: { color: colors.danger },
  doneEmoji: { fontSize: 50 },
  doneText: { fontSize: 18, fontWeight: '700', color: colors.text, marginTop: 12, textAlign: 'center' },
});
