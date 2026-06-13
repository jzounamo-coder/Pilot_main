import React from 'react';
import { View, Text } from 'react-native';
import { styles, PRIMARY_BLUE } from '../installations.style';

interface DashboardProps {
  stats: {
    terminees: number;
    enCours: number;
    enAttente: number;
    total: number;
  };
}

export function InstallationDashboard({ stats }: DashboardProps) {
  return (
    <View style={styles.dashboard}>
      <View style={styles.statsRow}>
        <View style={styles.statBox}>
          <Text style={[styles.statNumber, { color: '#00C853' }]}>{stats.terminees}</Text>
          <Text style={styles.statLabel}>Fait</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={[styles.statNumber, { color: '#29B6F6' }]}>{stats.enCours}</Text>
          <Text style={styles.statLabel}>En cours</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={[styles.statNumber, { color: '#757575' }]}>{stats.enAttente}</Text>
          <Text style={styles.statLabel}>Attente</Text>
        </View>
        <View style={[styles.statBox, { borderRightWidth: 0 }]}>
          <Text style={[styles.statNumber, { color: PRIMARY_BLUE }]}>{stats.total}</Text>
          <Text style={styles.statLabel}>Total</Text>
        </View>
      </View>
    </View>
  );
}