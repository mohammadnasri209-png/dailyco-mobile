import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert } from 'react-native';
import ScreenContainer from '../components/ScreenContainer';
import PrimaryButton from '../components/PrimaryButton';
import { colors } from '../theme/theme';
import { useAuth } from '../context/AuthContext';

export default function SignupScreen({ navigation }) {
  const { signup } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async () => {
    if (!name || !email || !password) return Alert.alert('خطا', 'همه فیلدها را پر کنید.');
    if (password.length < 6) return Alert.alert('خطا', 'رمز عبور باید حداقل ۶ کاراکتر باشد.');
    setLoading(true);
    try {
      await signup(name.trim(), email.trim(), password);
    } catch (e) {
      const msg = e?.response?.data?.error === 'email_taken' ? 'این ایمیل قبلاً ثبت شده.' : 'خطا در ساخت حساب.';
      Alert.alert('ثبت‌نام ناموفق', msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenContainer>
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <Text style={styles.title}>ساخت حساب کاربری</Text>
        <TextInput style={styles.input} placeholder="نام" placeholderTextColor={colors.textMuted} value={name} onChangeText={setName} />
        <TextInput
          style={styles.input}
          placeholder="ایمیل"
          placeholderTextColor={colors.textMuted}
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="رمز عبور (حداقل ۶ کاراکتر)"
          placeholderTextColor={colors.textMuted}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        <PrimaryButton title="ثبت‌نام" onPress={onSubmit} loading={loading} style={{ marginTop: 8 }} />
        <PrimaryButton title="بازگشت به ورود" variant="outline" onPress={() => navigation.goBack()} style={{ marginTop: 12 }} />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 24, fontWeight: '800', color: colors.text, textAlign: 'center', marginBottom: 30 },
  input: {
    backgroundColor: colors.card,
    borderRadius: 14,
    padding: 16,
    fontSize: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: colors.border,
    textAlign: 'right',
  },
});
