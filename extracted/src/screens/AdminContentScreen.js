import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, FlatList, Alert } from 'react-native';
import ScreenContainer from '../components/ScreenContainer';
import Card from '../components/Card';
import PrimaryButton from '../components/PrimaryButton';
import { colors } from '../theme/theme';
import { AdminAPI } from '../api/client';
import { useContent } from '../context/ContentContext';

// Every row here is one editable string shown somewhere in the app
// (login subtitle, support note, etc). Saving updates it immediately for
// every user — no redeploy needed.
export default function AdminContentScreen() {
  const { reload } = useContent();
  const [items, setItems] = useState(null);
  const [drafts, setDrafts] = useState({});
  const [savingKey, setSavingKey] = useState(null);

  const load = async () => {
    try {
      const rows = await AdminAPI.getContent();
      setItems(rows);
      setDrafts(Object.fromEntries(rows.map(r => [r.key, r.value])));
    } catch (e) {
      setItems([]);
    }
  };

  useEffect(() => { load(); }, []);

  const save = async (key) => {
    setSavingKey(key);
    try {
      await AdminAPI.setContent(key, drafts[key]);
      await reload(); // so the change shows up immediately across the app
    } catch (e) {
      Alert.alert('خطا', 'ذخیره نشد.');
    } finally {
      setSavingKey(null);
    }
  };

  if (items === null) return null;

  return (
    <ScreenContainer style={{ padding: 0 }}>
      <FlatList
        data={items}
        keyExtractor={i => i.key}
        contentContainerStyle={{ padding: 20, gap: 12 }}
        ListHeaderComponent={<Text style={styles.title}>متن‌های اپ</Text>}
        renderItem={({ item }) => (
          <Card>
            <Text style={styles.key}>{item.key}</Text>
            <TextInput
              style={styles.input}
              value={drafts[item.key]}
              onChangeText={(t) => setDrafts(d => ({ ...d, [item.key]: t }))}
              multiline
            />
            <PrimaryButton
              title="ذخیره"
              onPress={() => save(item.key)}
              loading={savingKey === item.key}
              style={{ marginTop: 4 }}
            />
          </Card>
        )}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 22, fontWeight: '800', color: colors.text, textAlign: 'right', marginBottom: 4 },
  key: { fontSize: 12, color: colors.primary, fontWeight: '800', textAlign: 'right', marginBottom: 8 },
  input: {
    backgroundColor: colors.bg, borderRadius: 12, padding: 12, fontSize: 14, marginBottom: 12,
    borderWidth: 1, borderColor: colors.border, textAlign: 'right', minHeight: 44,
  },
});
