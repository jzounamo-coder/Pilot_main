import React, { useState, useEffect } from 'react';
import { 
  View, Text, StyleSheet, FlatList, TextInput, 
  TouchableOpacity, ScrollView 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

// Couleurs du projet
const PRIMARY_BLUE = '#1A237E';

const MOCK_DATA = [
  { id: '1', nom: 'Jean Dupont', tel: '06 12 34 56 78', ville: 'Brazzaville', arrondissement: 'Poto-Poto', type: 'OE' },
  { id: '2', nom: 'Marie Claire', tel: '05 55 44 33 22', ville: 'Pointe-Noire', arrondissement: 'Lumumba', type: 'OT' },
  { id: '3', nom: 'Entreprise ABC', tel: '06 99 88 77 66', ville: 'Brazzaville', arrondissement: 'Talangaï', type: 'OD' },
  { id: '4', nom: 'Pierre Loemba', tel: '04 11 22 33 44', ville: 'Dolisie', arrondissement: 'Centre', type: 'OE' },
];

export default function OdvOtlScreen() {
  const navigation = useNavigation<any>();
  const [searchText, setSearchText] = useState('');
  const [filterVisible, setFilterVisible] = useState(false); // Gère l'affichage des suggestions horizontales
  const [cityFilter, setCityFilter] = useState('Toutes'); // Option de filtrage par défaut
  const [data, setData] = useState(MOCK_DATA);
  const [filteredData, setFilteredData] = useState(MOCK_DATA);

  // Liste des suggestions uniques basées sur tes données (+ option 'Toutes')
  const suggestionsVilles = ['Toutes', 'Brazzaville', 'Pointe-Noire', 'Dolisie'];

  // Logique de filtrage (Recherche + Ville)
  useEffect(() => {
    const filtered = data.filter(item => {
      // Vérification de la recherche (Nom ou Ville)
      const matchName = item.nom.toLowerCase().includes(searchText.toLowerCase()) || 
                        item.ville.toLowerCase().includes(searchText.toLowerCase());
      
      // Vérification du filtre Ville
      const matchCity = cityFilter === 'Toutes' || item.ville === cityFilter;

      return matchName && matchCity;
    });
    setFilteredData(filtered);
  }, [searchText, cityFilter, data]);

  const getTypeStyle = (type: string) => {
    switch (type) {
      case 'OE': return { color: '#D32F2F', bg: '#FFEBEE' };
      case 'OT': return { color: '#F57C00', bg: '#FFF3E0' };
      case 'OD': return { color: '#388E3C', bg: '#E8F5E9' };
      default: return { color: '#757575', bg: '#F5F5F5' };
    }
  };

  const renderItem = ({ item }: any) => {
    const typeStyle = getTypeStyle(item.type);
    return (
      <TouchableOpacity 
        style={styles.card} 
        onPress={() => navigation.navigate('ClientJobDetail', { client: item })}
      >
        <View style={styles.cardContent}>
          <View style={styles.infoSection}>
            <Text style={styles.clientName}>{item.nom}</Text>
            <Text style={styles.clientDetails}>
              <Ionicons name="call-outline" size={12} /> {item.tel}
            </Text>
            <Text style={styles.clientDetails}>
              <Ionicons name="location-outline" size={12} /> {item.ville}, {item.arrondissement}
            </Text>
          </View>
          <View style={[styles.badge, { backgroundColor: typeStyle.bg }]}>
            <Text style={[styles.badgeText, { color: typeStyle.color }]}>{item.type}</Text>
          </View>
        </View>
        <View style={styles.actionButton}>
          <Ionicons name="chevron-forward" size={20} color={PRIMARY_BLUE} />
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* HEADER : BARRE DE RECHERCHE & BOUTON FILTRE MODERNE */}
      <View style={styles.headerActions}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color="#999" />
          <TextInput
            placeholder="Rechercher..."
            style={styles.input}
            value={searchText}
            onChangeText={setSearchText}
          />
          {/* Bouton de réinitialisation rapide si une recherche ou filtre est actif */}
          {(searchText !== '' || cityFilter !== 'Toutes') && (
            <TouchableOpacity onPress={() => { setSearchText(''); setCityFilter('Toutes'); }}>
              <Ionicons name="close-circle" size={18} color="#999" style={{ marginRight: 5 }} />
            </TouchableOpacity>
          )}
        </View>
        
        <TouchableOpacity 
          style={[styles.filterBtn, filterVisible && { backgroundColor: '#3949AB' }]} 
          onPress={() => setFilterVisible(!filterVisible)}
        >
          <Ionicons name="filter" size={24} color="white" />
        </TouchableOpacity>
      </View>

      {/* BLOC DES SUGGESTIONS (Apparaît sous la barre lors du clic sur le bouton filtre) */}
      {filterVisible && (
        <View style={styles.suggestionsContainer}>
          <Text style={styles.suggestionTitle}>Filtrer par Ville :</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scrollSection}>
            {suggestionsVilles.map((v) => {
              const active = cityFilter === v;
              return (
                <TouchableOpacity 
                  key={v} 
                  style={[styles.chip, active && styles.chipActive]}
                  onPress={() => setCityFilter(v)}
                >
                  <Text style={[styles.chipText, active && styles.chipTextActive]}>{v}</Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      )}

      {/* Liste des Clients/Demandes Filtrée */}
      <FlatList
        data={filteredData}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 20, paddingTop: 5 }}
        ListEmptyComponent={<Text style={styles.emptyText}>Aucun client trouvé.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F6FA', padding: 10 },
  
  headerActions: { 
    flexDirection: 'row', 
    paddingHorizontal: 5, 
    paddingVertical: 10, 
    alignItems: 'center',
    paddingBottom: 5
  },
  searchBar: { 
    flex: 1, 
    flexDirection: 'row', 
    backgroundColor: 'white', 
    borderRadius: 10, 
    paddingHorizontal: 10, 
    alignItems: 'center', 
    height: 45, 
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  input: { flex: 1, marginLeft: 10 },
  filterBtn: { 
    marginLeft: 10, 
    backgroundColor: PRIMARY_BLUE, 
    padding: 10, 
    borderRadius: 10,
    height: 45,
    width: 45,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2
  },

  // NOUVEAUX STYLES POUR LE FILTRAGE HORIZONTAL EN CASSIER
  suggestionsContainer: { 
    backgroundColor: 'white', 
    borderRadius: 10, 
    padding: 10, 
    marginHorizontal: 5, 
    marginBottom: 10, 
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  suggestionTitle: { fontSize: 11, fontWeight: 'bold', color: '#555', marginBottom: 6, marginLeft: 4 },
  scrollSection: { marginBottom: 2 },
  chip: { backgroundColor: '#F0F2F5', paddingHorizontal: 15, paddingVertical: 6, borderRadius: 20, marginRight: 8, borderWidth: 1, borderColor: '#E4E6EB' },
  chipActive: { backgroundColor: PRIMARY_BLUE, borderColor: PRIMARY_BLUE },
  chipText: { color: '#333', fontSize: 13 },
  chipTextActive: { color: 'white', fontWeight: 'bold' },

  // STYLES DES CARTES
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardContent: { flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  infoSection: { flex: 1 },
  clientName: { fontSize: 16, fontWeight: 'bold', color: '#333', marginBottom: 4 },
  clientDetails: { fontSize: 13, color: '#666', marginBottom: 2 },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    minWidth: 45,
    alignItems: 'center',
  },
  badgeText: { fontWeight: '900', fontSize: 14 },
  actionButton: { marginLeft: 10 },
  emptyText: { textAlign: 'center', marginTop: 50, color: '#999' }
});