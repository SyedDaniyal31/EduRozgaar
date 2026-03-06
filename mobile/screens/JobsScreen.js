import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useTheme } from '../theme';
import { api } from '../api/client';
import { t } from '../i18n';

export default function JobsScreen() {
  const { theme } = useTheme();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.jobs({ limit: 20 })
      .then((res) => setData(res.data?.data || res.data || []))
      .catch(() => setData([]))
      .finally(() => setLoading(false));
  }, []);

  const c = theme === 'dark' ? require('../theme').colors.dark : require('../theme').colors.light;

  const renderItem = ({ item }) => (
    <TouchableOpacity style={[styles.card, { backgroundColor: c.card, borderColor: c.border }]} activeOpacity={0.7}>
      {item.source === 'scraper' && <View style={styles.badge}><Text style={styles.badgeText}>New</Text></View>}
      <Text style={[styles.title, { color: c.text }]} numberOfLines={2}>{item.title}</Text>
      <Text style={[styles.sub, { color: c.subtext }]}>{item.organization || item.company}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: c.bg }]}>
      <View style={styles.header}>
        <Text style={[styles.heading, { color: c.text }]}>{t('nav.jobs')}</Text>
      </View>
      {loading ? (
        <ActivityIndicator size="small" color={c.primary} style={styles.loader} />
      ) : (
        <FlatList
          data={data}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          ListEmptyComponent={<Text style={[styles.empty, { color: c.subtext }]}>{t('common.error')}</Text>}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { padding: 20, paddingTop: 48 },
  heading: { fontSize: 22, fontWeight: '700' },
  list: { padding: 20, paddingTop: 8 },
  card: { padding: 16, borderRadius: 12, borderWidth: 1, marginBottom: 12 },
  badge: { alignSelf: 'flex-start', backgroundColor: '#059669', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4, marginBottom: 8 },
  badgeText: { color: '#fff', fontSize: 11, fontWeight: '600' },
  title: { fontSize: 16, fontWeight: '600' },
  sub: { fontSize: 13, marginTop: 4 },
  loader: { marginTop: 40 },
  empty: { textAlign: 'center', marginTop: 24 },
});
