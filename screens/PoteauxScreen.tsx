import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Types pour les poteaux
interface Poteau {
  id: string;
  type: 'E2C' | 'CGT';
  lat: string;
  lng: string;
  ville: string;
  etat: 'Opérationnel' | 'Maintenance' | 'À remplacer';
  nbPbo: number;
}

export default function PoteauxScreen({ navigation }: any) {
  const [search, setSearch] = useState('');
  const [filterVisible, setFilterVisible] = useState(false); // Gère l'affichage des suggestions horizontales
  const [selectedVille, setSelectedVille] = useState('Toutes'); // Option de filtrage
  
  // Données de test
  const [poteaux] = useState<Poteau[]>([
    { id: 'POT-001', type: 'E2C', lat: '-4.2634', lng: '15.2429', ville: 'Brazzaville', etat: 'Opérationnel', nbPbo: 2 },
    { id: 'POT-002', type: 'CGT', lat: '-4.2678', lng: '15.2450', ville: 'Pointe-Noire', etat: 'Maintenance', nbPbo: 1 },
    { id: 'POT-003', type: 'E2C', lat: '-4.2710', lng: '15.2510', ville: 'Brazzaville', etat: 'Opérationnel', nbPbo: 4 },
  ]);

  // Listes de suggestions de filtres
  const suggestionsVilles = ['Toutes', 'Brazzaville', 'Pointe-Noire'];

  // LOGIQUE DE FILTRAGE ET RECHERCHE
  const filteredPoteaux = useMemo(() => {
    return poteaux.filter(poteau => {
      // Vérification de la recherche (ID ou Ville)
      const matchSearch = poteau.id.toLowerCase().includes(search.toLowerCase()) || 
                          poteau.ville.toLowerCase().includes(search.toLowerCase());
      
      // Vérification du filtre Ville
      const matchVille = selectedVille === 'Toutes' || poteau.ville === selectedVille;

      return matchSearch && matchVille;
    });
  }, [search, selectedVille, poteaux]);

  const renderItem = ({ item }: { item: Poteau }) => (
    <TouchableOpacity 
      style={styles.card} 
      onPress={() => navigation.navigate('PoteauDetail', { poteau: item })}
    >
      <View style={styles.cardHeader}>
        <View style={styles.idContainer}>
          <Ionicons 
            name={item.type === 'E2C' ? 'flash' : 'call'} 
            size={20} 
            color={item.type === 'E2C' ? '#FFD600' : '#00C853'} 
          />
          <Text style={styles.poteauId}>{item.id}</Text>
        </View>
        <Text style={[styles.typeBadge, { backgroundColor: item.type === 'E2C' ? '#FFF9C4' : '#C8E6C9' }]}>
          {item.type}
        </Text>
      </View>

      <View style={styles.cardBody}>
        <View style={styles.coordRow}>
          <Ionicons name="location-outline" size={16} color="#666" />
          <Text style={styles.coordText}>Lat: {item.lat} | Lng: {item.lng}</Text>
        </View>
        <Text style={styles.villeText}>{item.ville}</Text>
      </View>
      
      <Ionicons name="chevron-forward" size={20} color="#CCC" style={styles.chevron} />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header avec Barre de Recherche et Filtre */}
      <View style={styles.headerActions}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color="#999" />
          <TextInput 
            placeholder="Rechercher un poteau..." 
            style={styles.input}
            value={search}
            onChangeText={setSearch}
          />
          {(search !== '' || selectedVille !== 'Toutes') && (
            <TouchableOpacity onPress={() => { setSearch(''); setSelectedVille('Toutes'); }}>
              <Ionicons name="close-circle" size={18} color="#999" style={{ marginRight: 5 }} />
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity 
          style={[styles.filterBtn, filterVisible && {backgroundColor: '#3949AB'}]} 
          onPress={() => setFilterVisible(!filterVisible)}
        >
          <Ionicons name="filter" size={24} color="white" />
        </TouchableOpacity>
      </View>

      {/* BLOC DES SUGGESTIONS (S'affiche sous la barre lors du clic sur le bouton filtre) */}
      {filterVisible && (
        <View style={styles.suggestionsContainer}>
          <Text style={styles.suggestionTitle}>Filtrer par Ville :</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scrollSection}>
            {suggestionsVilles.map((v) => {
              const active = selectedVille === v;
              return (
                <TouchableOpacity 
                  key={v} 
                  style={[styles.chip, active && styles.chipActive]}
                  onPress={() => setSelectedVille(v)}
                >
                  <Text style={[styles.chipText, active && styles.chipTextActive]}>{v}</Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      )}

      {/* Liste des Poteaux Filtrée */}
      <FlatList
        data={filteredPoteaux}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 15, paddingBottom: 80 }}
        ListEmptyComponent={<Text style={{textAlign: 'center', marginTop: 20, color: '#999'}}>Aucun poteau trouvé</Text>}
      />

      {/* Bouton Faire une demande */}
      <TouchableOpacity 
        style={styles.fab} 
        onPress={() => navigation.navigate('DemandePoteau')}
      >
        <Ionicons name="add" size={30} color="white" />
        <Text style={styles.fabText}>DEMANDE POTEAU</Text>
      </TouchableOpacity>
    </View>
  );
}

// ---- ÉCRAN DE DÉTAIL ----
export function PoteauDetailScreen({ route, navigation }: any) {
  const { poteau } = route.params;

  return (
    <View style={styles.detailContainer}>
      <View style={styles.detailCard}>
        <View style={styles.iconCircle}>
          <Ionicons name="construct" size={50} color="#1A237E" />
        </View>
        
        <Text style={styles.detailId}>{poteau.id}</Text>
        
        <View style={styles.infoBox}>
          <InfoRow label="Latitude" value={poteau.lat} icon="location" />
          <InfoRow label="Longitude" value={poteau.lng} icon="location" />
          <InfoRow label="État" value={poteau.etat} icon="stats-chart" color={poteau.etat === 'Opérationnel' ? 'green' : 'orange'} />
          <InfoRow label="Nombre PBO" value={poteau.nbPbo.toString()} icon="git-network" />
        </View>

        <TouchableOpacity 
          style={styles.btnRenseigner}
          onPress={() => navigation.navigate('RenseignerPoteau', { poteau: poteau })}
        >
          <Text style={styles.btnText}>RENSEIGNER</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const InfoRow = ({ label, value, icon, color }: any) => (
  <View style={styles.infoRow}>
    <Ionicons name={icon} size={20} color={color || "#1A237E"} />
    <Text style={styles.infoLabel}>{label} :</Text>
    <Text style={styles.infoValue}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F6FA' },
  headerActions: { flexDirection: 'row', padding: 15, alignItems: 'center', paddingBottom: 5 },
  searchBar: { flex: 1, flexDirection: 'row', backgroundColor: 'white', borderRadius: 10, paddingHorizontal: 10, alignItems: 'center', height: 45, elevation: 2 },
  input: { flex: 1, marginLeft: 10 },
  filterBtn: { marginLeft: 10, backgroundColor: '#1A237E', padding: 10, borderRadius: 10, height: 45, width: 45, justifyContent: 'center', alignItems: 'center' },
  
  // NOUVEAUX STYLES POUR LES SUGGESTIONS HORIZONTALES
  suggestionsContainer: { backgroundColor: 'white', borderRadius: 10, padding: 10, marginHorizontal: 15, marginBottom: 5, elevation: 2 },
  suggestionTitle: { fontSize: 11, fontWeight: 'bold', color: '#555', marginBottom: 6, marginLeft: 4 },
  scrollSection: { marginBottom: 2 },
  chip: { backgroundColor: '#F0F2F5', paddingHorizontal: 15, paddingVertical: 6, borderRadius: 20, marginRight: 8, borderWidth: 1, borderColor: '#E4E6EB' },
  chipActive: { backgroundColor: '#1A237E', borderColor: '#1A237E' },
  chipText: { color: '#333', fontSize: 13 },
  chipTextActive: { color: 'white', fontWeight: 'bold' },

  card: { backgroundColor: 'white', borderRadius: 12, padding: 15, marginBottom: 12, elevation: 3, position: 'relative' },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  idContainer: { flexDirection: 'row', alignItems: 'center' },
  poteauId: { fontSize: 16, fontWeight: 'bold', marginLeft: 8, color: '#1A237E' },
  typeBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 5, fontSize: 12, fontWeight: 'bold' },
  cardBody: { borderTopWidth: 1, borderTopColor: '#EEE', paddingTop: 10 },
  coordRow: { flexDirection: 'row', alignItems: 'center' },
  coordText: { fontSize: 13, color: '#666', marginLeft: 5 },
  villeText: { fontSize: 12, color: '#999', marginTop: 4 },
  chevron: { position: 'absolute', right: 10, top: '50%' },
  fab: { position: 'absolute', bottom: 20, right: 20, left: 20, backgroundColor: '#1A237E', height: 55, borderRadius: 30, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', elevation: 5 },
  fabText: { color: 'white', fontWeight: 'bold', marginLeft: 10 },
  detailContainer: { flex: 1, backgroundColor: '#1A237E', justifyContent: 'center', padding: 20 },
  detailCard: { backgroundColor: 'white', borderRadius: 25, padding: 30, alignItems: 'center' },
  iconCircle: { width: 100, height: 100, borderRadius: 50, backgroundColor: '#F0F2FF', justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
  detailId: { fontSize: 24, fontWeight: 'bold', color: '#1A237E', marginBottom: 25 },
  infoBox: { width: '100%', marginBottom: 30 },
  infoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 15, borderBottomWidth: 1, borderBottomColor: '#F0F0F0', paddingBottom: 8 },
  infoLabel: { flex: 1, marginLeft: 10, color: '#666' },
  infoValue: { fontWeight: 'bold', color: '#333' },
  btnRenseigner: { backgroundColor: '#1A237E', width: '100%', padding: 15, borderRadius: 12, alignItems: 'center' },
  btnText: { color: 'white', fontWeight: 'bold' },
});