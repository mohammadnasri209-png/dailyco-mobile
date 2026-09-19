import React from 'react';
import { Text, StyleSheet, ScrollView } from 'react-native';
import ScreenContainer from '../components/ScreenContainer';
import Card from '../components/Card';
import { colors } from '../theme/theme';
import { useAuth } from '../context/AuthContext';

const MENU = [
  { key: 'AdminUsers', emoji: '👥', title: 'کاربران', desc: 'جست‌وجو، تغییر نقش، ورود به‌جای هر کاربر' },
  { key: 'AdminContent', emoji: '📝', title: 'متن‌های اپ', desc: 'ویرایش هر متنی که تو اپ دیده می‌شه' },
  { key: 'AdminSupport', emoji: '🎧', title: 'تیکت‌های پشتیبانی', desc: 'مشاهده و پاسخ به درخواست‌های کاربران' },
];

export default function AdminHomeScreen({ navigation }) {
  const { user } = useAuth();
  return (
    <ScreenContainer style={{ padding: 0 }}>
      <ScrollView contentContainerStyle={{ padding: 20, gap: 14 }}>
        <Text style={styles.title}>پنل مدیریت 🛠</Text>
        <Text style={styles.subtitle}>خوش اومدی {user?.name}</Text>
        {MENU.map(item => (
          <Card key={item.key} style={styles.card}>
            <Text style={styles.emoji}>{item.emoji}</Text>
            <Text style={styles.cardTitle}>{item.title}</Text>
            <Text style={styles.cardDesc}>{item.desc}</Text>
            <Text style={styles.go} onPress={() => navigation.navigate(item.key)}>باز کن ←</Text>
          </Card>
        ))}
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 22, fontWeight: '800', color: colors.text, textAlign: 'right' },
  subtitle: { fontSize: 13, color: colors.textMuted, textAlign: 'right', marginTop: -8 },
  card: { alignItems: 'flex-end' },
  emoji: { fontSize: 28 },
  cardTitle: { fontSize: 16, fontWeight: '800', color: colors.text, marginTop: 6, textAlign: 'right' },
  cardDesc: { fontSize: 13, color: colors.textMuted, marginTop: 4, textAlign: 'right' },
  go: { color: colors.primary, fontWeight: '700', marginTop: 10 },
});
