import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Client } from '../pboDetail.hooks';
import { styles } from '../pboDetail.style';

interface ClientRowProps {
  client: Client;
}

export const ClientRow = React.memo(({ client }: ClientRowProps) => (
  <TouchableOpacity style={styles.clientItem}>
    <View style={styles.portCircle}>
      <Text style={styles.portNumber}>{client.port || '?'}</Text>
    </View>
    <View style={{ flex: 1 }}>
      <Text style={styles.clientName}>{client.name || client.nom || "Sans nom"}</Text>
      <Text style={styles.clientAbo}>{client.abonnement || "N/A"}</Text>
    </View>
  </TouchableOpacity>
));