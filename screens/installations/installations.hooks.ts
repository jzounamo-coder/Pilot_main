import { useState, useMemo } from 'react';
import { Linking, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export interface Installation {
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

export function useInstallationsLogic() {
  const navigation = useNavigation<any>();
  const [search, setSearch] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedVille, setSelectedVille] = useState<string>('Toutes');
  const [selectedStatut, setSelectedStatut] = useState<string>('Tous');

  const [installations] = useState<Installation[]>([
    { id: 'INST-101', nom: 'Anatole Ngoulou', tel: '06 555 11 22', ville: 'Brazzaville', arrondissement: 'Ouenzé', type: 'OE', statut: 'En cours', latitude: -4.2583, longitude: 15.2842 },
    { id: 'INST-102', nom: 'Gisèle Mavoungou', tel: '05 444 33 22', ville: 'Pointe-Noire', arrondissement: 'Tié-Tié', type: 'OT', statut: 'En attente', latitude: -4.7963, longitude: 11.8504 },
    { id: 'INST-103', nom: 'Société Horizon Fibre', tel: '06 999 88 77', ville: 'Brazzaville', arrondissement: 'Poto-Poto', type: 'OD', statut: 'Validé', latitude: -4.2694, longitude: 15.2711 },
    { id: 'INST-104', nom: 'Christian Samba', tel: '06 444 88 99', ville: 'Brazzaville', arrondissement: 'Talangaï', type: 'OE', statut: 'En attente', latitude: -4.2311, longitude: 15.3025 },
    { id: 'INST-105', nom: 'Sylvie Moundélé', tel: '05 660 55 44', ville: 'Brazzaville', arrondissement: 'Bacongo', type: 'OT', statut: 'En cours', latitude: -4.2914, longitude: 15.2533 },
  ]);

  const suggestionsVilles = ['Toutes', 'Brazzaville', 'Pointe-Noire'];
  const suggestionsStatuts = ['Tous', 'En attente', 'En cours', 'Validé'];

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

  const stats = useMemo(() => {
    const terminees = installations.filter(i => i.statut === 'Validé').length;
    const enCours = installations.filter(i => i.statut === 'En cours').length;
    const enAttente = installations.filter(i => i.statut === 'En attente').length;
    return { terminees, enCours, enAttente, total: installations.length };
  }, [installations]);

  const resetFilters = () => {
    setSearch('');
    setSelectedVille('Toutes');
    setSelectedStatut('Tous');
  };

  const ouvrirItineraire = (lat: number, lng: number) => {
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

  const navigateToValidation = (installation: Installation) => {
    navigation.navigate('ValidationInstallation', { installation });
  };

  return {
    search,
    setSearch,
    showFilters,
    setShowFilters,
    selectedVille,
    setSelectedVille,
    selectedStatut,
    setSelectedStatut,
    suggestionsVilles,
    suggestionsStatuts,
    filteredInstallations,
    stats,
    resetFilters,
    ouvrirItineraire,
    navigateToValidation
  };
}