import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from '../pboFull.style';

interface ClientInfoCardProps {
  clientInfo: any;
  currentLoginId: string;
}

export const ClientInfoCard = React.memo(({ clientInfo, currentLoginId }: ClientInfoCardProps) => {
  const details = clientInfo.data || {};
  const nestedData = details.data || {}; 
  const nom = clientInfo.label || details.lastName || 'Nom inconnu';
  const abonnement = clientInfo.loginId || details.msisdn || currentLoginId || 'Non trouvé';
  const arrondissement = nestedData.district || details.district || 'Non défini';
  const adresse = clientInfo.address || details.address || details.street || nestedData.street || 'Non renseignée';
  const telephone = clientInfo.officePhone || clientInfo.homePhone || details.officePhone || details.phone || '';

  return (
    <View style={styles.dashedCard}>
      <View style={styles.profileIconContainer}>
        <Ionicons name="person-circle" size={40} color="#388E3C" />
      </View>
      <View style={styles.infoContent}>
        <Text style={styles.clientLabel}>{nom}</Text>
        <View style={styles.infoRow}>
          <Ionicons name="card-outline" size={16} color="#4E342E" style={{ marginRight: 5 }} />
          <Text style={styles.clientDetail}>Abonnement : {abonnement}</Text>
        </View>
        {!!telephone && (
          <View style={styles.infoRow}>
            <Ionicons name="call-outline" size={16} color="#4E342E" style={{ marginRight: 5 }} />
            <Text style={styles.clientDetail}>Téléphone : {telephone}</Text>
          </View>
        )}
        <View style={styles.infoRow}>
          <Ionicons name="location-outline" size={16} color="#4E342E" style={{ marginRight: 5 }} />
          <Text style={styles.clientDetail}>Arrondissement : {arrondissement}</Text>
        </View>
        <View style={styles.infoRow}>
          <Ionicons name="home-outline" size={16} color="#4E342E" style={{ marginRight: 5 }} />
          <Text style={styles.clientDetail}>Adresse : {adresse}</Text>
        </View>
      </View>
    </View>
  );
});