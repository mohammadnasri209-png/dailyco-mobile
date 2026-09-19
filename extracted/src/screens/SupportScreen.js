import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, ScrollView } from 'react-native';
import ScreenContainer from '../components/ScreenContainer';
import Card from '../components/Card';
import PrimaryButton from '../components/PrimaryButton';
import { colors, radius } from '../theme/theme';
import { SupportAPI } from '../api/client';
import { useContent } from '../context/ContentContext';
import { useAuth } from '../context/AuthContext';

const STATUS_LABEL = { open: 'در انتظار پاسخ', answered: 'پاسخ داده شد', closed: 'بسته شده' };
const STATUS_COLOR = { open: colors.accent, answered: colors.success, closed: colors.textMuted };

export default function SupportScreen({ navigation }) {
  const { user } = useAuth();
  const { get } = useContent();
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [tickets, setTickets] = useState([]);

  const loggedIn = Boolean(user);

  const loadTickets = async () => {
    if (!loggedIn) return;
    try {
      const t = await SupportAPI.myTickets();
      setTickets(t);
    } catch (e) {}
  };

  useEffect(() => { loadTickets(); }, [loggedIn]);

  const submit = async () => {
    if (!subject || !message) return Alert.alert('خطا', 'موضوع و پیام رو بنویس.');
    if (!loggedIn) return Alert.alert('توجه', 'برای ثبت درخواست باید وارد حساب بشی.');
    setLoading(true);
    try {
      await SupportAPI.createTicket(subject.trim(), message.trim());
      setSubject('');
      setMessage('');
      Alert.alert('ارسال شد', 'درخواستت ثبت شد.');
      loadTickets();
    } catch (e) {
      Alert.alert('خطا', 'مشکلی پیش اومد.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenContainer style={{ padding: 0 }}>
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <Text style={styles.title}>پشتیبانی</Text>
        <Text style={styles.note}>{get('support.contact_note')}</Text>

        <Card style={{ marginTop: 16 }}>
          <TextInput
            style={styles.input}
            placeholder="موضوع"
            placeholderTextColor={colors.textMuted}
            value={subject}
            onChangeText={setSubject}
          />
          <TextInput
            style={[styles.input, { height: 100, textAlignVertical: 'top' }]}
            placeholder="پیام خودت رو بنویس..."
            placeholderTextColor={colors.textMuted}
            multiline
            value={message}
            onChangeText={setMessage}
          />
          <PrimaryButton title="ارسال درخواست" onPress={submit} loading={loading} />
        </Card>

        {navigation.canGoBack() && (
          <PrimaryButton title="بازگشت" variant="outline" onPress={() => navigation.goBack()} style={{ marginTop: 12 }} />
        )}

        {loggedIn && tickets.length > 0 && (
          <>
            <Text style={[styles.title, { fontSize: 17, marginTop: 26 }]}>درخواست‌های قبلی</Text>
            {tickets.map(t => (
              <Card key={t.id} style={{ marginTop: 10 }}>
                <View style={styles.ticketHeader}>
                  <Text style={[styles.statusPill, { color: STATUS_COLOR[t.status] }]}>{STATUS_LABEL[t.status]}</Text>
                  <Text style={styles.ticketSubject}>{t.subject}</Text>
                </View>
                <Text style={styles.ticketMessage}>{t.message}</Text>
                {t.admin_reply && (
                  <View style={styles.replyBox}>
                    <Text style={styles.replyLabel}>پاسخ پشتیبانی:</Text>
                    <Text style={styles.replyText}>{t.admin_reply}</Text>
                  </View>
                )}
              </Card>
            ))}
          </>
        )}
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 22, fontWeight: '800', color: colors.text, textAlign: 'right' },
  note: { fontSize: 13, color: colors.textMuted, textAlign: 'right', marginTop: 6 },
  input: {
    backgroundColor: colors.bg, borderRadius: 14, padding: 14, fontSize: 15, marginBottom: 12,
    borderWidth: 1, borderColor: colors.border, textAlign: 'right',
  },
  ticketHeader: { flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'center' },
  ticketSubject: { fontWeight: '800', color: colors.text, fontSize: 15 },
  statusPill: { fontSize: 11, fontWeight: '800' },
  ticketMessage: { color: colors.textMuted, fontSize: 13, marginTop: 6, textAlign: 'right' },
  replyBox: { marginTop: 10, borderTopWidth: 1, borderTopColor: colors.border, paddingTop: 10 },
  replyLabel: { fontSize: 12, color: colors.primary, fontWeight: '800', textAlign: 'right' },
  replyText: { fontSize: 13, color: colors.text, marginTop: 4, textAlign: 'right' },
});
