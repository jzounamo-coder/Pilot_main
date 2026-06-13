import { useState, useMemo } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';

export interface Poteau {
  id: string;
  type: 'E2C' | 'CGT';
  lat: string;
  lng: string;
  ville: string;
  etat: 'Opérationnel' | 'Maintenance' | 'À remplacer';
  nbPbo: number;
}

const MOCK_POTEAUX: Poteau[] = [
  { id: 'POT-001', type: 'E2C', lat: '-4.2634', lng: '15.2429', ville: 'Brazzaville', etat: 'Opérationnel', nbPbo: 2 },
  { id: 'POT-002', type: 'CGT', lat: '-4.2678', lng: '15.2450', ville: 'Pointe-Noire', etat: 'Maintenance', nbPbo: 1 },
  { id: 'POT-003', type: 'E2C', lat: '-4.2710', lng: '15.2510', ville: 'Brazzaville', etat: 'Opérationnel', nbPbo: 4 },
];

export function usePoteaux() {
  const navigation = useNavigation<any>();
  const [search, setSearch] = useState('');
  const [filterVisible, setFilterVisible] = useState(false);
  const [selectedVille, setSelectedVille] = useState('Toutes');
  const [poteaux] = useState<Poteau[]>(MOCK_POTEAUX);

  const suggestionsVilles = ['Toutes', 'Brazzaville', 'Pointe-Noire'];

  const filteredPoteaux = useMemo(() => {
    return poteaux.filter(poteau => {
      const matchSearch = poteau.id.toLowerCase().includes(search.toLowerCase()) || 
                          poteau.ville.toLowerCase().includes(search.toLowerCase());
      
      const matchVille = selectedVille === 'Toutes' || poteau.ville === selectedVille;

      return matchSearch && matchVille;
    });
  }, [search, selectedVille, poteaux]);

  const handleResetFilters = () => {
    setSearch('');
    setSelectedVille('Toutes');
  };

  return {
    search,
    setSearch,
    filterVisible,
    setFilterVisible,
    selectedVille,
    setSelectedVille,
    filteredPoteaux,
    suggestionsVilles,
    handleResetFilters,
    navigation,
  };
}

export function usePoteauDetail() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { poteau }: { poteau: Poteau } = route.params;

  return {
    poteau,
    navigation,
  };
}