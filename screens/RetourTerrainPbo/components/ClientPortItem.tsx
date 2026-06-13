import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ClientPbo } from '../useRetourTerrain.hooks';
import { styles, PRIMARY_BLUE } from '../retourTerrain.styles';

interface ClientPortItemProps {
  item: ClientPbo;
  onOpenEdit: (item: ClientPbo) => void;
}

export const ClientPortItem: React.FC<ClientPortItemProps> = ({ item, onOpenEdit }) => {
  const isOccupied = item.nom && item.nom.trim() !== '';
  return (
    <View style={[styles.clientCard, !isOccupied && styles.clientCardLibre]}>
      <TouchableOpacity style={styles.editCardButton} onPress={() => onOpenEdit(item)} activeOpacity={0.6}>
        <Ionicons name={isOccupied ? "create-outline" : "add-circle-outline"} size={18} color={isOccupied ? PRIMARY_BLUE : "#666"} />
      </TouchableOpacity>

      <View style={styles.clientHeader}>
        <View style={[styles.avatarBadge, !isOccupied && styles.avatarBadgeLibre]}>
          {isOccupied ? (
            <Text style={styles.avatarText}>
              {item.nom && item.nom[0] ? item.nom[0].toUpperCase() : ''}
              {item.prenom && item.prenom[0] ? item.prenom[0].toUpperCase() : ''}
            </Text>
          ) : (
            <Ionicons name="git-commit-outline" size={16} color="#78909C" />
          )}
        </View>
        <View style={styles.clientMeta}>
          <Text style={[styles.clientName, !isOccupied && styles.clientNameLibre]}>
            {isOccupied ? `${item.nom} ${item.prenom}` : "Port non attribué (Libre)"}
          </Text>
          <Text style={styles.cassetteTag}>{item.positionCassette}</Text>
        </View>
      </View>

      {isOccupied && (
        <View style={styles.infoCompactContainer}>
          <View style={styles.infoRow}>
            <Ionicons name="call-outline" size={14} color="#666" />
            <Text style={styles.infoText}>{item.telephone}</Text>
          </View>
          {(item.numAbonnement || '').trim() !== '' && (
            <View style={styles.infoRow}>
              <Ionicons name="card-outline" size={14} color="#666" />
              <Text style={styles.infoText}>Abonnement: {item.numAbonnement}</Text>
            </View>
          )}
          {(item.quartier || item.adresse) && (
            <View style={styles.infoRow}>
              <Ionicons name="location-outline" size={14} color="#666" />
              <Text style={styles.infoText} numberOfLines={1}>
                {item.quartier}{item.adresse ? `, ${item.adresse}` : ''}
              </Text>
            </View>
          )}
        </View>
      )}
    </View>
  );
};