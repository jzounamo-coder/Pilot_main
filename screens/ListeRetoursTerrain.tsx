import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, Modal, ActivityIndicator, Platform, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

const PRIMARY_BLUE = '#1A237E';
const BACKGROUND_COLOR = '#F5F6FA';

export default function ListeRetoursTerrain() {
  const navigation = useNavigation<any>();
  
  const [retours, setRetours] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('Tous'); 
  const [isModalOpen, setIsModalOpen] = useState(false);

  // État pour le modal de détail client
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const fetchRetoursTerrain = async () => {
    try {
      setLoading(true);
      const response = await fetch('https://control-api-dev.speedpro.cg/api/v1/pilot/saturation', {
        method: 'GET',
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' }
      }); 
      
      const textData = await response.text();

      if (!response.ok) {
        console.error(`[Erreur Serveur ${response.status}]`, textData);
        Alert.alert("Erreur Serveur", `Le serveur a répondu avec le statut ${response.status}.`);
        return;
      }

      let json;
      try {
        json = JSON.parse(textData);
      } catch (e) {
        Alert.alert("Erreur de format", "La réponse du serveur ne correspond pas au format JSON attendu.");
        return;
      }
      
      let apiData: any[] = [];
      if (json.data) {
        apiData = Array.isArray(json.data) ? json.data : [json.data];
      } else {
        apiData = Array.isArray(json) ? json : [];
      }

      // Formatage basé sur la vraie structure API :
      // item.clients[n].name, item.clients[n].firstName, item.clients[n].phoneNumber
      // item.pbo.idPbo, item.pbo.codePbo
      const formattedData = apiData.map((item: any) => {

        // Infos PBO depuis item.pbo (objet imbriqué) ou racine
        const pboObj = item.pbo || {};
        const pboString = pboObj.idPbo || pboObj.codePbo || item.codePbo || item.idPbo || item.code || '-';
        const pboId = pboObj._id || item.pbo || null;

        // Tous les clients du port
        const clientsRaw = item.clients || [];

        // Premier client pour affichage dans la carte
        const premierClient = clientsRaw.length > 0 ? clientsRaw[0] : null;

        const nomAffiche = premierClient
          ? `${premierClient.name || ''} ${premierClient.firstName || ''}`.trim() || 'Client sans nom'
          : 'Aucun client';

        const telAffiche = premierClient
          ? premierClient.phoneNumber || premierClient.telephone || '-'
          : '-';

        const abonnementAffiche = premierClient
          ? premierClient.loginID || premierClient.numAbonnement || '-'
          : '-';

        return {
          id: item._id || item.id || Math.random().toString(),
          slug: item.slug || '',
          // Infos résumé carte
          nomClient: nomAffiche,
          telephone: telAffiche,
          numAbonnement: abonnementAffiche,
          isPboNomme: item.isPboNomme !== undefined ? item.isPboNomme : (!!pboObj.idPbo || !!pboObj.codePbo),
          pbo: pboString,
          pboId: pboId,
          idDou: item.idDou || null,
          date: item.createdAt
            ? new Date(item.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })
            : (item.date || '-'),
          // Tous les clients pour le modal détail
          clients: clientsRaw.map((c: any) => ({
            id: c._id || Math.random().toString(),
            nom: `${c.name || ''} ${c.firstName || ''}`.trim() || 'Inconnu',
            telephone: c.phoneNumber || c.telephone || '-',
            loginID: c.loginID || c.numAbonnement || '-',
            adresse: c.address || '-',
            quartier: c.quarter || '-',
            arrondissement: c.district || '-',
            ville: c.city || '-',
            position: c.position !== undefined ? `Port ${String(c.position).padStart(2, '0')}` : '-',
          })),
          // Stats ports
          portsOccupes: item.pboNumberUsedPort || 0,
          portsLibres: item.pboNumberFreePort || 0,
          portsTotal: item.pboNumberTotalPort || 16,
        };
      });

      setRetours(formattedData);
    } catch (error) {
      console.error("Erreur de récupération des retours terrain:", error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchRetoursTerrain();
    }, [])
  );

  const filteredData = retours.filter(item => {
    if (selectedFilter === 'Nommé' && !item.isPboNomme) return false;
    if (selectedFilter === 'Non Nommé' && item.isPboNomme) return false;

    const query = searchQuery.toLowerCase().replace(/[\s-]/g, '');
    const nomClientClean = (item.nomClient || '').toLowerCase().replace(/[\s-]/g, '');
    const numAbonnementClean = (item.numAbonnement || '').toLowerCase().replace(/[\s-]/g, '');
    const pboClean = (item.pbo || '').toLowerCase().replace(/[\s-]/g, '');
    const idDouClean = (item.idDou || '').toLowerCase().replace(/[\s-]/g, '');

    return (
      nomClientClean.includes(query) ||
      numAbonnementClean.includes(query) ||
      pboClean.includes(query) ||
      idDouClean.includes(query)
    );
  });

  const openDetail = (item: any) => {
    setSelectedItem(item);
    setIsDetailModalOpen(true);
  };

  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity style={styles.card} onPress={() => openDetail(item)} activeOpacity={0.8}>
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

  return (
    <View style={styles.container}>
      
      {/* HEADER */}
      <View style={styles.header}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Retours Terrain</Text>
          {selectedFilter !== 'Tous' && (
            <Text style={styles.filterSubtitle}> ({selectedFilter})</Text>
          )}
        </View>
        <TouchableOpacity style={styles.filterButton} onPress={() => setIsModalOpen(true)}>
          <Ionicons name="funnel" size={20} color="white" />
        </TouchableOpacity>
      </View>

      {/* Barre de recherche */}
      <View style={styles.searchSection}>
        <View style={styles.searchWrapper}>
          <Ionicons name="search" size={20} color="#999" />
          <TextInput
            style={styles.searchInput}
            placeholder="Rechercher un client, abonnement, PBO..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {/* MODAL FILTRE */}
      <Modal visible={isModalOpen} transparent={true} animationType="fade" onRequestClose={() => setIsModalOpen(false)}>
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setIsModalOpen(false)}>
          <View style={styles.modalContent} onStartShouldSetResponder={() => true}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Filtrer les retours</Text>
              <TouchableOpacity onPress={() => setIsModalOpen(false)}>
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>
            {['Tous', 'Nommé', 'Non Nommé'].map((option) => (
              <TouchableOpacity
                key={option}
                style={[styles.dropdownItem, selectedFilter === option && { backgroundColor: '#F0F2FF' }]}
                onPress={() => { setSelectedFilter(option); setIsModalOpen(false); }}
              >
                <Text style={selectedFilter === option ? styles.itemTextActive : styles.itemText}>
                  {option === 'Tous' ? 'Afficher tout' : `PBO ${option}s`}
                </Text>
                {selectedFilter === option && <Ionicons name="checkmark" size={18} color={PRIMARY_BLUE} />}
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>

      {/* MODAL DÉTAIL CLIENTS DU PBO */}
      <Modal visible={isDetailModalOpen} transparent={true} animationType="slide" onRequestClose={() => setIsDetailModalOpen(false)}>
        <View style={styles.detailModalOverlay}>
          <View style={styles.detailModalContainer}>
            
            {/* Header modal détail */}
            <View style={styles.detailModalHeader}>
              <View>
                <Text style={styles.detailModalTitle}>{selectedItem?.pbo || 'Détails PBO'}</Text>
                <Text style={styles.detailModalSubtitle}>
                  {selectedItem?.clients?.length || 0} client(s) enregistré(s)
                </Text>
              </View>
              <TouchableOpacity onPress={() => setIsDetailModalOpen(false)} style={styles.detailCloseBtn}>
                <Ionicons name="close" size={22} color="#333" />
              </TouchableOpacity>
            </View>

            {/* Stats ports */}
            <View style={styles.detailStatsRow}>
              <View style={[styles.detailStatBadge, { backgroundColor: '#E8F5E9' }]}>
                <Text style={[styles.detailStatVal, { color: '#2E7D32' }]}>{selectedItem?.portsLibres}</Text>
                <Text style={[styles.detailStatLabel, { color: '#2E7D32' }]}>Libres</Text>
              </View>
              <View style={[styles.detailStatBadge, { backgroundColor: '#FFEBEE' }]}>
                <Text style={[styles.detailStatVal, { color: '#C62828' }]}>{selectedItem?.portsOccupes}</Text>
                <Text style={[styles.detailStatLabel, { color: '#C62828' }]}>Occupés</Text>
              </View>
              <View style={[styles.detailStatBadge, { backgroundColor: '#E8EAF6' }]}>
                <Text style={[styles.detailStatVal, { color: PRIMARY_BLUE }]}>{selectedItem?.portsTotal}</Text>
                <Text style={[styles.detailStatLabel, { color: PRIMARY_BLUE }]}>Total</Text>
              </View>
            </View>

            {/* Liste des clients */}
            {selectedItem?.clients?.length === 0 ? (
              <View style={styles.emptyClients}>
                <Ionicons name="people-outline" size={40} color="#CCC" />
                <Text style={styles.emptyClientsText}>Aucun client enregistré sur ce PBO</Text>
              </View>
            ) : (
              <FlatList
                data={selectedItem?.clients || []}
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

      {/* Liste principale */}
      {loading && retours.length === 0 ? (
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <ActivityIndicator size="large" color={PRIMARY_BLUE} />
        </View>
      ) : (
        <FlatList
          data={filteredData}
          keyExtractor={(item) => item.id?.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.listContainer}
          refreshing={loading}
          onRefresh={fetchRetoursTerrain}
          ListEmptyComponent={
            <Text style={{ textAlign: 'center', color: '#888', marginTop: 40 }}>Aucun retour trouvé</Text>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BACKGROUND_COLOR },
  header: { backgroundColor: PRIMARY_BLUE, paddingTop: Platform.OS === 'ios' ? 45 : 25, paddingBottom: 12, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  backBtn: { marginRight: 12 },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: 'white' },
  filterSubtitle: { fontSize: 14, color: '#E0E2FF', fontWeight: '500' },
  filterButton: { padding: 6, backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 8 },
  searchSection: { paddingHorizontal: 16, paddingTop: 12, paddingBottom: 4 },
  searchWrapper: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', borderRadius: 12, paddingHorizontal: 12, height: 46, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1 },
  searchInput: { flex: 1, marginLeft: 10, fontSize: 14 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.4)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  modalContent: { width: '90%', backgroundColor: 'white', borderRadius: 16, padding: 16, elevation: 10 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  modalTitle: { fontSize: 18, fontWeight: 'bold', color: PRIMARY_BLUE },
  dropdownItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 14, borderRadius: 8, borderBottomWidth: 1, borderBottomColor: '#f3f4f6' },
  itemText: { fontSize: 15, color: '#333' },
  itemTextActive: { fontSize: 15, color: PRIMARY_BLUE, fontWeight: 'bold' },
  listContainer: { paddingHorizontal: 16, paddingTop: 10, paddingBottom: 30 },
  card: { backgroundColor: 'white', borderRadius: 12, padding: 16, marginBottom: 12, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  clientInfo: { flexDirection: 'row', alignItems: 'center' },
  iconCircle: { width: 36, height: 36, borderRadius: 18, backgroundColor: PRIMARY_BLUE, justifyContent: 'center', alignItems: 'center', marginRight: 10 },
  clientNom: { fontSize: 15, fontWeight: 'bold', color: '#111' },
  clientTel: { fontSize: 12, color: '#666' },
  badge: { paddingVertical: 4, paddingHorizontal: 8, borderRadius: 6 },
  badgeNomme: { backgroundColor: '#E8F5E9' },
  badgeNonNomme: { backgroundColor: '#FFF3E0' },
  badgeText: { fontSize: 10, fontWeight: 'bold' },
  badgeTextNomme: { color: '#2E7D32' },
  badgeTextNonNomme: { color: '#E65100' },
  cardBody: { backgroundColor: '#F9FAFB', padding: 12, borderRadius: 8 },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4, alignItems: 'center' },
  infoLabel: { fontSize: 12, color: '#888' },
  infoValue: { fontSize: 12, fontWeight: '600' },
  highlightValue: { fontSize: 12, fontWeight: 'bold', color: PRIMARY_BLUE },
  cardFooter: { flexDirection: 'row', alignItems: 'center', marginTop: 12 },
  dateText: { fontSize: 11, color: '#999', marginLeft: 4 },

  // Stats mini dans la carte
  statMini: { alignItems: 'center', marginRight: 12 },
  statMiniVal: { fontSize: 14, fontWeight: 'bold' },
  statMiniLabel: { fontSize: 10, color: '#888' },

  // Modal détail
  detailModalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  detailModalContainer: { backgroundColor: 'white', borderTopLeftRadius: 24, borderTopRightRadius: 24, paddingTop: 20, maxHeight: '85%' },
  detailModalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingBottom: 14, borderBottomWidth: 1, borderColor: '#EFEFEF' },
  detailModalTitle: { fontSize: 16, fontWeight: 'bold', color: PRIMARY_BLUE },
  detailModalSubtitle: { fontSize: 12, color: '#888', marginTop: 2 },
  detailCloseBtn: { padding: 6, backgroundColor: '#F5F6FA', borderRadius: 10 },
  detailStatsRow: { flexDirection: 'row', justifyContent: 'space-between', padding: 16, borderBottomWidth: 1, borderColor: '#F0F0F0' },
  detailStatBadge: { flex: 1, borderRadius: 10, paddingVertical: 8, alignItems: 'center', marginHorizontal: 4 },
  detailStatVal: { fontSize: 18, fontWeight: 'bold' },
  detailStatLabel: { fontSize: 11, fontWeight: '600', marginTop: 2 },
  emptyClients: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 40 },
  emptyClientsText: { color: '#999', marginTop: 12, fontSize: 14 },

  // Carte client dans le modal détail
  clientDetailCard: { marginHorizontal: 16, marginTop: 12, backgroundColor: 'white', borderRadius: 14, padding: 14, borderWidth: 1, borderColor: '#EAEAEA', borderLeftWidth: 4, borderLeftColor: PRIMARY_BLUE, elevation: 1 },
  clientDetailHeader: { flexDirection: 'row', alignItems: 'center' },
  clientDetailAvatar: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#E8EAF6', justifyContent: 'center', alignItems: 'center', marginRight: 10 },
  clientDetailAvatarText: { color: PRIMARY_BLUE, fontWeight: 'bold', fontSize: 14 },
  clientDetailNom: { fontSize: 14, fontWeight: 'bold', color: '#111' },
  clientDetailPosition: { fontSize: 11, color: '#888', fontStyle: 'italic' },
  clientIndexBadge: { backgroundColor: '#E8EAF6', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  clientIndexText: { fontSize: 11, color: PRIMARY_BLUE, fontWeight: 'bold' },
  clientDetailDivider: { height: 1, backgroundColor: '#F5F5F5', marginVertical: 10 },
  clientDetailRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  clientDetailVal: { marginLeft: 8, fontSize: 13, color: '#444', flex: 1 },
});
