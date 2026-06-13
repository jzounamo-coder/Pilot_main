import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { RetourItem } from '../listeRetoursTerrain.hooks';
import { styles, PRIMARY_BLUE } from '../listeRetoursTerrain.style';

interface RetourCardProps {
  item: RetourItem;
  onPress: () => void;
}

export const RetourCard = React.memo(({ item, onPress }: RetourCardProps) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.cardHeader}>
        <View style={styles.clientInfo}>
          <View style={styles.iconCircle}>
            <Ionicons name="person" size={18} color="white" />
          </View>
          <View>
            <Text style={styles.clientNom}>{item.nomClient}</Text>
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
          <Text style={styles.infoLabel}>Abonnement</Text>
          <Text style={styles.infoValue}>{item.numAbonnement}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>{item.isPboNomme ? 'PBO' : 'DOU'}</Text>
          <Text style={styles.highlightValue}>{item.isPboNomme ? item.pbo : item.idDou}</Text>
        </View>
        
        {/* Stats ports */}
        <View style={[styles.infoRow, { marginTop: 6 }]}>
          <View style={styles.statMini}>
            <Text style={[styles.statMiniVal, { color: '#2E7D32' }]}>{item.portsLibres}</Text>
            <Text style={styles.statMiniLabel}>Libres</Text>
          </View>
          <View style={styles.statMini}>
            <Text style={[styles.statMiniVal, { color: '#C62828' }]}>{item.portsOccupes}</Text>
            <Text style={styles.statMiniLabel}>Occupés</Text>
          </View>
          <View style={styles.statMini}>
            <Text style={[styles.statMiniVal, { color: PRIMARY_BLUE }]}>{item.portsTotal}</Text>
            <Text style={styles.statMiniLabel}>Total</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={{ fontSize: 11, color: '#999' }}>Voir détails</Text>
            <Ionicons name="chevron-forward" size={14} color="#999" />
          </View>
        </View>
      </View>

      <View style={styles.cardFooter}>
        <Ionicons name="calendar-outline" size={12} color="#999" />
        <Text style={styles.dateText}>Le {item.date}</Text>
      </View>
    </TouchableOpacity>
  );
});