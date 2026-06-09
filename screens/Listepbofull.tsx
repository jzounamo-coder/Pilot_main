import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, Modal, ActivityIndicator, Platform, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

const PRIMARY_BLUE = '#1A237E';
const BACKGROUND_COLOR = '#F5F6FA';

export default function TicketsTraites() {
  const navigation = useNavigation<any>();
  
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('Tous'); 
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  // États pour le modal de détails du client
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const response = await fetch('https://control-api-dev.speedpro.cg/api/v1/pilot/pbo-full', {
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

      const formattedData = apiData.map((item: any) => {
        const pboObj = item.pbo || {};
        const pboString = typeof pboObj === 'string' ? pboObj : (pboObj.idPbo || pboObj.codePbo || item.codePbo || item.idPbo || item.pbo || '-');

        let arrondissementDetecte = '-';
        const projectCode = item.projectCode || pboObj.projectCode;
        if (projectCode && projectCode.includes('-')) {
          arrondissementDetecte = projectCode.split('-')[1]; 
        } else if (projectCode) {
          arrondissementDetecte = projectCode;
        } else if (item.arrondissement || pboObj.arrondissement) {
          arrondissementDetecte = item.arrondissement || pboObj.arrondissement;
        }

        return {
          id: item._id || item.id || Math.random().toString(),
          nomClient: item.nomClient || item.client || 'Client non renseigné',
          telephone: item.phoneNumber || item.telephone || item.phone || '-',
          isPboNomme: item.isPboNomme !== undefined ? item.isPboNomme : (!!item.pbo && !item.idDou),
          pbo: pboString,
          idDou: item.idDou || '-',
          arrondissement: arrondissementDetecte,
          date: item.createdAt
            ? new Date(item.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })
            : (item.date || '-'),
        };
      });

      setTickets(formattedData);
    } catch (error) {
      console.error("Erreur de récupération des PBO Full:", error);
      Alert.alert("Erreur", "Impossible de joindre le serveur.");
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchTickets();
    }, [])
  );

  const filteredData = tickets.filter(item => {
    if (selectedFilter === 'Nommé' && !item.isPboNomme) return false;
    if (selectedFilter === 'Non Nommé' && item.isPboNomme) return false;

    const query = searchQuery.toLowerCase().replace(/[\s-]/g, '');
    const nomClientClean = (item.nomClient || '').toLowerCase().replace(/[\s-]/g, '');
    const pboClean = (item.pbo || '').toLowerCase().replace(/[\s-]/g, '');
    const idDouClean = (item.idDou || '').toLowerCase().replace(/[\s-]/g, '');
    const telClean = (item.telephone || '').toLowerCase().replace(/[\s-]/g, '');

    return (
      nomClientClean.includes(query) ||
      pboClean.includes(query) ||
      idDouClean.includes(query) ||
      telClean.includes(query)
    );
  });

  const openDetailModal = (item: any) => {
    setSelectedTicket(item);
    setIsDetailModalOpen(true);
  };

  const renderItem = ({ item }: { item: any }) => (
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
          onPress={() => openDetailModal(item)}
        >
          <Ionicons name="eye-outline" size={14} color="white" />
          <Text style={styles.detailButtonText}>Voir détail</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
     
      
      {/* Barre de recherche avec Filtre intégré */}
      <View style={styles.searchSection}>
        <View style={styles.searchWrapper}>
          <Ionicons name="search" size={20} color="#999" />
          <TextInput
            style={styles.searchInput}
            placeholder="Rechercher un client, PBO, DOU..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <TouchableOpacity 
            style={{ padding: 5 }} 
            onPress={() => setIsFilterModalOpen(true)}
          >
            <Ionicons name="funnel" size={20} color={PRIMARY_BLUE} />
          </TouchableOpacity>
        </View>
      </View>

      {/* MODAL FILTRE */}
      <Modal visible={isFilterModalOpen} transparent={true} animationType="fade" onRequestClose={() => setIsFilterModalOpen(false)}>
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setIsFilterModalOpen(false)}>
          <View style={styles.modalContent} onStartShouldSetResponder={() => true}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Filtrer la liste</Text>
              <TouchableOpacity onPress={() => setIsFilterModalOpen(false)}>
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>
            {['Tous', 'Nommé', 'Non Nommé'].map((option) => (
              <TouchableOpacity
                key={option}
                style={[styles.dropdownItem, selectedFilter === option && { backgroundColor: '#F0F2FF' }]}
                onPress={() => { setSelectedFilter(option); setIsFilterModalOpen(false); }}
              >
                <Text style={selectedFilter === option ? styles.itemTextActive : styles.itemText}>
                  {option === 'Tous' ? 'Afficher tout' : option === 'Nommé' ? 'PBO Nommés' : 'DOU (Non Nommés)'}
                </Text>
                {selectedFilter === option && <Ionicons name="checkmark" size={18} color={PRIMARY_BLUE} />}
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>

      {/* MODAL DÉTAIL CLIENT */}
      <Modal visible={isDetailModalOpen} transparent={true} animationType="slide" onRequestClose={() => setIsDetailModalOpen(false)}>
        <View style={styles.detailModalOverlay}>
          <View style={styles.detailModalContainer}>
            <View style={styles.detailModalHeader}>
              <View>
                <Text style={styles.detailModalTitle}>Détails du Client</Text>
                <Text style={styles.detailModalSubtitle}>Fiche d'intervention enregistrée</Text>
              </View>
              <TouchableOpacity onPress={() => setIsDetailModalOpen(false)} style={styles.detailCloseBtn}>
                <Ionicons name="close" size={22} color="#333" />
              </TouchableOpacity>
            </View>
            <View style={styles.clientDetailCard}>
              <View style={styles.clientDetailHeader}>
                <View style={styles.clientDetailAvatar}>
                  <Text style={styles.clientDetailAvatarText}>
                    {selectedTicket?.nomClient ? selectedTicket.nomClient[0].toUpperCase() : '?'}
                  </Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.clientDetailNom}>{selectedTicket?.nomClient}</Text>
                  <Text style={styles.clientDetailSub}>{selectedTicket?.isPboNomme ? 'Équipement PBO validé' : 'Équipement DOU validé'}</Text>
                </View>
              </View>
              <View style={styles.clientDetailDivider} />
              <View style={styles.clientDetailRow}>
                <Ionicons name="call-outline" size={16} color="#666" style={{ width: 24 }} />
                <Text style={styles.clientDetailVal}>{selectedTicket?.telephone}</Text>
              </View>
              <View style={styles.clientDetailRow}>
                <Ionicons name="git-network-outline" size={16} color="#666" style={{ width: 24 }} />
                <Text style={styles.clientDetailVal}>
                  <Text style={{ fontWeight: '600' }}>{selectedTicket?.isPboNomme ? 'Code PBO : ' : 'ID DOU : '}</Text>
                  {selectedTicket?.isPboNomme ? selectedTicket?.pbo : selectedTicket?.idDou}
                </Text>
              </View>
              <View style={styles.clientDetailRow}>
                <Ionicons name="business-outline" size={16} color="#666" style={{ width: 24 }} />
                <Text style={styles.clientDetailVal}>
                  <Text style={{ fontWeight: '600' }}>Arrondissement : </Text>{selectedTicket?.arrondissement}
                </Text>
              </View>
              <View style={styles.clientDetailRow}>
                <Ionicons name="calendar-outline" size={16} color="#666" style={{ width: 24 }} />
                <Text style={styles.clientDetailVal}>
                  <Text style={{ fontWeight: '600' }}>Date de clôture : </Text>Le {selectedTicket?.date}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </Modal>

      {loading && tickets.length === 0 ? (
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
          onRefresh={fetchTickets}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="alert-circle-outline" size={50} color="#ccc" />
              <Text style={{ textAlign: 'center', color: '#888', marginTop: 10 }}>Aucun enregistrement trouvé</Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BACKGROUND_COLOR },
  header: { backgroundColor: PRIMARY_BLUE, paddingTop: Platform.OS === 'ios' ? 30 : 25, paddingBottom: 12, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
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
  clientInfo: { flexDirection: 'row', alignItems: 'center', flex: 1 },
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
  cardFooter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 12 },
  dateText: { fontSize: 11, color: '#999', marginLeft: 4 },
  emptyContainer: { alignItems: 'center', justifyContent: 'center', marginTop: 40 },
  detailButton: { flexDirection: 'row', backgroundColor: PRIMARY_BLUE, paddingVertical: 6, paddingHorizontal: 12, borderRadius: 8, alignItems: 'center' },
  detailButtonText: { color: 'white', marginLeft: 4, fontSize: 12, fontWeight: 'bold' },
  detailModalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  detailModalContainer: { backgroundColor: 'white', borderTopLeftRadius: 24, borderTopRightRadius: 24, paddingTop: 20, paddingBottom: Platform.OS === 'ios' ? 40 : 24, maxHeight: '80%' },
  detailModalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingBottom: 14, borderBottomWidth: 1, borderColor: '#EFEFEF' },
  detailModalTitle: { fontSize: 16, fontWeight: 'bold', color: PRIMARY_BLUE },
  detailModalSubtitle: { fontSize: 12, color: '#888', marginTop: 2 },
  detailCloseBtn: { padding: 6, backgroundColor: '#F5F6FA', borderRadius: 10 },
  clientDetailCard: { marginHorizontal: 16, marginTop: 16, backgroundColor: 'white', borderRadius: 14, padding: 16, borderWidth: 1, borderColor: '#EAEAEA', borderLeftWidth: 4, borderLeftColor: PRIMARY_BLUE, elevation: 1 },
  clientDetailHeader: { flexDirection: 'row', alignItems: 'center' },
  clientDetailAvatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#E8EAF6', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  clientDetailAvatarText: { color: PRIMARY_BLUE, fontWeight: 'bold', fontSize: 16 },
  clientDetailNom: { fontSize: 15, fontWeight: 'bold', color: '#111' },
  clientDetailSub: { fontSize: 12, color: '#888', fontStyle: 'italic', marginTop: 2 },
  clientDetailDivider: { height: 1, backgroundColor: '#F5F5F5', marginVertical: 12 },
  clientDetailRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  clientDetailVal: { marginLeft: 4, fontSize: 13, color: '#444', flex: 1 },
});