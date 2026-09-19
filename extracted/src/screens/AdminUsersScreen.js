import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, FlatList, Alert, Pressable, Modal } from 'react-native';
import ScreenContainer from '../components/ScreenContainer';
import Card from '../components/Card';
import PrimaryButton from '../components/PrimaryButton';
import { colors, radius } from '../theme/theme';
import { AdminAPI } from '../api/client';
import { useAuth } from '../context/AuthContext';

export default function AdminUsersScreen() {
  const { enterAsUser } = useAuth();
  const [query, setQuery] = useState('');
  const [users, setUsers] = useState([]);
  const [target, setTarget] = useState(null); // user object being impersonated
  const [accessCode, setAccessCode] = useState('');
  const [loading, setLoading] = useState(false);

  const search = async (q) => {
    try {
      const rows = await AdminAPI.listUsers(q);
      setUsers(rows);
    } catch (e) {}
  };

  useEffect(() => { search(''); }, []);

  const confirmImpersonate = async () => {
    if (!accessCode) return Alert.alert('خطا', 'کد ورود ادمین رو وارد کن.');
    setLoading(true);
    try {
      await enterAsUser(target.id, accessCode.trim());
      setTarget(null);
      setAccessCode('');
    } catch (e) {
      Alert.alert('ناموفق', 'کد اشتباهه یا کاربر پیدا نشد.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenContainer>
      <TextInput
        style={styles.search}
        placeholder="جست‌وجو با نام، ایمیل یا آیدی عددی"
        placeholderTextColor={colors.textMuted}
        value={query}
        onChangeText={(t) => { setQuery(t); search(t); }}
      />

      <FlatList
        data={users}
        keyExtractor={u => String(u.id)}
        contentContainerStyle={{ gap: 10, paddingTop: 14, paddingBottom: 30 }}
        renderItem={({ item }) => (
          <Card style={styles.row}>
            <View style={{ flex: 1 }}>
              <Text style={styles.name}>#{item.id} · {item.name} ({item.role})</Text>
              <Text style={styles.email}>{item.email}</Text>
            </View>
            <Pressable onPress={() => setTarget(item)} style={styles.enterBtn}>
              <Text style={styles.enterBtnText}>ورود</Text>
            </Pressable>
          </Card>
        )}
      />

      <Modal visible={Boolean(target)} transparent animationType="fade" onRequestClose={() => setTarget(null)}>
        <View style={styles.modalBg}>
          <Card style={styles.modalCard}>
            <Text style={styles.modalTitle}>ورود به پروفایل «{target?.name}»</Text>
            <Text style={styles.modalDesc}>برای تأیید، کد دسترسی مخصوص ادمین رو وارد کن.</Text>
            <TextInput
              style={styles.codeInput}
              placeholder="کد دسترسی ادمین"
              placeholderTextColor={colors.textMuted}
              secureTextEntry
              value={accessCode}
              onChangeText={setAccessCode}
            />
            <PrimaryButton title="تأیید و ورود" onPress={confirmImpersonate} loading={loading} />
            <PrimaryButton title="انصراف" variant="outline" onPress={() => { setTarget(null); setAccessCode(''); }} style={{ marginTop: 10 }} />
          </Card>
        </View>
      </Modal>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  search: {
    backgroundColor: colors.card, borderRadius: 14, padding: 14, fontSize: 15,
    borderWidth: 1, borderColor: colors.border, textAlign: 'right',
  },
  row: { flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'space-between' },
  name: { fontWeight: '800', color: colors.text, textAlign: 'right' },
  email: { fontSize: 12, color: colors.textMuted, textAlign: 'right', marginTop: 2 },
  enterBtn: { backgroundColor: colors.primarySoft, paddingHorizontal: 14, paddingVertical: 8, borderRadius: radius.pill },
  enterBtnText: { color: colors.primary, fontWeight: '800', fontSize: 12 },
  modalBg: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', padding: 24 },
  modalCard: {},
  modalTitle: { fontSize: 17, fontWeight: '800', color: colors.text, textAlign: 'right' },
  modalDesc: { fontSize: 13, color: colors.textMuted, textAlign: 'right', marginTop: 6, marginBottom: 16 },
  codeInput: {
    backgroundColor: colors.bg, borderRadius: 12, padding: 14, fontSize: 15, marginBottom: 14,
    borderWidth: 1, borderColor: colors.border, textAlign: 'right',
  },
});
