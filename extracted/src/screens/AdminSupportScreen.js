import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, FlatList, Alert } from 'react-native';
import ScreenContainer from '../components/ScreenContainer';
import Card from '../components/Card';
import PrimaryButton from '../components/PrimaryButton';
import { colors } from '../theme/theme';
import { AdminAPI } from '../api/client';

export default function AdminSupportScreen() {
  const [tickets, setTickets] = useState(null);
  const [drafts, setDrafts] = useState({});
  const [savingId, setSavingId] = useState(null);

  const load = async () => {
    try {
      const rows = await AdminAPI.listTickets();
      setTickets(rows);
    } catch (e) {
      setTickets([]);
    }
  };

  useEffect(() => { load(); }, []);

  const reply = async (id) => {
    setSavingId(id);
    try {
      await AdminAPI.replyTicket(id, drafts[id] || '', 'answered');
      await load();
    } catch (e) {
      Alert.alert('خطا', 'ذخیره نشد.');
    } finally {
      setSavingId(null);
    }
  };

  if (tickets === null) return null;

  return (
    <ScreenContainer style={{ padding: 0 }}>
      <FlatList
        data={tickets}
        keyExtractor={t => String(t.id)}
        contentContainerStyle={{ padding: 20, gap: 12 }}
        ListHeaderComponent={<Text style={styles.title}>تیکت‌های پشتیبانی</Text>}
        ListEmptyComponent={<Text style={styles.empty}>هیچ درخواستی ثبت نشده.</Text>}
        renderItem={({ item }) => (
          <Card>
            <Text style={styles.subject}>{item.subject} — {item.user_name}</Text>
            <Text style={styles.message}>{item.message}</Text>
            <Text style={styles.status}>وضعیت: {item.status}</Text>
            <TextInput
              style={styles.input}
              placeholder="پاسخ..."
              placeholderTextColor={colors.textMuted}
              value={drafts[item.id] ?? item.admin_reply ?? ''}
              onChangeText={(t) => setDrafts(d => ({ ...d, [item.id]: t }))}
              multiline
            />
            <PrimaryButton title="ارسال پاسخ و بستن" onPress={() => reply(item.id)} loading={savingId === item.id} />
          </Card>
        )}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 22, fontWeight: '800', color: colors.text, textAlign: 'right', marginBottom: 4 },
  empty: { textAlign: 'center', color: colors.textMuted, marginTop: 20 },
  subject: { fontWeight: '800', color: colors.text, textAlign: 'right' },
  message: { fontSize: 13, color: colors.textMuted, textAlign: 'right', marginTop: 6 },
  status: { fontSize: 12, color: colors.primary, fontWeight: '700', textAlign: 'right', marginTop: 6 },
  input: {
    backgroundColor: colors.bg, borderRadius: 12, padding: 12, fontSize: 14, marginTop: 10, marginBottom: 10,
    borderWidth: 1, borderColor: colors.border, textAlign: 'right', minHeight: 44,
  },
});
