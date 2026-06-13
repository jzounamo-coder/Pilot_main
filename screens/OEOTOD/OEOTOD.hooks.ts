import { useState, useMemo } from 'react';
import { useNavigation } from '@react-navigation/native';

export interface ClientItem {
  id: string;
  nom: string;
  tel: string;
  ville: string;
  arrondissement: string;
  type: 'OE' | 'OT' | 'OD' | string;
}

const MOCK_DATA: ClientItem[] = [
  { id: '1', nom: 'Jean Dupont', tel: '06 12 34 56 78', ville: 'Brazzaville', arrondissement: 'Poto-Poto', type: 'OE' },
  { id: '2', nom: 'Marie Claire', tel: '05 55 44 33 22', ville: 'Pointe-Noire', arrondissement: 'Lumumba', type: 'OT' },
  { id: '3', nom: 'Entreprise ABC', tel: '06 99 88 77 66', ville: 'Brazzaville', arrondissement: 'Talangaï', type: 'OD' },
  { id: '4', nom: 'Pierre Loemba', tel: '04 11 22 33 44', ville: 'Dolisie', arrondissement: 'Centre', type: 'OE' },
];

export function useOdvOtl() {
  const navigation = useNavigation<any>();
  const [searchText, setSearchText] = useState('');
  const [filterVisible, setFilterVisible] = useState(false);
  const [cityFilter, setCityFilter] = useState('Toutes');
  const [data] = useState<ClientItem[]>(MOCK_DATA);

  const suggestionsVilles = ['Toutes', 'Brazzaville', 'Pointe-Noire', 'Dolisie'];

  // Utilisation de useMemo pour éviter le surcoût de rendu d'un useEffect
  const filteredData = useMemo(() => {
    return data.filter(item => {
      const matchName = item.nom.toLowerCase().includes(searchText.toLowerCase()) || 
                        item.ville.toLowerCase().includes(searchText.toLowerCase());
      
      const matchCity = cityFilter === 'Toutes' || item.ville === cityFilter;

      return matchName && matchCity;
    });
  }, [searchText, cityFilter, data]);

  const getTypeStyle = (type: string) => {
    switch (type) {
      case 'OE': return { color: '#D32F2F', bg: '#FFEBEE' };
      case 'OT': return { color: '#F57C00', bg: '#FFF3E0' };
      case 'OD': return { color: '#388E3C', bg: '#E8F5E9' };
      default: return { color: '#757575', bg: '#F5F5F5' };
    }
  };

  const handleResetFilters = () => {
    setSearchText('');
    setCityFilter('Toutes');
  };

  return {
    searchText,
    setSearchText,
    filterVisible,
    setFilterVisible,
    cityFilter,
    setCityFilter,
    filteredData,
    suggestionsVilles,
    getTypeStyle,
    handleResetFilters,
    navigation,
  };
}