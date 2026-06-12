import { useState } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { checkForUpdate, UpdateFlow } from 'react-native-in-app-updates';

export default function App() {
  const [status, setStatus] = useState('Idle');
  const [loading, setLoading] = useState(false);

  async function handleCheckForUpdate(flow: UpdateFlow, isMock: boolean) {
    setLoading(true);
    setStatus(`Checking (${isMock ? 'Mock' : 'Real'} ${flow})...`);
    try {
      const result = await checkForUpdate(flow, isMock);
      setStatus(`Success: ${result}`);
    } catch (e: any) {
      setStatus(`Error: ${e.message || e}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>In-App Updates Demo</Text>
        <Text style={styles.subtitle}>Test Google Play Update Flow</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.statusLabel}>STATUS</Text>
        {loading ? (
          <ActivityIndicator
            size="small"
            color="#6366f1"
            style={styles.loader}
          />
        ) : (
          <Text style={styles.statusText}>{status}</Text>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Real Play Store Test</Text>
        <Text style={styles.sectionDescription}>
          Requires package published to Google Play Store / Internal App
          Sharing.
        </Text>
        <View style={styles.row}>
          <TouchableOpacity
            style={[styles.button, styles.btnReal]}
            onPress={() => handleCheckForUpdate(UpdateFlow.FLEXIBLE, false)}
          >
            <Text style={styles.btnText}>Real Flexible</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.btnReal]}
            onPress={() => handleCheckForUpdate(UpdateFlow.IMMEDIATE, false)}
          >
            <Text style={styles.btnText}>Real Immediate</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Local Mock Test (Strategy 3)</Text>
        <Text style={styles.sectionDescription}>
          Runs offline using FakeAppUpdateManager. No Play Store app needed.
        </Text>
        <View style={styles.row}>
          <TouchableOpacity
            style={[styles.button, styles.btnMock]}
            onPress={() => handleCheckForUpdate(UpdateFlow.FLEXIBLE, true)}
          >
            <Text style={styles.btnText}>Mock Flexible</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.btnMock]}
            onPress={() => handleCheckForUpdate(UpdateFlow.IMMEDIATE, true)}
          >
            <Text style={styles.btnText}>Mock Immediate</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#f8fafc',
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 14,
    color: '#94a3b8',
    marginTop: 8,
  },
  card: {
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    borderColor: '#334155',
    marginBottom: 32,
    minHeight: 100,
    justifyContent: 'center',
  },
  statusLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#6366f1',
    letterSpacing: 1.5,
    marginBottom: 8,
    textAlign: 'center',
  },
  statusText: {
    fontSize: 16,
    color: '#cbd5e1',
    textAlign: 'center',
    fontWeight: '500',
    lineHeight: 22,
  },
  loader: {
    marginTop: 10,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#e2e8f0',
    marginBottom: 4,
  },
  sectionDescription: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 12,
    lineHeight: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  button: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  btnReal: {
    backgroundColor: '#3b82f6',
  },
  btnMock: {
    backgroundColor: '#10b981',
  },
  btnText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
});
