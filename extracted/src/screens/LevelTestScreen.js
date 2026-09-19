import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import ScreenContainer from '../components/ScreenContainer';
import Card from '../components/Card';
import PrimaryButton from '../components/PrimaryButton';
import { colors, radius } from '../theme/theme';
import { AppAPI } from '../api/client';
import { useAuth } from '../context/AuthContext';

export default function LevelTestScreen({ navigation }) {
  const { refreshUser } = useAuth();
  const [data, setData] = useState(null);
  const [flatQuestions, setFlatQuestions] = useState([]);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);

  useEffect(() => {
    AppAPI.levelTestQuestions().then(d => {
      setData(d);
      setFlatQuestions(Object.values(d).flat());
    });
  }, []);

  const choose = async (option) => {
    const q = flatQuestions[index];
    const updated = { ...answers, [q.id]: option };
    setAnswers(updated);
    if (index + 1 < flatQuestions.length) {
      setIndex(index + 1);
    } else {
      const res = await AppAPI.submitLevelTest(updated);
      setResult(res);
      await refreshUser();
    }
  };

  if (!data) {
    return <ScreenContainer style={styles.center}><ActivityIndicator color={colors.primary} size="large" /></ScreenContainer>;
  }

  if (result) {
    return (
      <ScreenContainer style={styles.center}>
        <Text style={styles.doneEmoji}>🏆</Text>
        <Text style={styles.resultLevel}>سطح شما: {result.level}</Text>
        <Text style={styles.resultDetail}>{result.correct} پاسخ درست از {result.total}</Text>
        <PrimaryButton title="بازگشت به خانه" onPress={() => navigation.goBack()} style={{ marginTop: 24 }} />
      </ScreenContainer>
    );
  }

  const q = flatQuestions[index];

  return (
    <ScreenContainer>
      <Text style={styles.progress}>سؤال {index + 1} از {flatQuestions.length}</Text>
      <ScrollView>
        <Card>
          <Text style={styles.question}>{q.question}</Text>
        </Card>
        <View style={{ marginTop: 16, gap: 10 }}>
          {q.options.map((opt) => (
            <Text key={opt} onPress={() => choose(opt)} style={styles.option}>{opt}</Text>
          ))}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  center: { justifyContent: 'center', alignItems: 'center' },
  progress: { textAlign: 'center', color: colors.textMuted, marginBottom: 16, fontWeight: '600' },
  question: { fontSize: 18, fontWeight: '700', color: colors.text, textAlign: 'right' },
  option: {
    backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border,
    borderRadius: radius.md, padding: 16, fontSize: 15, textAlign: 'right', color: colors.text,
  },
  doneEmoji: { fontSize: 50 },
  resultLevel: { fontSize: 26, fontWeight: '800', color: colors.primary, marginTop: 12 },
  resultDetail: { fontSize: 15, color: colors.textMuted, marginTop: 6 },
});
