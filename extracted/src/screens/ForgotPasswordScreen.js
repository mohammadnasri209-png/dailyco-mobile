import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert } from 'react-native';
import ScreenContainer from '../components/ScreenContainer';
import PrimaryButton from '../components/PrimaryButton';
import { colors } from '../theme/theme';
import { AuthAPI } from '../api/client';

// Two-step recovery: (1) request a 6-digit code by email, (2) enter the
// code + a new password. Kept as one screen with a step flag so the user
// never loses their email/code between steps.
export default function ForgotPasswordScreen({ navigation }) {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [devToken, setDevToken] = useState(null);

  const requestCode = async () => {
    if (!email) return Alert.alert('خطا', 'ایمیلت رو وارد کن.');
    setLoading(true);
    try {
      const res = await AuthAPI.forgotPassword(email.trim());
      if (res.devToken) setDevToken(res.devToken); // only present when SMTP isn't configured yet
      setStep(2);
    } catch (e) {
      Alert.alert('خطا', 'مشکلی پیش اومد، دوباره امتحان کن.');
    } finally {
      setLoading(false);
    }
  };

  const submitReset = async () => {
    if (!token || !newPassword) return Alert.alert('خطا', 'کد و رمز جدید رو وارد کن.');
    if (newPassword.length < 6) return Alert.alert('خطا', 'رمز عبور باید حداقل ۶ کاراکتر باشد.');
    setLoading(true);
    try {
      await AuthAPI.resetPassword(email.trim(), token.trim(), newPassword);
      Alert.alert('انجام شد', 'رمز عبورت عوض شد، حالا وارد شو.', [
        { text: 'باشه', onPress: () => navigation.navigate('Login') },
      ]);
    } catch (e) {
      Alert.alert('خطا', 'کد اشتباهه یا منقضی شده.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenContainer>
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <Text style={styles.title}>بازیابی رمز عبور</Text>

        {step === 1 ? (
          <>
            <Text style={styles.desc}>ایمیلت رو وارد کن تا یک کد ۶ رقمی برات بفرستیم.</Text>
            <TextInput
              style={styles.input}
              placeholder="ایمیل"
              placeholderTextColor={colors.textMuted}
              autoCapitalize="none"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
            />
            <PrimaryButton title="ارسال کد" onPress={requestCode} loading={loading} style={{ marginTop: 8 }} />
          </>
        ) : (
          <>
            <Text style={styles.desc}>کد ارسال‌شده به {email} رو وارد کن.</Text>
            {devToken && (
              <Text style={styles.devHint}>(حالت تست — کد: {devToken})</Text>
            )}
            <TextInput
              style={styles.input}
              placeholder="کد ۶ رقمی"
              placeholderTextColor={colors.textMuted}
              keyboardType="number-pad"
              value={token}
              onChangeText={setToken}
            />
            <TextInput
              style={styles.input}
              placeholder="رمز عبور جدید"
              placeholderTextColor={colors.textMuted}
              secureTextEntry
              value={newPassword}
              onChangeText={setNewPassword}
            />
            <PrimaryButton title="تغییر رمز عبور" onPress={submitReset} loading={loading} style={{ marginTop: 8 }} />
          </>
        )}

        <PrimaryButton title="بازگشت به ورود" variant="outline" onPress={() => navigation.navigate('Login')} style={{ marginTop: 12 }} />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 24, fontWeight: '800', color: colors.text, textAlign: 'center', marginBottom: 10 },
  desc: { fontSize: 14, color: colors.textMuted, textAlign: 'center', marginBottom: 24 },
  devHint: { fontSize: 12, color: colors.accent, textAlign: 'center', marginBottom: 10, fontWeight: '700' },
  input: {
    backgroundColor: colors.card, borderRadius: 14, padding: 16, fontSize: 16, marginBottom: 14,
    borderWidth: 1, borderColor: colors.border, textAlign: 'right',
  },
});
