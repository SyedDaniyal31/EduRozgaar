import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useTheme } from '../theme';
import { api } from '../api/client';
import { t } from '../i18n';

export default function HomeScreen() {
  const { theme } = useTheme();
  const [trendingJobs, setTrendingJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.trending('jobs')
      .then((res) => setTrendingJobs(res.data?.data || res.data || []))
      .catch(() => setTrendingJobs([]))
      .finally(() => setLoading(false));
  }, []);

  const c = theme === 'dark' ? require('../theme').colors.dark : require('../theme').colors.light;

  return (
    <ScrollView style={[styles.container, { backgroundColor: c.bg }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: c.text }]}>{t('home.title')}</Text>
        <Text style={[styles.sub, { color: c.subtext }]}>{t('home.sub')}</Text>
      </View>
      <Text style={[styles.sectionTitle, { color: c.text }]}>{t('home.trending')}</Text>
      {loading ? (
        <ActivityIndicator size="small" color={c.primary} style={styles.loader} />
      ) : trendingJobs.length === 0 ? (
        <Text style={[styles.empty, { color: c.subtext }]}>{t('common.loading')}</Text>
      ) : (
        trendingJobs.slice(0, 5).map((job) => (
          <TouchableOpacity key={job._id} style={[styles.card, { backgroundColor: c.card, borderColor: c.border }]} activeOpacity={0.7}>
            <Text style={[styles.cardTitle, { color: c.text }]} numberOfLines={2}>{job.title}</Text>
            <Text style={[styles.cardSub, { color: c.subtext }]}>{job.organization || job.company}</Text>
          </TouchableOpacity>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { padding: 20, paddingTop: 40 },
  title: { fontSize: 24, fontWeight: '700' },
  sub: { fontSize: 14, marginTop: 4 },
  sectionTitle: { fontSize: 18, fontWeight: '600', marginHorizontal: 20, marginTop: 24, marginBottom: 12 },
  loader: { margin: 20 },
  empty: { marginHorizontal: 20, marginVertical: 12 },
  card: { marginHorizontal: 20, marginBottom: 12, padding: 16, borderRadius: 12, borderWidth: 1 },
  cardTitle: { fontSize: 16, fontWeight: '600' },
  cardSub: { fontSize: 13, marginTop: 4 },
});
