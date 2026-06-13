import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Installation } from '../installations.hooks';
import { styles, PRIMARY_BLUE } from '../installations.style';

interface CardProps {
  item: Installation;
  onCardPress: (item: Installation) => void;
  onGpsPress: (lat: number, lng: number) => void;
}

export function InstallationCard({ item, onCardPress, onGpsPress }: CardProps) {
  // Helpers de style internes au composant
  const getTypeStyle = (type: string) => {
    switch (type) {
      case 'OE': return { color: '#D32F2F', bg: '#FFEBEE' };
      case 'OT': return { color: '#F57C00', bg: '#FFF3E0' };
      case 'OD': return { color: '#388E3C', bg: '#E8F5E9' };
      default: return { color: '#757575', bg: '#F5F5F5' };
    }
  };

  const getStatutStyle = (statut: string) => {
    switch (statut) {
      case 'Validé': return { color: '#FFFFFF', bg: '#00C853' }; 
      case 'En cours': return { color: '#FFFFFF', bg: '#29B6F6' };
      case 'En attente': return { color: '#333333', bg: '#E0E0E0' }; 
      default: return { color: '#333333', bg: '#E0E0E0' };
    }
  };

  const typeStyle = getTypeStyle(item.type);
  const statutStyle = getStatutStyle(item.statut);

  return (
    <View style={styles.card}>
      <TouchableOpacity 
        style={styles.cardContent}
        onPress={() => onCardPress(item)}
      >
        <View style={styles.infoSection}>
          <View style={styles.titleRow}>
            <Text style={styles.clientName} numberOfLines={1}>{item.nom}</Text>
            <View style={[styles.statusBadge, { backgroundColor: statutStyle.bg }]}>
              <Text style={[styles.statusText, { color: statutStyle.color }]}>{item.statut}</Text>
            </View>
          </View>

          <Text style={styles.clientDetails}>
            <Ionicons name="call-outline" size={12} color="#666" /> {item.tel}
          </Text>
          <Text style={styles.clientDetails}>
            <Ionicons name="location-outline" size={12} color="#666" /> {item.ville}, {item.arrondissement}
          </Text>

          <View style={[styles.badge, { backgroundColor: typeStyle.bg, marginTop: 5 }]}>
            <Text style={[styles.badgeText, { color: typeStyle.color }]}>{item.type}</Text>
          </View>
        </View>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.routeButton}
        onPress={() => onGpsPress(item.latitude, item.longitude)}
      >
        <Ionicons name="navigate-circle" size={30} color={PRIMARY_BLUE} />
        <Text style={styles.routeText}>GPS</Text>
      </TouchableOpacity>
    </View>
  );
}