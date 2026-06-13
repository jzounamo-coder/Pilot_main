import { useState, useCallback } from 'react';
import { Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

export interface ClientItem {
  id: string;
  nom: string;
  telephone: string;
  loginID: string;
  adresse: string;
  quartier: string;
  arrondissement: string;
  ville: string;
  position: string;
}

export interface RetourItem {
  id: string;
  slug: string;
  nomClient: string;
  telephone: string;
  numAbonnement: string;
  isPboNomme: boolean;
  pbo: string;
  pboId: string | null;
  idDou: string | null;
  date: string;
  clients: ClientItem[];
  portsOccupes: number;
  portsLibres: number;
  portsTotal: number;
}

export function useRetoursTerrain() {
  const [retours, setRetours] = useState<RetourItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('Tous'); 
  const [isModalOpen, setIsModalOpen] = useState(false);

  // État pour le modal de détail client
  const [selectedItem, setSelectedItem] = useState<RetourItem | null>(null);
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

  const openDetail = (item: RetourItem) => {
    setSelectedItem(item);
    setIsDetailModalOpen(true);
  };

  return {
    loading,
    retours,
    searchQuery,
    setSearchQuery,
    selectedFilter,
    setSelectedFilter,
    isModalOpen,
    setIsModalOpen,
    selectedItem,
    isDetailModalOpen,
    setIsDetailModalOpen,
    filteredData,
    fetchRetoursTerrain,
    openDetail,
  };
}