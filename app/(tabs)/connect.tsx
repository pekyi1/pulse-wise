import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, PermissionsAndroid, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Constants from 'expo-constants';

// Minimal shape we use from BLE device
type SimpleDevice = { id: string; name?: string | null };
const isExpoGo = Constants.appOwnership === 'expo';

export default function ConnectScreen() {
  const [devices, setDevices] = useState<SimpleDevice[]>([]);
  const [scanning, setScanning] = useState(false);
  const [connectedDevice, setConnectedDevice] = useState<SimpleDevice | null>(null);
  const manager = useRef<any | null>(null);

  // Track if component is mounted
  const isMounted = useRef(true);
  useEffect(() => {
    isMounted.current = true;

    if (!isExpoGo) {
      // Dynamically require BLE manager only in a dev build / standalone
      const { BleManager } = require('react-native-ble-plx');
      manager.current = new BleManager();
    }

    return () => {
      isMounted.current = false;
      if (manager.current) {
        try { manager.current.stopDeviceScan(); } catch {}
        try { manager.current.destroy(); } catch {}
        manager.current = null;
      }
    };
  }, []);

  async function requestPermissions() {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
        ]);
        return Object.values(granted).every(val => val === PermissionsAndroid.RESULTS.GRANTED);
      } catch (err) {
        Alert.alert('Permission Error', 'Bluetooth permissions are required.');
        return false;
      }
    }
    return true; // iOS handled via Info.plist
  }

  const scanForDevices = async () => {
    if (isExpoGo) {
      Alert.alert('Unavailable in Expo Go', 'Bluetooth scanning requires a development build. Open this app with a dev client to use Connect.');
      return;
    }
    if (!manager.current) {
      Alert.alert('Bluetooth not initialized', 'BLE manager is not available.');
      return;
    }
    if (!(await requestPermissions())) return;
    setDevices([]);
    setScanning(true);
    manager.current.startDeviceScan(null, null, (error: any, device: any) => {
      if (error) {
        setScanning(false);
        Alert.alert('Scan error', error.message);
        manager.current && manager.current.stopDeviceScan();
        return;
      }
      if (device && device.name && isMounted.current) {
        setDevices(prev => {
          if (!prev.some(d => d.id === device.id)) {
            return [...prev, device];
          }
          return prev;
        });
      }
    });
    setTimeout(() => {
      manager.current && manager.current.stopDeviceScan();
      setScanning(false);
    }, 10000);
  };

  const connectToDevice = async (device: SimpleDevice) => {
    try {
      setScanning(false);
      if (manager.current) {
        manager.current.stopDeviceScan();
        await manager.current.connectToDevice(device.id);
      }
      setConnectedDevice(device);
      Alert.alert('Connected', `Connected to ${device.name}`);
    } catch (e: any) {
      Alert.alert('Connection failed', e?.message || String(e));
    }
  };

  const disconnectFromDevice = async () => {
    if (connectedDevice) {
      try {
        if (manager.current) {
          await manager.current.cancelDeviceConnection(connectedDevice.id);
        }
        setConnectedDevice(null);
        Alert.alert('Disconnected', 'Device has been disconnected.');
      } catch (e: any) {
        Alert.alert('Disconnection failed', e?.message || String(e));
      }
    }
  };

  if (isExpoGo) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Connect to your PulseWise Device</Text>
        <Text style={{ color: '#666', textAlign: 'center' }}>
          Bluetooth is unavailable in Expo Go. Build a development client to use this feature.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Connect to your PulseWise Device</Text>
      <TouchableOpacity
        style={[styles.scanButton, scanning && styles.scanButtonDisabled]}
        onPress={scanForDevices}
        disabled={scanning}
        activeOpacity={0.8}
      >
        {scanning ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.scanButtonText}>Scan for Devices</Text>
        )}
      </TouchableOpacity>
      <FlatList
        data={devices}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.deviceItem} onPress={() => connectToDevice(item)} activeOpacity={0.7}>
            <View style={styles.deviceInfoRow}>
              <View style={styles.deviceIcon} />
              <View style={{ flex: 1 }}>
                <Text style={styles.deviceName}>{item.name || 'Unnamed Device'}</Text>
                <Text style={styles.deviceId}>{item.id}</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={!scanning ? <Text style={styles.emptyText}>No devices found</Text> : null}
        style={{ width: '100%', marginTop: 20 }}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
      {connectedDevice && (
        <View style={styles.connectedBanner}>
          <Text style={styles.connectedText}>Connected to: {connectedDevice.name}</Text>
          <TouchableOpacity style={styles.disconnectButton} onPress={disconnectFromDevice}>
            <Text style={styles.disconnectButtonText}>Disconnect</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  disconnectButton: {
    width: '100%',
    backgroundColor: '#ff4d4f', // A strong red
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
    elevation: 2,
  },
  disconnectButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: '#f5f7fa',
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  text: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#246BFD',
    letterSpacing: 0.5,
    textAlign: 'center',
  },
  scanButton: {
    width: '100%',
    backgroundColor: '#246BFD',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
    elevation: 2,
  },
  scanButtonDisabled: {
    backgroundColor: '#a3bffa',
  },
  scanButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  deviceItem: {
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 0,
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e3e8ee',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  deviceInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  deviceIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#246BFD',
    marginRight: 14,
  },
  deviceName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#222',
  },
  deviceId: {
    fontSize: 12,
    color: '#888',
  },
  emptyText: {
    margin: 20,
    fontSize: 16,
    color: '#aaa',
    textAlign: 'center',
  },
  connectedBanner: {
    marginTop: 24,
    backgroundColor: '#e6f7ec',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    width: '100%',
  },
  connectedText: {
    color: '#27ae60',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
