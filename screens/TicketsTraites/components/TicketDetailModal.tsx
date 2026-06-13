import React from 'react';
import { View, Text, Modal, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Ticket } from '../ticketsTraites.hooks';
import { styles } from '../ticketsTraites.style';

interface TicketDetailModalProps {
  visible: boolean;
  ticket: Ticket | null;
  onClose: () => void;
}

export function TicketDetailModal({ visible, ticket, onClose }: TicketDetailModalProps) {
  return (
    <Modal visible={visible} transparent={true} animationType="slide" onRequestClose={onClose}>
      <View style={styles.detailModalOverlay}>
        <View style={styles.detailModalContainer}>
          <View style={styles.detailModalHeader}>
            <View>
              <Text style={styles.detailModalTitle}>Détails du Client</Text>
              <Text style={styles.detailModalSubtitle}>Fiche d'intervention enregistrée</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.detailCloseBtn}>
              <Ionicons name="close" size={22} color="#333" />
            </TouchableOpacity>
          </View>
          <View style={styles.clientDetailCard}>
            <View style={styles.clientDetailHeader}>
              <View style={styles.clientDetailAvatar}>
                <Text style={styles.clientDetailAvatarText}>
                  {ticket?.nomClient ? ticket.nomClient[0].toUpperCase() : '?'}
                </Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.clientDetailNom}>{ticket?.nomClient}</Text>
                <Text style={styles.clientDetailSub}>
                  {ticket?.isPboNomme ? 'Équipement PBO validé' : 'Équipement DOU validé'}
                </Text>
              </View>
            </View>
            <View style={styles.clientDetailDivider} />
            <View style={styles.clientDetailRow}>
              <Ionicons name="call-outline" size={16} color="#666" style={{ width: 24 }} />
              <Text style={styles.clientDetailVal}>{ticket?.telephone}</Text>
            </View>
            <View style={styles.clientDetailRow}>
              <Ionicons name="git-network-outline" size={16} color="#666" style={{ width: 24 }} />
              <Text style={styles.clientDetailVal}>
                <Text style={{ fontWeight: '600' }}>{ticket?.isPboNomme ? 'Code PBO : ' : 'ID DOU : '}</Text>
                {ticket?.isPboNomme ? ticket?.pbo : ticket?.idDou}
              </Text>
            </View>
            <View style={styles.clientDetailRow}>
              <Ionicons name="business-outline" size={16} color="#666" style={{ width: 24 }} />
              <Text style={styles.clientDetailVal}>
                <Text style={{ fontWeight: '600' }}>Arrondissement : </Text>{ticket?.arrondissement}
              </Text>
            </View>
            <View style={styles.clientDetailRow}>
              <Ionicons name="calendar-outline" size={16} color="#666" style={{ width: 24 }} />
              <Text style={styles.clientDetailVal}>
                <Text style={{ fontWeight: '600' }}>Date de clôture : </Text>Le {ticket?.date}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}