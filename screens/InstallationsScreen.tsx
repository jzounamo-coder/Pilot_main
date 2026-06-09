import React, { useState, useMemo } from 'react';
import { 
  View, Text, StyleSheet, FlatList, TextInput, 
  TouchableOpacity, Linking, Alert, ScrollView 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

// Couleurs du projet
const PRIMARY_BLUE = '#1A237E';

interface Installation {
  id: string;
  nom: string;
  tel: string;
  ville: string;
  arrondissement: string;
  type: 'OE' | 'OT' | 'OD';
  statut: 'En attente' | 'En cours' | 'Validé';
  latitude: number;
  longitude: number;
}

export default function InstallationsScreen() {
  const navigation = useNavigation<any>();
  const [search, setSearch] = useState('');

  // États pour gérer l'affichage des barres de suggestions et la sélection
  const [showFilters, setShowFilters] = useState(false);
  const [selectedVille, setSelectedVille] = useState<string>('Toutes');
  const [selectedStatut, setSelectedStatut] = useState<string>('Tous');

  // Liste de chantiers / installations enrichie avec 2 profils supplémentaires
  const [installations] = useState<Installation[]>([
    { id: 'INST-101', nom: 'Anatole Ngoulou', tel: '06 555 11 22', ville: 'Brazzaville', arrondissement: 'Ouenzé', type: 'OE', statut: 'En cours', latitude: -4.2583, longitude: 15.2842 },
    { id: 'INST-102', nom: 'Gisèle Mavoungou', tel: '05 444 33 22', ville: 'Pointe-Noire', arrondissement: 'Tié-Tié', type: 'OT', statut: 'En attente', latitude: -4.7963, longitude: 11.8504 },
    { id: 'INST-103', nom: 'Société Horizon Fibre', tel: '06 999 88 77', ville: 'Brazzaville', arrondissement: 'Poto-Poto', type: 'OD', statut: 'Validé', latitude: -4.2694, longitude: 15.2711 },
    // NOUVEAU PROFIL 1
    { id: 'INST-104', nom: 'Christian Samba', tel: '06 444 88 99', ville: 'Brazzaville', arrondissement: 'Talangaï', type: 'OE', statut: 'En attente', latitude: -4.2311, longitude: 15.3025 },
    // NOUVEAU PROFIL 2
    { id: 'INST-105', nom: 'Sylvie Moundélé', tel: '05 660 55 44', ville: 'Brazzaville', arrondissement: 'Bacongo', type: 'OT', statut: 'En cours', latitude: -4.2914, longitude: 15.2533 },
  ]);

  // Listes de suggestions de filtres
  const suggestionsVilles = ['Toutes', 'Brazzaville', 'Pointe-Noire'];
  const suggestionsStatuts = ['Tous', 'En attente', 'En cours', 'Validé'];

  // Logique de recherche combinée (filtre par nom, ville, arrondissement et suggestions cliquées)
  const filteredInstallations = useMemo(() => {
    return installations.filter(item => {
      const matchesSearch = 
        item.nom.toLowerCase().includes(search.toLowerCase()) ||
        item.ville.toLowerCase().includes(search.toLowerCase()) ||
        item.arrondissement.toLowerCase().includes(search.toLowerCase());

      const matchesVille = selectedVille === 'Toutes' || item.ville === selectedVille;
      const matchesStatut = selectedStatut === 'Tous' || item.statut === selectedStatut;

      return matchesSearch && matchesVille && matchesStatut;
    });
  }, [search, selectedVille, selectedStatut, installations]);

  // Calculs dynamiques pour le Dashboard du jour
  const stats = useMemo(() => {
    const terminees = installations.filter(i => i.statut === 'Validé').length;
    const enCours = installations.filter(i => i.statut === 'En cours').length;
    const enAttente = installations.filter(i => i.statut === 'En attente').length;
    return { terminees, enCours, enAttente, total: installations.length };
  }, [installations]);

  // Style des badges OE/OT/OD
  const getTypeStyle = (type: string) => {
    switch (type) {
      case 'OE': return { color: '#D32F2F', bg: '#FFEBEE' };
      case 'OT': return { color: '#F57C00', bg: '#FFF3E0' };
      case 'OD': return { color: '#388E3C', bg: '#E8F5E9' };
      default: return { color: '#757575', bg: '#F5F5F5' };
    }
  };

  // Style des statuts de chantier
  const getStatutStyle = (statut: string) => {
    switch (statut) {
      case 'Validé': return { color: '#FFFFFF', bg: '#00C853' }; 
      case 'En cours': return { color: '#FFFFFF', bg: '#29B6F6' };
      case 'En attente': return { color: '#333333', bg: '#E0E0E0' }; 
      default: return { color: '#333333', bg: '#E0E0E0' };
    }
  };

  // Ouvrir l'itinéraire GPS
  const ouvrirItineraire = (lat: number, lng: number, nom: string) => {
    const url = `http://maps.google.com/maps?daddr=${lat},${lng}`;
    Linking.canOpenURL(url)
      .then((supported) => {
        if (supported) {
          Linking.openURL(url);
        } else {
          Alert.alert("Erreur", "Impossible d'ouvrir l'application de navigation.");
        }
      })
      .catch(() => Alert.alert("Erreur", "Une erreur est survenue."));
  };

  const renderItem = ({ item }: { item: Installation }) => {
    const typeStyle = getTypeStyle(item.type);
    const statutStyle = getStatutStyle(item.statut);

    return (
      <View style={styles.card}>
        <TouchableOpacity 
          style={styles.cardContent}
          onPress={() => navigation.navigate('ValidationInstallation', { installation: item })}
        >
          <View style={styles.infoSection}>
            <View style={styles.titleRow}>
              <Text style={styles.clientName} numberOfLines={1}>{item.nom}</Text>
              {/* Badge Statut compact */}
              <View style={[styles.statusBadge, { backgroundColor: statutStyle.bg }]}>
                <Text style={[styles.statusText, { color: statutStyle.color }]}>{item.statut}</Text>
              </View>
            </View>

            <Text style={styles.clientDetails}>
              <Ionicons name="call-outline" size={12} color="#666" /> {item.tel}
            </Text>
            <Text style={styles.clientDetails}>
              <Ionicons name="location-outline" size={12} color="#666" /> {item.ville}, {item.arrondissement}
            </Text>

            {/* Badge de Type compacté */}
            <View style={[styles.badge, { backgroundColor: typeStyle.bg, marginTop: 5 }]}>
              <Text style={[styles.badgeText, { color: typeStyle.color }]}>{item.type}</Text>
            </View>
          </View>
        </TouchableOpacity>

        {/* Bouton Action Itinéraire plus serré */}
        <TouchableOpacity 
          style={styles.routeButton}
          onPress={() => ouvrirItineraire(item.latitude, item.longitude, item.nom)}
        >
          <Ionicons name="navigate-circle" size={30} color={PRIMARY_BLUE} />
          <Text style={styles.routeText}>GPS</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      
      {/* 1. DASHBOARD DU JOUR */}
      <View style={styles.dashboard}>
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={[styles.statNumber, { color: '#00C853' }]}>{stats.terminees}</Text>
            <Text style={styles.statLabel}>Fait</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={[styles.statNumber, { color: '#29B6F6' }]}>{stats.enCours}</Text>
            <Text style={styles.statLabel}>En cours</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={[styles.statNumber, { color: '#757575' }]}>{stats.enAttente}</Text>
            <Text style={styles.statLabel}>Attente</Text>
          </View>
          <View style={[styles.statBox, { borderRightWidth: 0 }]}>
            <Text style={[styles.statNumber, { color: PRIMARY_BLUE }]}>{stats.total}</Text>
            <Text style={styles.statLabel}>Total</Text>
          </View>
        </View>
      </View>

      {/* 2. RECHERCHE ET FILTRE */}
      <View style={styles.headerActions}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={18} color="#999" />
          <TextInput
            placeholder="Rechercher une installation..."
            style={styles.input}
            value={search}
            onChangeText={setSearch}
          />
          {(search !== '' || selectedVille !== 'Toutes' || selectedStatut !== 'Tous') && (
            <TouchableOpacity onPress={() => { setSearch(''); setSelectedVille('Toutes'); setSelectedStatut('Tous'); }}>
              <Ionicons name="close-circle" size={16} color="#999" style={{ marginRight: 5 }} />
            </TouchableOpacity>
          )}
        </View>
        
        <TouchableOpacity 
          style={[styles.filterBtn, showFilters && { backgroundColor: '#3949AB' }]} 
          onPress={() => setShowFilters(!showFilters)}
        >
          <Ionicons name="filter" size={20} color="white" />
        </TouchableOpacity>
      </View>

      {/* BLOC DES SUGGESTIONS (S'affiche dynamiquement lors du clic sur le filtre) */}
      {showFilters && (
        <View style={styles.suggestionsContainer}>
          <Text style={styles.suggestionTitle}>Filtrer par Ville :</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scrollSection}>
            {suggestionsVilles.map((ville) => {
              const active = selectedVille === ville;
              return (
                <TouchableOpacity 
                  key={ville} 
                  style={[styles.chip, active && styles.chipActive]} 
                  onPress={() => setSelectedVille(ville)}
                >
                  <Text style={[styles.chipText, active && styles.chipTextActive]}>{ville}</Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          <Text style={styles.suggestionTitle}>Filtrer par Statut :</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scrollSection}>
            {suggestionsStatuts.map((statut) => {
              const active = selectedStatut === statut;
              return (
                <TouchableOpacity 
                  key={statut} 
                  style={[styles.chip, active && styles.chipActive]} 
                  onPress={() => setSelectedStatut(statut)}
                >
                  <Text style={[styles.chipText, active && styles.chipTextActive]}>{statut}</Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      )}

      {/* 3. LISTE DES INSTALLATIONS */}
      <FlatList
        data={filteredInstallations}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 10 }}
        ListEmptyComponent={<Text style={styles.emptyText}>Aucune installation trouvée.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F6FA', padding: 8 }, 
  
  // STYLE DASHBOARD
  dashboard: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
  },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between' },
  statBox: { flex: 1, alignItems: 'center', borderRightWidth: 1, borderRightColor: '#EEE' },
  statNumber: { fontSize: 18, fontWeight: 'bold' },
  statLabel: { fontSize: 11, color: '#999', marginTop: 1 },

  // BARRE DE RECHERCHE & FILTRE
  headerActions: { flexDirection: 'row', marginBottom: 10, alignItems: 'center', paddingHorizontal: 2 },
  searchBar: { 
    flex: 1, 
    flexDirection: 'row', 
    backgroundColor: 'white', 
    borderRadius: 8, 
    paddingHorizontal: 10, 
    alignItems: 'center', 
    height: 40, 
    elevation: 1 
  },
  input: { flex: 1, marginLeft: 8, fontSize: 13 },
  filterBtn: { 
    marginLeft: 8, 
    backgroundColor: PRIMARY_BLUE, 
    height: 40, 
    width: 40,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 1
  },

  // STYLES DES CONTENEURS DE SUGGESTIONS (CHIPS VISUELS)
  suggestionsContainer: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 8,
    marginBottom: 10,
    elevation: 1,
  },
  suggestionTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#555',
    marginBottom: 4,
    marginLeft: 4
  },
  scrollSection: {
    marginBottom: 8
  },
  chip: {
    backgroundColor: '#F0F2F5',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 15,
    marginRight: 6,
    borderWidth: 1,
    borderColor: '#E4E6EB'
  },
  chipActive: {
    backgroundColor: PRIMARY_BLUE,
    borderColor: PRIMARY_BLUE
  },
  chipText: {
    fontSize: 12,
    color: '#333'
  },
  chipTextActive: {
    color: 'white',
    fontWeight: 'bold'
  },

  // STYLE DES CARTES CHANTIERS COMPACTÉES
  card: {
    backgroundColor: 'white',
    borderRadius: 10,
    paddingVertical: 10,     
    paddingHorizontal: 12,   
    marginBottom: 8,        
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
  },
  cardContent: { flex: 1 },
  infoSection: { flex: 1 },
  titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  clientName: { fontSize: 15, fontWeight: 'bold', color: '#333', flex: 1, marginRight: 5 },
  clientDetails: { fontSize: 12, color: '#666', marginBottom: 1 },
  
  // BADGES RECALIBRÉS
  badge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4, alignSelf: 'flex-start' },
  badgeText: { fontWeight: 'bold', fontSize: 11 },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 12 },
  statusText: { fontSize: 10, fontWeight: 'bold' },
  
  // BOUTON ITINÉRAIRE GPS PLUS SERRÉ
  routeButton: {
    marginLeft: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderLeftWidth: 1,
    borderLeftColor: '#EEE',
    paddingLeft: 10,
    alignSelf: 'stretch',
  },
  routeText: { fontSize: 9, fontWeight: 'bold', color: PRIMARY_BLUE, marginTop: 1 },
  
  emptyText: { textAlign: 'center', marginTop: 40, color: '#999', fontSize: 13 }
});