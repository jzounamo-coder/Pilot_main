import { useState, useEffect } from 'react';
import { Alert, InteractionManager } from 'react-native';
import { useDispatch } from 'react-redux';
import { clearSaturationData } from '../../redux/slices/pboslices'; 

export interface ClientPbo {
  id: string;
  nom: string;
  prenom: string;
  telephone: string;
  arrondissement: string;
  numAbonnement: string;
  positionCassette: string;
  adresse: string;
  quartier: string;
}

export const useRetourTerrain = () => {
  const dispatch = useDispatch();
  
  const [estPboNomme, setEstPboNomme] = useState<boolean | null>(true);
  const [pboMA, setPboMA] = useState('');
  const [pboNumero, setPboNumero] = useState('');
  const [pboDetails, setPboDetails] = useState<any>(null);
  const [pboValideNom, setPboValideNom] = useState<string | null>(null);
  const [pboVerificationStatus, setPboVerificationStatus] = useState<'FOUND' | 'NOT_FOUND' | null>(null);

  const [portsLibres, setPortsLibres] = useState('16');
  const [portsOccupes, setPortsOccupes] = useState('0');
  const [portsTotal, setPortsTotal] = useState('16');

  const generateFullPortList = (apiClients: ClientPbo[]): ClientPbo[] => {
    const fullList: ClientPbo[] = [];
    for (let i = 1; i <= 16; i++) {
      const portLabel = `Port ${i < 10 ? '0' + i : i}`;
      const existingClient = apiClients.find(c => c.positionCassette === portLabel);
      
      if (existingClient) {
        fullList.push({
          ...existingClient,
          nom: existingClient.nom || '',
          prenom: existingClient.prenom || '',
          telephone: existingClient.telephone || '',
          arrondissement: existingClient.arrondissement || '',
          numAbonnement: existingClient.numAbonnement || '',
          adresse: existingClient.adresse || '',
          quartier: existingClient.quartier || ''
        });
      } else {
        fullList.push({
          id: `empty-${i}`,
          nom: '',
          prenom: '',
          telephone: '',
          arrondissement: '',
          numAbonnement: '',
          positionCassette: portLabel,
          adresse: '',
          quartier: ''
        });
      }
    }
    return fullList;
  };

  const [clients, setClients] = useState<ClientPbo[]>(() => generateFullPortList([]));
  const [loadingClients, setLoadingClients] = useState(false);
  const [savingClient, setSavingClient] = useState(false);

  useEffect(() => {
    const occ = clients.filter(c => c.nom && c.nom.trim() !== '').length;
    setPortsOccupes(String(occ));
    setPortsLibres(String(16 - occ));
    setPortsTotal('16');
  }, [clients]);

  const handleCalculateTotal = () => {
    const occ = parseInt(portsOccupes, 10) || 0;
    const lib = parseInt(portsLibres, 10) || 0;
    setPortsTotal(String(occ + lib));
    Alert.alert("Calcul effectué", `Le total des ports configurés est de : ${occ + lib}`);
  };

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentClient, setCurrentClient] = useState<ClientPbo | null>(null);
  const [isReady, setIsReady] = useState(false);
  
  const [editNom, setEditNom] = useState('');
  const [editPrenom, setEditPrenom] = useState('');
  const [editTelephone, setEditTelephone] = useState('');
  const [editArrondissement, setEditArrondissement] = useState('');
  const [editNumAbonnement, setEditNumAbonnement] = useState('');
  const [editAdresse, setEditAdresse] = useState('');
  const [editQuartier, setEditQuartier] = useState('');

  useEffect(() => {
    if (isModalVisible) {
      const task = InteractionManager.runAfterInteractions(() => {
        setIsReady(true);
      });
      return () => task.cancel();
    } else {
      setIsReady(false);
    }
  }, [isModalVisible]);

  const handleMAChange = (text: string) => {
    setPboMA(text);
    setPboVerificationStatus(null);
    setPboDetails(null);
    setPboValideNom(null);
  };

  const handleNumeroChange = (text: string) => {
    setPboNumero(text);
    setPboVerificationStatus(null);
    setPboDetails(null);
    setPboValideNom(null);
  };

  const verifyNamedPbo = async () => {
    if (!pboNumero.trim()) {
      Alert.alert("Erreur Saisie", "Veuillez remplir au moins le numéro du PBO.");
      return;
    }

    setLoadingClients(true);
    setPboValideNom(null);
    setPboVerificationStatus(null);

    const isQuickSearch = pboMA.trim() === '';
    try {
      const endpoint = 'https://control-api-dev.speedpro.cg/api/v1/ftth/pbo/check-by-idpbo';
      const body = isQuickSearch
        ? { idPbo: pboNumero.trim() }
        : { idPbo: `BZV-${pboMA.trim()}-PB${pboNumero.trim()}` };
        
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      
      const rawText = await response.text();
      let json: any;
      try {
        json = JSON.parse(rawText);
      } catch (e) {
        setPboVerificationStatus('NOT_FOUND');
        setClients(generateFullPortList([]));
        return;
      }

      if (json && json.success === true && json.data) {
        const pboData = Array.isArray(json.data) ? json.data[0] : json.data;
        if (pboData) {
          const nomPboTrouve = pboData.idPbo || pboData.slug || pboData.nom;
          setPboDetails(pboData); 
          setPboValideNom(nomPboTrouve);
          setPboVerificationStatus('FOUND');
          fetchClientsFromApi(nomPboTrouve);
        } else {
          setPboVerificationStatus('NOT_FOUND');
          setClients(generateFullPortList([]));
        }
      } else {
        setPboDetails(null);
        setPboValideNom(null);
        setPboVerificationStatus('NOT_FOUND');
        setClients(generateFullPortList([]));
      }
    } catch (error) {
      console.error("Erreur API:", error);
      setPboDetails(null);
      setPboValideNom(null);
      setPboVerificationStatus('NOT_FOUND');
      setClients(generateFullPortList([]));
    } finally {
      setLoadingClients(false);
    }
  };

  const fetchClientsFromApi = async (identifiant: string) => {
    setLoadingClients(true);
    try {
      const response = await fetch('https://control-api-dev.speedpro.cg/api/v1/pilot/saturation');
      const json = await response.json();
      const pboTrouve = json.data.find((item: any) => item.slug === identifiant || item.id == identifiant);
      
      if (pboTrouve && pboTrouve.clients) {
        setClients(generateFullPortList(pboTrouve.clients));
      } else {
        setClients(generateFullPortList([]));
      }
    } catch (error) {
      console.error("Erreur chargement clients:", error);
      setClients(generateFullPortList([]));
    } finally {
      setLoadingClients(false);
    }
  };

  useEffect(() => {
    setPboDetails(null);
    setPboValideNom(null);
    setPboVerificationStatus(null);
    setClients(generateFullPortList([]));
    if (!estPboNomme) {
      dispatch(clearSaturationData() as any);
    }
  }, [estPboNomme, dispatch]);

  const openEditModal = (client: ClientPbo) => {
    setCurrentClient(client);
    setEditNom(client.nom);
    setEditPrenom(client.prenom);
    setEditTelephone(client.telephone);
    setEditArrondissement(client.arrondissement);
    setEditNumAbonnement(client.numAbonnement);
    setEditAdresse(client.adresse || '');
    setEditQuartier(client.quartier || '');
    setIsModalVisible(true);
  };

  const handleSaveClient = async () => {
    if (!currentClient) return;
    if (!editNom.trim() || !editPrenom.trim() || !editTelephone.trim()) {
      Alert.alert('Champs requis', 'Le nom, le prénom et le téléphone sont obligatoires.');
      return;
    }

    setSavingClient(true);

    try {
      const positionNumber = parseInt(currentClient.positionCassette.replace('Port ', '').trim(), 10);
      const manualOcc = parseInt(portsOccupes, 10) || 0;
      const manualLib = parseInt(portsLibres, 10) || 0;
      const portOccupeAvant = currentClient.nom && currentClient.nom.trim() !== '' ? 1 : 0;
      const nouveauxOccupes = manualOcc + (portOccupeAvant === 0 ? 1 : 0);
      const nouveauxLibres = Math.max(0, manualLib - (portOccupeAvant === 0 ? 1 : 0));
      
      const body = {
        pbo: pboDetails?._id || null,          
        pboNumberUsedPort: nouveauxOccupes,
        pboNumberFreePort: nouveauxLibres,
        clients: [
          {
            name: editNom.trim(),
            firstName: editPrenom.trim(),
            phoneNumber: editTelephone.trim(),
            loginID: editNumAbonnement.trim(),
            address: editAdresse.trim(),
            quarter: editQuartier.trim(),
            district: editArrondissement.trim(),
            city: pboDetails?.ville || '',
            position: positionNumber
          }
        ]
      };

      const response = await fetch('https://control-api-dev.speedpro.cg/api/v1/pilot/saturation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      const rawText = await response.text();

      let json: any;
      try {
        json = JSON.parse(rawText);
      } catch (e) {
        Alert.alert('Erreur', 'Réponse invalide du serveur.');
        return;
      }

      if (json && json.success === true) {
        setClients(prevClients =>
          prevClients.map(c =>
            c.id === currentClient.id
              ? {
                  ...c,
                  nom: editNom.trim(),
                  prenom: editPrenom.trim(),
                  telephone: editTelephone.trim(),
                  arrondissement: editArrondissement.trim(),
                  numAbonnement: editNumAbonnement.trim(),
                  adresse: editAdresse.trim(),
                  quartier: editQuartier.trim(),
                }
              : c
          )
        );
        setPortsOccupes(String(nouveauxOccupes));
        setPortsLibres(String(nouveauxLibres));
        setPortsTotal(String(nouveauxOccupes + nouveauxLibres));

        setIsModalVisible(false);
        setCurrentClient(null);
        Alert.alert('Succès', 'Client enregistré avec succès sur le serveur !');
      } else {
        Alert.alert('Erreur', json?.message || "Échec de l'enregistrement.");
      }
    } catch (error) {
      console.error("Erreur enregistrement client:", error);
      Alert.alert('Erreur', "Erreur réseau lors de l'enregistrement.");
    } finally {
      setSavingClient(false);
    }
  };

  return {
    estPboNomme, setEstPboNomme,
    pboMA, handleMAChange,
    pboNumero, handleNumeroChange,
    pboDetails, pboValideNom, pboVerificationStatus, verifyNamedPbo,
    portsLibres, setPortsLibres,
    portsOccupes, setPortsOccupes,
    portsTotal, setPortsTotal,
    handleCalculateTotal,
    clients, loadingClients, savingClient,
    isModalVisible, setIsModalVisible, currentClient, isReady,
    editNom, setEditNom,
    editPrenom, setEditPrenom,
    editTelephone, setEditTelephone,
    editArrondissement, setEditArrondissement,
    editNumAbonnement, setEditNumAbonnement,
    editAdresse, setEditAdresse,
    editQuartier, setEditQuartier,
    openEditModal, handleSaveClient, setPboDetails, setPboValideNom, setPboVerificationStatus, setClients, generateFullPortList
  };
};