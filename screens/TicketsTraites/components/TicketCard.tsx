import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Ticket } from '../ticketsTraites.hooks';
import { styles } from '../ticketsTraites.style';

interface TicketCardProps {
  item: Ticket;
  onDetailPress: (item: Ticket) => void;
}

export function TicketCard({ item, onDetailPress }: TicketCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.clientInfo}>
          <View style={styles.iconCircle}>
            <Ionicons name="person" size={18} color="white" />
          </View>
          <View style={{ flex: 1, marginRight: 8 }}>
            <Text style={styles.clientNom} numberOfLines={1}>{item.nomClient}</Text>
            <Text style={styles.clientTel}>{item.telephone}</Text>
          </View>
        </View>
        <View style={[styles.badge, item.isPboNomme ? styles.badgeNomme : styles.badgeNonNomme]}>
          <Text style={[styles.badgeText, item.isPboNomme ? styles.badgeTextNomme : styles.badgeTextNonNomme]}>
            {item.isPboNomme ? 'NOMMÉ' : 'NON NOMMÉ'}
          </Text>
        </View>
      </View>

      <View style={styles.cardBody}>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>{item.isPboNomme ? 'Code PBO' : 'ID NON NOMMÉ'}</Text>
          <Text style={styles.highlightValue}>{item.isPboNomme ? item.pbo : item.idDou}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Arrondissement</Text>
          <Text style={styles.infoValue}>{item.arrondissement}</Text>
        </View>
      </View>

      <View style={styles.cardFooter}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Ionicons name="calendar-outline" size={12} color="#999" />
          <Text style={styles.dateText}>Le {item.date}</Text>
        </View>
        
        <TouchableOpacity 
          style={styles.detailButton}
          onPress={() => onDetailPress(item)}
        >
          <Ionicons name="eye-outline" size={14} color="white" />
          <Text style={styles.detailButtonText}>Voir détail</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}