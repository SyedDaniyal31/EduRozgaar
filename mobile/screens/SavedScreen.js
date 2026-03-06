import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { useTheme } from '../theme';
import { api } from '../api/client';
import { t } from '../i18n';

export default function SavedScreen() {
  const { theme } = useTheme();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.bookmarks()
      .then((res) => setData(res.data))
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, []);

  const c = theme === 'dark' ? require('../theme').colors.dark : require('../theme').colors.light;

  return (
    <View style={[styles.container, { backgroundColor: c.bg }]}>
      <View style={styles.header}>
        <Text style={[styles.heading, { color: c.text }]}>{t('nav.saved')}</Text>
      </View>
      {loading ? (
        <ActivityIndicator size="small" color={c.primary} style={styles.loader} />
      ) : !data ? (
        <Text style={[styles.msg, { color: c.subtext }]}>{t('common.error')} {t('common.retry')}</Text>
      ) : (
        <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
          <Text style={[styles.section, { color: c.text }]}>Jobs: {(data.savedJobs || []).length}</Text>
          <Text style={[styles.section, { color: c.text }]}>Scholarships: {(data.savedScholarships || []).length}</Text>
          <Text style={[styles.section, { color: c.text }]}>Admissions: {(data.savedAdmissions || []).length}</Text>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { padding: 20, paddingTop: 48 },
  heading: { fontSize: 22, fontWeight: '700' },
  loader: { marginTop: 40 },
  msg: { marginHorizontal: 20, marginTop: 24 },
  scroll: { flex: 1 },
  content: { padding: 20 },
  section: { fontSize: 16, marginBottom: 12 },
});
