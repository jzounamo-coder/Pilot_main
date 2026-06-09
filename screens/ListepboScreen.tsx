import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator, ScrollView, Modal, TextInput, Platform } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons'; 
import { useNavigation } from '@react-navigation/native';
import tw from 'tailwind-react-native-classnames';

const PRIMARY_BLUE = '#1A237E';

export default function TabTwoScreen() {
  const navigation = useNavigation<any>();
  const [pbos, setPbos] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [isFull, setIsFull] = useState(false);

  // ÉTATS POUR LE FILTRE MODAL 
  const [selectedCity, setSelectedCity] = useState('Tous');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchCityQuery, setSearchCityQuery] = useState(''); 

  // ÉTAT POUR LA RECHERCHE PAR ID PBO
  const [searchIdQuery, setSearchIdQuery] = useState('');

  // Extraire les villes uniques pour le menu
  const cities = ['Tous', ...new Set(pbos.map(pbo => pbo.localisation))];

  // Filtrer les villes affichées dans le modal selon la saisie de l'utilisateur
  const filteredCitiesInModal = cities.filter(city => 
    city.toLowerCase().includes(searchCityQuery.toLowerCase())
  );

  const fetchPbos = async (pageNumber: number) => {
    if (loading || isFull) return;

    try {
      if (pageNumber === 1) setLoading(true);
      
      const response = await fetch(`https://control-api-dev.speedpro.cg/api/v1/ftth/pbo`);
      const json = await response.json();
      
      const apiData = json.data || (Array.isArray(json) ? json : []); 

      if (apiData.length === 0) {
        setIsFull(true);
        return;
      }

      const formattedData = apiData.map((item: any) => {
    
        const total = parseInt(item.pboNumberTotalPort) || 16;
        const libres = parseInt(item.pboNumberFreePort) || 0;
        const occupes = total - libres; 

        return {
          id: item._id, 
          nomPbo: item.idPbo || item.codePbo || 'Sans ID',
          nbPbo: total, 
          portsDispos: libres,
          portsOccupes: occupes, 
          localisation: item.ville || 'Congo', 
          dateMaj: item.updatedAt ? new Date(item.updatedAt).toLocaleDateString() : '17/03/2026',
          
          // AJOUT DE L'ARRONDISSEMENT 
          arrondissement: item.arrondissement || item.district || 'Non renseigné',
          
          // Infos pour le détail
          codePbo: item.codePbo,
          idPbo: item.idPbo, 
          pboNumberTotalPort: item.pboNumberTotalPort,
          pboNumberFreePort: item.pboNumberFreePort,
          oltPort1: item.oltPort1,
          pdz: item.pdz,
          ville: item.ville,
          lat: item.lat,
          lng: item.lng,
          clients: item.clients || []
        };
      });

      setPbos(prev => pageNumber === 1 ? formattedData : [...prev, ...formattedData]);
    } catch (error) {
      console.error("Erreur API PBO:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPbos(1);
  }, []);

  const loadMore = () => {
    if (!loading && !isFull) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchPbos(nextPage);
    }
  };

  // LOGIQUE DE FILTRAGE DES PBO (VILLE + ID PBO COMBINÉS)
  const filteredPbos = pbos.filter(item => {
    // 1. Vérification du filtre par Ville
    const matchesCity = selectedCity === 'Tous' || item.localisation === selectedCity;
    
    // 2. Vérification de la recherche par ID PBO
    const query = searchIdQuery.toLowerCase().trim();
    const matchesId = 
      item.nomPbo.toLowerCase().includes(query) ||
      (item.idPbo && item.idPbo.toLowerCase().includes(query)) ||
      (item.codePbo && item.codePbo.toLowerCase().includes(query));

    // Le PBO doit valider les deux critères
    return matchesCity && matchesId;
  });

  const renderPbo = useCallback(({ item }: any) => (
    <TouchableOpacity 
      style={styles.pboCard} 
      onPress={() => navigation.navigate('PboDetail', { pbo: item })}
    >
      <View style={styles.iconContainer}>
        <MaterialCommunityIcons name="package-variant-closed" size={32} color={PRIMARY_BLUE} />
      </View>
      
      <View style={styles.pboContent}>
        <View style={styles.pboHeader}>
          <Text style={styles.pboTitle} numberOfLines={1}>{item.nomPbo}</Text>
          <Text style={styles.pboDate}>{item.dateMaj}</Text>
        </View>
        
        <Text style={styles.pboLoc}>{item.localisation} {item.arrondissement !== 'Non renseigné' ? `- ${item.arrondissement}` : ''}</Text>
        
        <View style={styles.pboFooter}>
          <View style={[styles.badge, { backgroundColor: item.portsOccupes >= item.nbPbo ? '#FEE2E2' : '#F0F0F0' }]}>
            <Text style={[styles.badgeText, { color: item.portsOccupes >= item.nbPbo ? '#EF4444' : '#666' }]}>
              OCCUPÉS: {item.portsOccupes}
            </Text>
          </View>

          <View style={[styles.badge, { backgroundColor: '#E7F3F0' }]}>
            <Text style={[styles.badgeText, { color: PRIMARY_BLUE }]}>
              LIBRES: {item.portsDispos}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  ), [navigation]);

  return (
    <View style={tw`flex-1 bg-gray-100`}>
      
      {/* ── HEADER PREMIUM UNIFIÉ ── */}
      <View style={styles.headerContainer}>
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerSubtitle}>suivi infrastructures</Text>
          <Text style={styles.headerTitle}>Liste des PBO</Text>
          {selectedCity !== 'Tous' && (
            <Text style={styles.headerFilterText}>Filtre actif : {selectedCity}</Text>
          )}
        </View>
        <TouchableOpacity style={styles.filterButton} onPress={() => setIsModalOpen(true)} activeOpacity={0.8}>
          <Ionicons name="funnel" size={22} color={PRIMARY_BLUE} />
        </TouchableOpacity>
      </View>

      {/* BARRE DE RECHERCHE GLOBALE PAR ID PBO */}
      <View style={styles.mainSearchContainer}>
        <Ionicons name="search" size={20} color="#666" style={{ marginRight: 8 }} />
        <TextInput
          style={styles.mainSearchInput}
          placeholder="Rechercher par ID PBO (ex: PB7384)..."
          value={searchIdQuery}
          onChangeText={setSearchIdQuery}
          autoCapitalize="characters"
          clearButtonMode="while-editing"
        />
        {searchIdQuery !== '' && (
          <TouchableOpacity onPress={() => setSearchIdQuery('')}>
            <Ionicons name="close-circle" size={20} color="#888" />
          </TouchableOpacity>
        )}
      </View>

      {/* MODAL DE FILTRAGE PAR VILLE */}
      <Modal
        visible={isModalOpen}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsModalOpen(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay} 
          activeOpacity={1} 
          onPress={() => setIsModalOpen(false)}
        >
          <View style={styles.modalContent} onStartShouldSetResponder={() => true}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Filtrer par Ville</Text>
              <TouchableOpacity onPress={() => setIsModalOpen(false)}>
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            {/* Champ de recherche pour taper la ville */}
            <View style={styles.searchContainer}>
              <Ionicons name="search" size={18} color="#666" style={{ marginRight: 8 }} />
              <TextInput
                style={styles.searchInput}
                placeholder="Rechercher ou taper une ville..."
                value={searchCityQuery}
                onChangeText={setSearchCityQuery}
                clearButtonMode="while-editing"
              />
            </View>

            {/* Liste des villes trouvées */}
            <ScrollView style={{ maxHeight: 250 }} keyboardShouldPersistTaps="handled">
              {filteredCitiesInModal.length === 0 ? (
                <Text style={styles.emptyText}>Aucune ville trouvée</Text>
              ) : (
                filteredCitiesInModal.map((city) => (
                  <TouchableOpacity 
                    key={city} 
                    style={[
                      styles.dropdownItem,
                      selectedCity === city && { backgroundColor: '#F0F2FF' }
                    ]} 
                    onPress={() => {
                      setSelectedCity(city);
                      setSearchCityQuery(''); 
                      setIsModalOpen(false); 
                    }}
                  >
                    <Text style={selectedCity === city ? styles.itemTextActive : styles.itemText}>
                      {city}
                    </Text>
                    {selectedCity === city && (
                      <Ionicons name="checkmark" size={18} color={PRIMARY_BLUE} />
                    )}
                  </TouchableOpacity>
                ))
              )}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>

      {loading && page === 1 ? (
        <View style={{flex: 1, justifyContent: 'center'}}>
          <ActivityIndicator size="large" color={PRIMARY_BLUE} />
        </View>
      ) : (
        <FlatList 
          data={filteredPbos} 
          keyExtractor={(item, index) => item.id + index} 
          renderItem={renderPbo}
          onEndReached={loadMore}
          onEndReachedThreshold={0.5}
          contentContainerStyle={{ paddingVertical: 10 }}
          ListEmptyComponent={
            !loading ? <Text style={styles.emptyText}>Aucun PBO trouvé</Text> : null
          }
          ListFooterComponent={loading ? <ActivityIndicator size="small" color={PRIMARY_BLUE} style={{margin: 10}} /> : null}
        />
      )}

      <TouchableOpacity style={styles.fabMap} onPress={() => navigation.navigate('Map')}>
        <Ionicons name="location" size={30} color="white" />
      </TouchableOpacity>

      <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate('PboForm')}>
        <Ionicons name="add" size={35} color="white" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  /* ── DESIGN NOUVEAU HEADER PREMIUM UNIFIÉ ── */
  headerContainer: {
    backgroundColor: PRIMARY_BLUE,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 20 : 40,
    paddingBottom: 20,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    marginBottom: 15,
  },
  headerTextContainer: {
    flex: 1,
  },
  headerSubtitle: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 12,
    textTransform: 'uppercase',
    fontWeight: '600',
    letterSpacing: 0.8,
  },
  headerTitle: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 2,
  },
  headerFilterText: {
    color: '#E8EAF6',
    fontSize: 12,
    marginTop: 4,
    fontStyle: 'italic',
  },
  filterButton: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  /* ────────────────────────────────────────── */

  // STYLE POUR LA BARRE DE RECHERCHE PRINCIPALE PAR ID PBO
  mainSearchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    marginHorizontal: 15,
    marginBottom: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  mainSearchInput: {
    flex: 1,
    fontSize: 15,
    color: '#333',
    padding: 0,
  },

  // STYLES POUR LE MODAL DE SÉLECTION RECHERCHABLE
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: PRIMARY_BLUE,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#333',
    padding: 0, 
  },
  dropdownItem: { 
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 14, 
    borderBottomWidth: 1, 
    borderBottomColor: '#f3f4f6' 
  },
  itemText: { fontSize: 15, color: '#333' },
  itemTextActive: { fontSize: 15, color: PRIMARY_BLUE, fontWeight: 'bold' },
  emptyText: { textAlign: 'center', color: '#888', marginVertical: 15, fontSize: 14 },

  // Styles de base conservés
  pboCard: { flexDirection: 'row', backgroundColor: 'white', marginHorizontal: 15, marginVertical: 6, padding: 15, borderRadius: 12, elevation: 2, alignItems: 'center' },
  iconContainer: { width: 50, height: 50, borderRadius: 8, backgroundColor: '#f0f9f7', justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  pboContent: { flex: 1 },
  pboHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  pboTitle: { fontSize: 15, fontWeight: 'bold', color: '#333', flex: 1, flexShrink: 1 },
  pboDate: { fontSize: 10, color: '#888' },
  pboLoc: { fontSize: 13, color: PRIMARY_BLUE, marginVertical: 2, fontWeight: '500' },
  pboFooter: { flexDirection: 'row', marginTop: 5 },
  badge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 5, marginRight: 10 },
  badgeText: { fontSize: 10, fontWeight: 'bold' },
  fab: { position: 'absolute', bottom: 25, right: 25, backgroundColor: PRIMARY_BLUE, width: 65, height: 65, borderRadius: 32.5, justifyContent: 'center', alignItems: 'center', elevation: 8 },
  fabMap: { position: 'absolute', bottom: 105, right: 25, backgroundColor: PRIMARY_BLUE, width: 65, height: 65, borderRadius: 32.5, justifyContent: 'center', alignItems: 'center', elevation: 8 }
});