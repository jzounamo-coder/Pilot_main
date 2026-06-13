import { useState, useEffect, useLayoutEffect } from 'react';
import { Alert, LayoutAnimation } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import { fetchClients } from '../../redux/slices/clientslices'; 
import { updatePboPorts } from '../../redux/slices/pboslices'; 

export interface Client {
  id?: string;
  _id?: string;
  pbo_id?: string;
  name?: string;
  nom?: string;
  abonnement?: string;
  adresse?: string;
  tel?: string;
  port?: string | number;
}

export interface Pbo {
  id?: string;
  _id?: string;
  nomPbo?: string;
  idPbo?: string;
  codePbo?: string;
  localisation?: string;
  ville?: string;
  arrondissement?: string;
  projetCode?: string;
  lat?: string | number;
  lng?: string | number;
  pboNumberTotalPort?: string | number;
  pboNumberFreePort?: string | number;
  pboNumberUsedPort?: string | number;
  clients?: Client[];
}

export function usePboDetail() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const dispatch = useDispatch<any>();
  const { pbo }: { pbo: Pbo } = route.params;

  const { list: allClients, loading: clientsLoading } = useSelector((state: any) => state.clients || { list: [], loading: false });
  const { loading: pboUpdating } = useSelector((state: any) => state.pbos || { loading: false });

  const [isEditing, setIsEditing] = useState(false);
  const [showClients, setShowClients] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [newClient, setNewClient] = useState({ name: '', abonnement: '', adresse: '', tel: '' });

  // --- LOGIQUE DE PORTS UNIFIÉE ---
  const totalFixe = parseInt(String(pbo.pboNumberTotalPort)) || 16; 
  const [availablePorts, setAvailablePorts] = useState(parseInt(String(pbo.pboNumberFreePort)) || 0);
  const [occupiedPorts, setOccupiedPorts] = useState(parseInt(String(pbo.pboNumberUsedPort)) || (totalFixe - (parseInt(String(pbo.pboNumberFreePort)) || 0)));

  // --- LOGIQUE DE RECHERCHE CLIENTS ---
  useEffect(() => {
    if (newClient.abonnement.length > 2 || newClient.tel.length > 4) {
      const found = allClients.find((c: any) => 
        (c.abonnement && c.abonnement.toLowerCase().includes(newClient.abonnement.toLowerCase())) || 
        (c.tel && c.tel.includes(newClient.tel))
      );
      if (found) {
        setNewClient(prev => ({ ...prev, name: found.name || found.nom || '', adresse: found.adresse || '' }));
      }
    }
  }, [newClient.abonnement, newClient.tel, allClients]);

  const clientsSurCePbo = (pbo.clients && pbo.clients.length > 0) 
    ? pbo.clients 
    : allClients.filter((c: any) => c.pbo_id === pbo.id || c.pbo_id === pbo._id);

  useEffect(() => { 
    dispatch(fetchClients()); 
  }, [dispatch]);

  // --- LIAISON DIRECTE DES CALCULS ---
  const updateAvailable = (val: string) => {
    const free = parseInt(val) || 0;
    if (free < 0 || free > totalFixe) return;
    setAvailablePorts(free);
    setOccupiedPorts(totalFixe - free);
  };

  const updateOccupied = (val: string) => {
    const occ = parseInt(val) || 0;
    if (occ < 0 || occ > totalFixe) return;
    setOccupiedPorts(occ);
    setAvailablePorts(totalFixe - occ);
  };

  // --- SAUVEGARDE VERS LE SERVEUR ---
  const handleSavePbo = async () => {
    Alert.alert(
      "Confirmation",
      "Voulez-vous vraiment enregistrer ces modifications sur le serveur ?",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Oui, Valider",
          onPress: async () => {
            try {
              const resultAction = await dispatch(updatePboPorts({
                id: (pbo.id ?? pbo._id) ?? '',
                used: occupiedPorts,
                free: availablePorts
              }));

              if (updatePboPorts.fulfilled.match(resultAction)) {
                Alert.alert("Succès", "Mise à jour du PBO réussie !");
                setIsEditing(false);
              } else {
                Alert.alert("Erreur", String(resultAction.payload || "Le serveur n'a pas pu enregistrer les modifications."));
              }
            } catch (error) {
              Alert.alert("Erreur", "Problème de connexion au serveur.");
            }
          }
        }
      ]
    );
  };

  const handleAddClient = () => {
    if (!newClient.abonnement && !newClient.tel) {
      Alert.alert("Erreur", "Abonnement ou téléphone requis.");
      return;
    }
    Alert.alert("Succès", `Client ${newClient.name} prêt à être raccordé.`);
    setModalVisible(false);
    setNewClient({ name: '', abonnement: '', adresse: '', tel: '' });
  };

  const toggleShowClients = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setShowClients(!showClients);
  };

  return {
    pbo,
    isEditing,
    setIsEditing,
    showClients,
    toggleShowClients,
    modalVisible,
    setModalVisible,
    newClient,
    setNewClient,
    totalFixe,
    availablePorts,
    occupiedPorts,
    clientsLoading,
    pboUpdating,
    clientsSurCePbo,
    updateAvailable,
    updateOccupied,
    handleSavePbo,
    handleAddClient,
    navigation,
  };
}