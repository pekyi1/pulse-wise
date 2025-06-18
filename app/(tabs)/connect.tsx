import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { BleManager, Device } from 'react-native-ble-plx';

const manager = new BleManager();

export default function ConnectScreen() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [scanning, setScanning] = useState(false);
  const [connectedDevice, setConnectedDevice] = useState<Device | null>(null);

  useEffect(() => {
    return () => {
      manager.destroy();
    };
  }, []);

  const scanForDevices = () => {
    setDevices([]);
    setScanning(true);
    manager.startDeviceScan(null, null, (error, device) => {
      if (error) {
        setScanning(false);
        alert('Scan error: ' + error.message);
        return;
      }
      if (device && device.name && !devices.some(d => d.id === device.id)) {
        setDevices(prev => [...prev, device]);
      }
    });
    setTimeout(() => {
      manager.stopDeviceScan();
      setScanning(false);
    }, 5000);
  };

  // Fix for type error: device parameter
  type DeviceType = Device | null;

  const connectToDevice = async (device: Device) => {
    try {
      setScanning(false);
      manager.stopDeviceScan();
      const connected = await manager.connectToDevice(device.id);
      setConnectedDevice(connected);
      alert('Connected to ' + device.name);
    } catch (e: any) {
      alert('Connection failed: ' + (e?.message || e));
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Connect to Device</Text>
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
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
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
