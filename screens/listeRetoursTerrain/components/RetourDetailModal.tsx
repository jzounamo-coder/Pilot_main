import React from 'react';
import { View, Text, Modal, TouchableOpacity, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { RetourItem } from '../listeRetoursTerrain.hooks';
import { styles, PRIMARY_BLUE } from '../listeRetoursTerrain.style';

interface RetourDetailModalProps {
  isOpen: boolean;
  item: RetourItem | null;
  onClose: () => void;
}

export function RetourDetailModal({ isOpen, item, onClose }: RetourDetailModalProps) {
  return (
    <Modal visible={isOpen} transparent={true} animationType="slide" onRequestClose={onClose}>
      <View style={styles.detailModalOverlay}>
        <View style={styles.detailModalContainer}>
          
          {/* Header modal détail */}
          <View style={styles.detailModalHeader}>
            <View>
              <Text style={styles.detailModalTitle}>{item?.pbo || 'Détails PBO'}</Text>
              <Text style={styles.detailModalSubtitle}>
                {item?.clients?.length || 0} client(s) enregistré(s)
              </Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.detailCloseBtn}>
              <Ionicons name="close" size={22} color="#333" />
            </TouchableOpacity>
          </View>

          {/* Stats ports */}
          <View style={styles.detailStatsRow}>
            <View style={[styles.detailStatBadge, { backgroundColor: '#E8F5E9' }]}>
              <Text style={[styles.detailStatVal, { color: '#2E7D32' }]}>{item?.portsLibres}</Text>
              <Text style={[styles.detailStatLabel, { color: '#2E7D32' }]}>Libres</Text>
            </View>
            <View style={[styles.detailStatBadge, { backgroundColor: '#FFEBEE' }]}>
              <Text style={[styles.detailStatVal, { color: '#C62828' }]}>{item?.portsOccupes}</Text>
              <Text style={[styles.detailStatLabel, { color: '#C62828' }]}>Occupés</Text>
            </View>
            <View style={[styles.detailStatBadge, { backgroundColor: '#E8EAF6' }]}>
              <Text style={[styles.detailStatVal, { color: PRIMARY_BLUE }]}>{item?.portsTotal}</Text>
              <Text style={[styles.detailStatLabel, { color: PRIMARY_BLUE }]}>Total</Text>
            </View>
          </View>

          {/* Liste des clients */}
          {item?.clients?.length === 0 ? (
            <View style={styles.emptyClients}>
              <Ionicons name="people-outline" size={40} color="#CCC" />
              <Text style={styles.emptyClientsText}>Aucun client enregistré sur ce PBO</Text>
            </View>
          ) : (
            <FlatList
              data={item?.clients || []}
              keyExtractor={(c) => c.id}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 20 }}
              renderItem={({ item: client, index }) => (
                <View style={styles.clientDetailCard}>
                  {/* En-tête client */}
                  <View style={styles.clientDetailHeader}>
                    <View style={styles.clientDetailAvatar}>
                      <Text style={styles.clientDetailAvatarText}>
                        {client.nom ? client.nom[0].toUpperCase() : '?'}
                      </Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.clientDetailNom}>{client.nom}</Text>
                      <Text style={styles.clientDetailPosition}>{client.position}</Text>
                    </View>
                    <View style={styles.clientIndexBadge}>
                      <Text style={styles.clientIndexText}>#{index + 1}</Text>
                    </View>
                  </View>

                  {/* Infos client */}
                  <View style={styles.clientDetailDivider} />
                  
                  <View style={styles.clientDetailRow}>
                    <Ionicons name="call-outline" size={15} color="#666" />
                    <Text style={styles.clientDetailVal}>{client.telephone}</Text>
                  </View>

                  {client.loginID !== '-' && (
                    <View style={styles.clientDetailRow}>
                      <Ionicons name="card-outline" size={15} color="#666" />
                      <Text style={styles.clientDetailVal}>
                        <Text style={{ fontWeight: '600' }}>N° Abn : </Text>{client.loginID}
                      </Text>
                    </View>
                  )}

                  {client.arrondissement !== '-' && (
                    <View style={styles.clientDetailRow}>
                      <Ionicons name="business-outline" size={15} color="#666" />
                      <Text style={styles.clientDetailVal}>
                        <Text style={{ fontWeight: '600' }}>Arrondissement : </Text>{client.arrondissement}
                      </Text>
                    </View>
                  )}

                  {client.quartier !== '-' && (
                    <View style={styles.clientDetailRow}>
                      <Ionicons name="location-outline" size={15} color="#666" />
                      <Text style={styles.clientDetailVal}>
                        {client.quartier}{client.adresse !== '-' ? `, ${client.adresse}` : ''}
                      </Text>
                    </View>
                  )}

                  {client.ville !== '-' && (
                    <View style={styles.clientDetailRow}>
                      <Ionicons name="map-outline" size={15} color="#666" />
                      <Text style={styles.clientDetailVal}>{client.ville}</Text>
                    </View>
                  )}
                </View>
              )}
            />
          )}
        </View>
      </View>
    </Modal>
  );
}