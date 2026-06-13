import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles, SUCCESS_GREEN } from '../pboFull.style';

interface PboInfoCardProps {
  pboInfo: any;
}

export const PboInfoCard = React.memo(({ pboInfo }: PboInfoCardProps) => {
  const nomPbo = pboInfo.nomPbo || pboInfo.idPbo || pboInfo.codePbo || pboInfo.data?.idPbo || 'PBO Trouvé';
  const localisation = pboInfo.ville || pboInfo.localisation || pboInfo.data?.ville || '';
  
  return (
    <View style={[styles.dashedCard, { borderColor: SUCCESS_GREEN, backgroundColor: '#F1F8E9', marginTop: 12 }]}>
      <View style={styles.profileIconContainer}>
        <Ionicons name="cube" size={36} color={SUCCESS_GREEN} />
      </View>
      <View style={styles.infoContent}>
        <Text style={[styles.clientLabel, { color: SUCCESS_GREEN }]}>PBO Marqué</Text>
        <Text style={[styles.clientDetail, { fontWeight: 'bold', fontSize: 15, marginTop: 4, color: '#333' }]}>
          Nom : {nomPbo}
        </Text>
        {!!localisation && <Text style={styles.clientDetail}>Zone : {localisation}</Text>}
      </View>
    </View>
  );
});