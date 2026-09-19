import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, Pressable, KeyboardAvoidingView, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import PrimaryButton from '../components/PrimaryButton';
import { colors, radius } from '../theme/theme';
import { useAuth } from '../context/AuthContext';
import { useContent } from '../context/ContentContext';

export default function LoginScreen({ navigation }) {
  const { login } = useAuth();
  const { get } = useContent();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const onSubmit = async () => {
    if (!email || !password) return Alert.alert('خطا', 'ایمیل و رمز عبور را وارد کنید.');
    setLoading(true);
    try {
      await login(email.trim(), password);
    } catch (e) {
      Alert.alert('ورود ناموفق', 'ایمیل یا رمز عبور اشتباه است.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient colors={[colors.primary, colors.primaryDark]} style={{ flex: 1 }}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <View style={styles.top}>
          <View style={styles.logoCircle}>
            <Text style={styles.logoEmoji}>🎓</Text>
          </View>
          <Text style={styles.logo}>{get('login.title')}</Text>
          <Text style={styles.subtitle}>{get('login.subtitle')}</Text>
        </View>

        <View style={styles.sheet}>
          <TextInput
            style={styles.input}
            placeholder="ایمیل"
            placeholderTextColor={colors.textMuted}
            autoCapitalize="none"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />
          <View style={styles.passwordRow}>
            <TextInput
              style={[styles.input, { flex: 1, marginBottom: 0 }]}
              placeholder="رمز عبور"
              placeholderTextColor={colors.textMuted}
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
            />
            <Pressable onPress={() => setShowPassword(s => !s)} style={styles.eyeBtn}>
              <Ionicons name={showPassword ? 'eye-off' : 'eye'} size={22} color={colors.textMuted} />
            </Pressable>
          </View>

          <Pressable onPress={() => navigation.navigate('ForgotPassword')} style={{ alignSelf: 'flex-end', marginTop: 10 }}>
            <Text style={styles.link}>رمز عبورت رو فراموش کردی؟</Text>
          </Pressable>

          <PrimaryButton title="ورود" onPress={onSubmit} loading={loading} style={{ marginTop: 20 }} />
          <PrimaryButton
            title="ساخت حساب جدید"
            variant="outline"
            onPress={() => navigation.navigate('Signup')}
            style={{ marginTop: 12 }}
          />

          <Pressable onPress={() => navigation.navigate('Support')} style={{ alignSelf: 'center', marginTop: 22 }}>
            <Text style={styles.supportLink}>نیاز به کمک داری؟ ارتباط با پشتیبانی</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  top: { alignItems: 'center', paddingTop: 70, paddingBottom: 30 },
  logoCircle: {
    width: 72, height: 72, borderRadius: 36, backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center', justifyContent: 'center', marginBottom: 14,
  },
  logoEmoji: { fontSize: 32 },
  logo: { fontSize: 30, fontWeight: '800', color: '#fff' },
  subtitle: { fontSize: 14, color: 'rgba(255,255,255,0.85)', marginTop: 6 },
  sheet: {
    flex: 1, backgroundColor: colors.bg, borderTopLeftRadius: 32, borderTopRightRadius: 32,
    padding: 24, paddingTop: 32,
  },
  input: {
    backgroundColor: colors.card, borderRadius: 14, padding: 16, fontSize: 16, marginBottom: 14,
    borderWidth: 1, borderColor: colors.border, textAlign: 'right',
  },
  passwordRow: { flexDirection: 'row-reverse', alignItems: 'center', gap: 8 },
  eyeBtn: { padding: 8 },
  link: { color: colors.primary, fontWeight: '700', fontSize: 13 },
  supportLink: { color: colors.textMuted, fontSize: 13, textDecorationLine: 'underline' },
});
