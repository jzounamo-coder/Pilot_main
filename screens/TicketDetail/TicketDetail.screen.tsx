import React from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; 
import { useTicketDetail } from './TicketDetail.hooks';
import { styles } from './TicketDetail.styles';
import { InfoRow } from './components/InfoRow';

export default function TicketDetailScreen() {
  const {
    ticket,
    totalPorts,
    freePorts,
    occupiedPorts,
    isSaturated,
    occupancyPercentage,
    handleGoBack,
  } = useTicketDetail();

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Image source={{ uri: ticket.imageUri }} style={styles.avatar} />
        <Text style={styles.mainTitle}>{ticket.name}</Text>
        <Text style={styles.subTitle}>ID: {ticket.subscriberId}</Text>
      </View>

      <View style={styles.content}>
        {/* Alerte Saturation */}
        {isSaturated && (
          <View style={styles.saturationAlert}>
            <Ionicons name="warning" size={20} color="#B91C1C" />
            <Text style={styles.saturationText}>ATTENTION : PBO RATTACHÉ SATURÉ</Text>
          </View>
        )}

        {/* Section Localisation */}
        <Text style={styles.sectionTitle}>Contact & Localisation</Text>
        <InfoRow label="Téléphone" value={ticket.phone} />
        <InfoRow label="Adresse" value={ticket.adresse} />
        
        <View style={{ flexDirection: 'row' }}>
          <View style={{ flex: 1 }}>
            <InfoRow label="Latitude" value={ticket.lat} />
          </View>
          <View style={{ flex: 1 }}>
            <InfoRow label="Longitude" value={ticket.lnf} />
          </View>
        </View>

        {/* Section Technique */}
        <Text style={styles.sectionTitle}>Données Techniques & Saturation</Text>
        
        {/* Jauge de progression visuelle */}
        <View style={styles.progressSection}>
          <Text style={styles.progressLabel}>
            Occupation du PBO ({occupiedPorts}/{totalPorts})
          </Text>
          <View style={styles.progressContainer}>
            <View style={[
              styles.progressBar, 
              { 
                width: `${occupancyPercentage}%`,
                backgroundColor: isSaturated ? '#EF4444' : '#10B981' 
              }
            ]} />
          </View>
        </View>

        <InfoRow label="N° Abonnement" value={ticket.nAbonnement} />
        <InfoRow label="PBO" value={ticket.pbo} />
        
        <View style={{ flexDirection: 'row' }}>
          <View style={{ flex: 1 }}>
            <InfoRow label="Ports Libres (NPL)" value={freePorts} />
          </View>
          <View style={{ flex: 1 }}>
            <InfoRow label="Ports Occupés" value={occupiedPorts} />
          </View>
        </View>
        
        <InfoRow label="Distance" value={ticket.disn} />
        <InfoRow label="État des lieux" value={ticket.edl} />
      </View>

      <TouchableOpacity style={styles.btn} onPress={handleGoBack}>
        <Text style={{ color: 'white', fontWeight: 'bold' }}>RETOUR</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}