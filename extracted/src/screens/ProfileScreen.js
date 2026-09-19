import React from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import ScreenContainer from '../components/ScreenContainer';
import Card from '../components/Card';
import PrimaryButton from '../components/PrimaryButton';
import { colors } from '../theme/theme';
import { useAuth } from '../context/AuthContext';

export default function ProfileScreen({ navigation }) {
  const { user, logout, isImpersonating, exitImpersonation } = useAuth();

  const onLogout = () => {
    Alert.alert('خروج', 'مطمئنی می‌خوای از حساب خارج بشی؟', [
      { text: 'انصراف', style: 'cancel' },
      { text: 'خروج', style: 'destructive', onPress: logout },
    ]);
  };

  return (
    <ScreenContainer>
      <Text style={styles.title}>پروفایل من</Text>
      <Card style={{ marginTop: 16 }}>
        <Row label="نام" value={user?.name} />
        <Row label="ایمیل" value={user?.email} />
        <Row label="نقش" value={ROLE_LABEL[user?.role] || user?.role} />
        <Row label="سطح" value={user?.level || 'هنوز مشخص نشده'} />
        <Row label="ستاره‌ها" value={String(user?.stars ?? 0)} />
      </Card>

      {isImpersonating ? (
        <PrimaryButton title="بازگشت به حساب ادمین" onPress={exitImpersonation} style={{ marginTop: 20 }} />
      ) : (
        <>
          {user?.role === 'student' && (
            <PrimaryButton
              title="آزمون تعیین سطح"
              variant="outline"
              onPress={() => navigation.navigate('LevelTest')}
              style={{ marginTop: 20 }}
            />
          )}
          <PrimaryButton
            title="پشتیبانی"
            variant="outline"
            onPress={() => navigation.navigate('Support')}
            style={{ marginTop: 12 }}
          />
          <PrimaryButton title="خروج از حساب" onPress={onLogout} style={{ marginTop: 12, backgroundColor: colors.danger }} />
        </>
      )}
    </ScreenContainer>
  );
}

const ROLE_LABEL = { student: 'زبان‌آموز', teacher: 'مدرس', admin: 'ادمین' };

function Row({ label, value }) {
  return (
    <View style={styles.row}>
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 22, fontWeight: '800', color: colors.text, textAlign: 'right' },
  row: {
    flexDirection: 'row-reverse', justifyContent: 'space-between',
    paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: colors.border,
  },
  label: { color: colors.textMuted },
  value: { color: colors.text, fontWeight: '700' },
});
