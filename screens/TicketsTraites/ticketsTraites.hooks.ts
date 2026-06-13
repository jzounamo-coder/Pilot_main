import { useState, useCallback } from 'react';
import { Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

export interface Ticket {
  id: string;
  nomClient: string;
  telephone: string;
  isPboNomme: boolean;
  pbo: string;
  idDou: string;
  arrondissement: string;
  date: string;
}

export function useTicketsTraitesLogic() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('Tous'); 
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
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

  const openDetailModal = (item: Ticket) => {
    setSelectedTicket(item);
    setIsDetailModalOpen(true);
  };

  return {
    tickets,
    loading,
    searchQuery,
    setSearchQuery,
    selectedFilter,
    setSelectedFilter,
    isFilterModalOpen,
    setIsFilterModalOpen,
    selectedTicket,
    isDetailModalOpen,
    setIsDetailModalOpen,
    filteredData,
    fetchTickets,
    openDetailModal
  };
}