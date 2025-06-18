import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import React from 'react';
import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

// Custom hook for BLE logic (to be implemented)
function useHealthBLE() {
  // Placeholder for BLE logic
  // Return mock data for now
  return {
    heartRate: 72,
    bloodPressure: { systolic: 120, diastolic: 80 },
    spo2: 98,
    temperature: 36.7,
    steps: 4567,
    // Add BLE state/connection info here as needed
  };
}

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      {/* Top Greeting and Profile */}
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.helloText}>Hello!</Text>
          <Text style={styles.nameText}>Pekyi Fred</Text>
        </View>
        <Image
          source={require('@/assets/images/profile-placeholder.png')}
          style={styles.profileImage}
        />
      </View>

      {/* Search Bar */}
      <View style={styles.searchRow}>
        <MaterialIcons name="search" size={26} color="#A7A7A7" style={{ marginLeft: 10 }} />
        <TextInput
          placeholder="Search medicines"
          placeholderTextColor="#C8C8C8"
          style={styles.searchInput}
        />
        <TouchableOpacity style={styles.filterButton}>
          <MaterialIcons name="tune" size={24} color="#222" />
        </TouchableOpacity>
      </View>

      {/* Info Cards Grid */}
      <View style={styles.gridContainer}>
        <View style={[styles.card, styles.blueCard]}> {/* Heart Rate */}
          <View style={styles.cardTitleRow}><MaterialIcons name="favorite" size={18} color="#fff" style={styles.cardTitleIcon} /><Text style={[styles.cardTitle, styles.heartTitle]}>Heart Rate</Text></View>
          <View style={styles.heartChart}>
            {/* Placeholder for heart rate chart */}
            <Image source={require('@/assets/images/heart-rate.png')} style={{width: 90, height: 58, resizeMode: 'contain'}} />
          </View>
          <Text style={styles.heartRateValue}><Text>72 </Text><Text style={styles.bpm}>bpm</Text></Text>
        </View>
        <View style={styles.card}> {/* ECG */}
          <View style={styles.cardTitleRow}><MaterialIcons name="electrical-services" size={18} color="#222" style={styles.cardTitleIcon} /><Text style={styles.cardTitle}>ECG Information</Text></View>
          <Image source={require('@/assets/images/ecg.png')} style={{width: 90, height: 58, resizeMode: 'contain'}} />
          <Text style={styles.cardValue}><Text>25</Text><Text style={styles.cardUnit}> mm/s</Text></Text>
        </View>
        <View style={styles.card}> {/* Oxygen */}
          <View style={styles.cardTitleRow}><MaterialIcons name="water-drop" size={18} color="#222" style={styles.cardTitleIcon} /><Text style={styles.cardTitle}>Oxygen(SPO₂)</Text></View>
          <Text style={styles.cardValue}><Text>25</Text><Text style={styles.cardUnit}> %</Text></Text>
        </View>
        <View style={styles.card}> {/* Blood Pressure */}
          <View style={styles.cardTitleRow}><MaterialIcons name="bloodtype" size={18} color="#222" style={styles.cardTitleIcon} /><Text style={styles.cardTitle}>Blood Pressure</Text></View>
          <Text style={styles.cardValue}><Text>120/80</Text><Text style={styles.cardUnit}> mmHg</Text></Text>
        </View>
      </View>


    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 40,
    paddingHorizontal: 18,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
    marginBottom: 18,
  },
  helloText: {
    fontSize: 18,
    color: '#222',
    fontWeight: '400',
    marginBottom: 2,
  },
  nameText: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#111',
  },
  profileImage: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#eee',
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 14,
    marginBottom: 26,
    height: 48,
    paddingRight: 10,
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 3,
    elevation: 1,
  },
  searchInput: {
    flex: 1,
    fontSize: 17,
    color: '#222',
    paddingHorizontal: 10,
    backgroundColor: 'transparent',
  }, 
  filterButton: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 5,
    marginLeft: 8,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 10,
    marginBottom: 14,
  },
  card: {
    width: '47%',
    backgroundColor: '#F5F5F5',
    borderRadius: 18,
    padding: 16,
    marginBottom: 16,
    minHeight: 120,
    justifyContent: 'space-between',
  },
  blueCard: {
    backgroundColor: '#246BFD',
  },
  cardTitle: {
    fontSize: 15,
    color: '#222',
    fontWeight: '500',
    marginBottom: 10,
  },
  heartTitle:{
    color: '#fff'
  },
  cardTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 3,
    minHeight: 24, // ensure enough height for alignment
  },
  cardTitleIcon: {
    marginRight: 6,
    marginBottom: 10
  },
  heartChart: {
    alignItems: 'center',
    marginBottom: 8,
  },
  heartRateValue: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  bpm: {
    fontSize: 13,
    color: '#fff',
    fontWeight: '400',
  },
  cardValue: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#222',
    marginTop: 12,
  },
  cardUnit: {
    fontSize: 13,
    color: '#444',
    fontWeight: '400',
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    backgroundColor: '#fff',
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    paddingHorizontal: 18,
    paddingTop: 10,
    paddingBottom: 8,
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 0.07,
    shadowRadius: 10,
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
  navItem: {
    alignItems: 'center',
    flex: 1,
  },
  navItemActive: {
    alignItems: 'center',
    flex: 1,
  },
  navLabel: {
    fontSize: 12,
    color: '#222',
    marginTop: 2,
  },
  navLabelActive: {
    fontSize: 12,
    color: '#246BFD',
    marginTop: 2,
    fontWeight: 'bold',
  },
});
