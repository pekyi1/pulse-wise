import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, Alert } from 'react-native';

const APP_VERSION = '1.0.0'; // From app.json

export default function SettingScreen() {
  const [autoConnect, setAutoConnect] = useState(false);

  const handleAutoConnectToggle = (value: boolean) => {
    setAutoConnect(value);
    // TODO: Persist this setting with AsyncStorage or SecureStore
    Alert.alert('Auto-Connect', value ? 'Auto-connect enabled' : 'Auto-connect disabled');
  };

  const handleClearDevices = () => {
    // TODO: Clear paired devices from storage/state
    Alert.alert('Clear Devices', 'Paired device list cleared! (Demo only)');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Settings</Text>
      <View style={styles.settingRow}>
        <Text style={styles.label}>Bluetooth Auto-Connect</Text>
        <Switch
          value={autoConnect}
          onValueChange={handleAutoConnectToggle}
          thumbColor={autoConnect ? '#246BFD' : '#ccc'}
          trackColor={{ false: '#ccc', true: '#a3bffa' }}
        />
      </View>
      <TouchableOpacity style={styles.clearButton} onPress={handleClearDevices}>
        <Text style={styles.clearButtonText}>Clear Paired Devices</Text>
      </TouchableOpacity>
      <View style={styles.versionRow}>
        <Text style={styles.versionLabel}>App Version:</Text>
        <Text style={styles.versionText}>{APP_VERSION}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fa',
    padding: 24,
    paddingTop: 40,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  header: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#246BFD',
    marginBottom: 32,
    letterSpacing: 0.5,
    textAlign: 'center',
  },
  settingRow: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 10,
    elevation: 1,
  },
  label: {
    fontSize: 18,
    color: '#222',
    fontWeight: '500',
  },
  clearButton: {
    width: '100%',
    backgroundColor: '#ff4d4f',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 32,
    elevation: 2,
  },
  clearButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  versionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
  },
  versionLabel: {
    fontSize: 16,
    color: '#888',
    marginRight: 8,
  },
  versionText: {
    fontSize: 16,
    color: '#246BFD',
    fontWeight: 'bold',
  },
});
