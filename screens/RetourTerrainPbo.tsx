import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, SafeAreaView, Modal, TextInput, ScrollView, Platform, ActivityIndicator, InteractionManager, KeyboardAvoidingView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
// Import Redux
import { useDispatch, useSelector } from 'react-redux';
import { clearSaturationData } from '../redux/slices/pboslices';

const PRIMARY_BLUE = '#1A237E';
const LIGHT_BLUE = '#E8EAF6';
const BACKGROUND_COLOR = '#F8F9FA';

interface ClientPbo {
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

export default function RetourTerrainPbo() {
  const navigation = useNavigation();
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

  const renderClientItem = ({ item }: { item: ClientPbo }) => {
    const isOccupied = item.nom && item.nom.trim() !== '';

    return (
      <View style={[styles.clientCard, !isOccupied && styles.clientCardLibre]}>
        <TouchableOpacity style={styles.editCardButton} onPress={() => openEditModal(item)} activeOpacity={0.6}>
          <Ionicons name={isOccupied ? "create-outline" : "add-circle-outline"} size={18} color={isOccupied ? PRIMARY_BLUE : "#666"} />
        </TouchableOpacity>

        <View style={styles.clientHeader}>
          <View style={[styles.avatarBadge, !isOccupied && styles.avatarBadgeLibre]}>
            {isOccupied ? (
              <Text style={styles.avatarText}>
                {item.nom && item.nom[0] ? item.nom[0].toUpperCase() : ''}
                {item.prenom && item.prenom[0] ? item.prenom[0].toUpperCase() : ''}
              </Text>
            ) : (
              <Ionicons name="git-commit-outline" size={16} color="#78909C" />
            )}
          </View>
          <View style={styles.clientMeta}>
            <Text style={[styles.clientName, !isOccupied && styles.clientNameLibre]}>
              {isOccupied ? `${item.nom} ${item.prenom}` : "Port non attribué (Libre)"}
            </Text>
            <Text style={styles.cassetteTag}>{item.positionCassette}</Text>
          </View>
        </View>

        {isOccupied && (
          <View style={styles.infoCompactContainer}>
            <View style={styles.infoRow}>
              <Ionicons name="call-outline" size={14} color="#666" />
              <Text style={styles.infoText}>{item.telephone}</Text>
            </View>
            {(item.numAbonnement || '').trim() !== '' && (
              <View style={styles.infoRow}>
                <Ionicons name="card-outline" size={14} color="#666" />
                <Text style={styles.infoText}>Abonnement: {item.numAbonnement}</Text>
              </View>
            )}
            {(item.quartier || item.adresse) && (
              <View style={styles.infoRow}>
                <Ionicons name="location-outline" size={14} color="#666" />
                <Text style={styles.infoText} numberOfLines={1}>
                  {item.quartier}{item.adresse ? `, ${item.adresse}` : ''}
                </Text>
              </View>
            )}
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      
      {/* ── HEADER PREMIUM UNIFIÉ ── */}
      <View style={styles.headerContainer}>
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerSubtitle}>suivi infrastructures</Text>
          <Text style={styles.headerTitle}>Retour terrain</Text>
        </View>
        <TouchableOpacity 
          style={styles.headerHistoryBtn} 
          onPress={() => navigation.navigate('ListeRetoursTerrain' as never)} 
          activeOpacity={0.8}
        >
         <Ionicons name="time-outline" size={24} color={PRIMARY_BLUE} />
        </TouchableOpacity>
      </View>

      <ScrollViewContent>
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Configuration Type de PBO</Text>
          <View style={styles.actionButtonsContainer}>
            <TouchableOpacity style={[styles.actionBtn, estPboNomme === true && { backgroundColor: LIGHT_BLUE, borderColor: PRIMARY_BLUE }]} onPress={() => setEstPboNomme(true)} activeOpacity={0.8}>
              <Ionicons name="bookmark-outline" size={16} color={estPboNomme === true ? PRIMARY_BLUE : "#666"} />
              <Text style={[styles.btnText, estPboNomme === true && { color: PRIMARY_BLUE, fontWeight: '600' }]}>PBO Nommé</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.actionBtn, estPboNomme === false && { backgroundColor: LIGHT_BLUE, borderColor: PRIMARY_BLUE }]} onPress={() => setEstPboNomme(false)} activeOpacity={0.8}>
              <Ionicons name="help-circle-outline" size={16} color={estPboNomme === false ? PRIMARY_BLUE : "#666"} />
              <Text style={[styles.btnText, estPboNomme === false && { color: PRIMARY_BLUE, fontWeight: '600' }]}>Non Nommé</Text>
            </TouchableOpacity>
          </View>

          {estPboNomme === true && (
            <View style={{ marginTop: 14 }}>
              <Text style={styles.inputLabel}>Nom du PBO (Format Imbriqué BZV-)</Text>
              <View style={styles.nestedInputContainer}>
                <View style={styles.prefixLabelBox}>
                  <Text style={styles.prefixLabelText}>BZV-</Text>
                </View>
                <TextInput
                  style={styles.maInputField}
                  value={pboMA}
                  onChangeText={handleMAChange}
                  placeholder="G01"
                  placeholderTextColor="#AAA"
                  autoCapitalize="characters"
                  editable={!pboDetails}
                />
                <Text style={styles.dashSeparator}>-PB-</Text>
                <TextInput
                  style={styles.numeroInputField}
                  value={pboNumero}
                  onChangeText={handleNumeroChange}
                  placeholder="0000"
                  placeholderTextColor="#AAA"
                  keyboardType="numeric"
                  editable={!pboDetails}
                />
                {!pboDetails && pboVerificationStatus !== 'NOT_FOUND' ? (
                  <TouchableOpacity style={styles.checkInnerBtn} onPress={verifyNamedPbo}>
                    {loadingClients
                      ? <ActivityIndicator size="small" color="white" />
                      : <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 10 }}>Check</Text>
                    }
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity style={styles.clearInnerBtn} onPress={() => { setPboDetails(null); setPboValideNom(null); setPboVerificationStatus(null); setClients(generateFullPortList([])); }}>
                    <Ionicons name="close" size={18} color="#D32F2F" />
                  </TouchableOpacity>
                )}
              </View>

              {pboVerificationStatus === 'FOUND' && (
                <View style={styles.pboSuccessDottedBox}>
                  <Ionicons name="checkmark-circle" size={16} color="#2E7D32" style={{ marginRight: 6 }} />
                  <Text style={styles.pboSuccessDottedText}>PBO trouvé ({pboValideNom})</Text>
                  {pboDetails?.typeSplitter && (
                    <Text style={{ fontSize: 12, color: '#2E7D32', marginLeft: 'auto', fontWeight: '500' }}>
                      ({pboDetails.typeSplitter})
                    </Text>
                  )}
                </View>
              )}

              {pboVerificationStatus === 'NOT_FOUND' && (
                <View style={styles.pboErrorDottedBox}>
                  <Ionicons name="close-circle" size={16} color="#D32F2F" style={{ marginRight: 6 }} />
                  <Text style={styles.pboErrorText}>PBO non trouvé</Text>
                </View>
              )}
            </View>
          )}

          {estPboNomme === false && (
            <View style={{ marginTop: 14 }}>
              <View style={styles.warningInputBox}>
                <Ionicons name="warning-outline" size={20} color="#D32F2F" style={styles.warningIconField} />
                <Text style={styles.warningInputText}>
                  Avant d'enregistrer les informations veuillez vous rapprocher à moins de 1 mètre
                </Text>
              </View>
            </View>
          )}
        </View>

        {(pboVerificationStatus === 'FOUND' || estPboNomme === false) && (
          <>
            <View style={styles.portsManagementCard}>
              <View style={styles.portsCardHeader}>
                <Text style={styles.portsSectionTitle}>Configuration des Ports </Text>
                <TouchableOpacity 
                  style={styles.discreetCalcBtn} 
                  onPress={handleCalculateTotal}
                  activeOpacity={0.7}
                >
                  <Ionicons name="calculator-outline" size={13} color={PRIMARY_BLUE} style={{ marginRight: 4 }} />
                  <Text style={styles.discreetCalcText}>enregistrer</Text>
                </TouchableOpacity>
              </View>
              
              <View style={styles.editableStatsRow}>
                <View style={[styles.statInputBadge, { borderColor: '#2E7D32' }]}>
                  <Text style={[styles.statLabelText, { color: '#2E7D32' }]}> Libres</Text>
                  <View style={styles.inputWithIconRow}>
                    <Ionicons name="pencil-outline" size={12} color="#2E7D32" style={{ marginRight: 4 }} />
                    <TextInput
                      style={[styles.statTextInput, { color: '#2E7D32' }]}
                      value={portsLibres}
                      onChangeText={(txt) => {
                        setPortsLibres(txt);
                        const lib = parseInt(txt, 10) || 0;
                        const occ = parseInt(portsOccupes, 10) || 0;
                        setPortsTotal(String(lib + occ));
                      }}
                      keyboardType="numeric"
                      maxLength={2}
                    />
                  </View>
                </View>

                <View style={[styles.statInputBadge, { borderColor: '#C62828' }]}>
                  <Text style={[styles.statLabelText, { color: '#C62828' }]}>Occupés</Text>
                  <View style={styles.inputWithIconRow}>
                    <Ionicons name="pencil-outline" size={12} color="#C62828" style={{ marginRight: 4 }} />
                    <TextInput
                      style={[styles.statTextInput, { color: '#C62828' }]}
                      value={portsOccupes}
                      onChangeText={(txt) => {
                        setPortsOccupes(txt);
                        const occ = parseInt(txt, 10) || 0;
                        const lib = parseInt(portsLibres, 10) || 0;
                        setPortsTotal(String(lib + occ));
                      }}
                      keyboardType="numeric"
                      maxLength={2}
                    />
                  </View>
                </View>

                <View style={[styles.statInputBadge, { borderColor: PRIMARY_BLUE, backgroundColor: '#F0F2FF' }]}>
                  <Text style={[styles.statLabelText, { color: PRIMARY_BLUE }]}>Total</Text>
                  <Text style={[styles.statValueDisplay, { color: PRIMARY_BLUE }]}>{portsTotal}</Text>
                </View>
              </View>
            </View>

            <View style={styles.listHeaderSection}>
              <Ionicons name="grid-outline" size={18} color="#333" />
              <Text style={styles.listSectionTitle}>Liste des Ports (16 ports)</Text>
            </View>

            {loadingClients ? (
              <ActivityIndicator size="large" color={PRIMARY_BLUE} style={{ marginVertical: 20 }} />
            ) : (
              <FlatList
                data={clients}
                keyExtractor={(item) => item.id}
                renderItem={renderClientItem}
                contentContainerStyle={styles.listContainer}
                scrollEnabled={false}
                ListEmptyComponent={<Text style={{ textAlign: 'center', marginTop: 20, color: '#999' }}>Aucun port trouvé.</Text>}
              />
            )}
          </>
        )}
      </ScrollViewContent>

      {/* Modal de Configuration Client avec Gestion du Clavier et Formulaire Compact */}
      <Modal visible={isModalVisible} animationType="slide" transparent={true} onRequestClose={() => setIsModalVisible(false)}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Configuration {currentClient?.positionCassette}</Text>
              <TouchableOpacity onPress={() => setIsModalVisible(false)}>
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>
            
            {isReady ? (
              <ScrollView showsVerticalScrollIndicator={false} style={styles.modalForm} contentContainerStyle={{ paddingBottom: 20 }}>
                {/* Ligne 1: Nom et Prénom côte à côte pour gagner de l'espace */}
                <View style={styles.formRow}>
                  <View style={styles.formCol}>
                    <Text style={styles.inputLabel}>Nom *</Text>
                    <TextInput style={styles.modalInput} value={editNom} onChangeText={setEditNom} />
                  </View>
                  <View style={styles.formCol}>
                    <Text style={styles.inputLabel}>Prénom *</Text>
                    <TextInput style={styles.modalInput} value={editPrenom} onChangeText={setEditPrenom} />
                  </View>
                </View>

                {/* Ligne 2: Téléphone et Abonnement côte à côte */}
                <View style={styles.formRow}>
                  <View style={styles.formCol}>
                    <Text style={styles.inputLabel}>Téléphone *</Text>
                    <TextInput style={styles.modalInput} value={editTelephone} onChangeText={setEditTelephone} keyboardType="phone-pad" />
                  </View>
                  <View style={styles.formCol}>
                    <Text style={styles.inputLabel}>N° Abonnement</Text>
                    <TextInput style={styles.modalInput} value={editNumAbonnement} onChangeText={setEditNumAbonnement} />
                  </View>
                </View>

                {/* Ligne 3: Arrondissement et Quartier côte à côte */}
                <View style={styles.formRow}>
                  <View style={styles.formCol}>
                    <Text style={styles.inputLabel}>Arrondissement</Text>
                    <TextInput style={styles.modalInput} value={editArrondissement} onChangeText={setEditArrondissement} />
                  </View>
                  <View style={styles.formCol}>
                    <Text style={styles.inputLabel}>Quartier</Text>
                    <TextInput style={styles.modalInput} value={editQuartier} onChangeText={setEditQuartier} />
                  </View>
                </View>

                {/* Ligne 4: Adresse Complète */}
                <Text style={styles.inputLabel}>Adresse Complète</Text>
                <TextInput style={styles.modalInput} value={editAdresse} onChangeText={setEditAdresse} />
              </ScrollView>
            ) : (
              <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color={PRIMARY_BLUE} />
              </View>
            )}

            <View style={styles.modalFooter}>
              <TouchableOpacity style={[styles.modalBtn, styles.modalBtnCancel]} onPress={() => setIsModalVisible(false)} disabled={savingClient}>
                <Text style={styles.modalBtnCancelText}>Annuler</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalBtn, styles.modalBtnSave, savingClient && { backgroundColor: '#BDBDBD' }]} onPress={handleSaveClient} disabled={savingClient}>
                {savingClient
                  ? <ActivityIndicator size="small" color="white" />
                  : <Text style={styles.modalBtnSaveText}>Enregistrer</Text>
                }
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

const ScrollViewContent = ({ children }: { children: React.ReactNode }) => (
  <FlatList
    data={[{ key: 'content' }]}
    renderItem={() => <View style={{ padding: 12 }}>{children}</View>}
    showsVerticalScrollIndicator={false}
  />
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BACKGROUND_COLOR },
  
  /* ── DESIGN NOUVEAU HEADER PREMIUM UNIFIÉ ── */
  headerContainer: {
    backgroundColor: PRIMARY_BLUE,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 10 : 10,
    paddingBottom: 20,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    marginBottom: 15,
  },
  headerTextContainer: {
    flex: 1,
  },
  headerSubtitle: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 12,
    textTransform: 'uppercase',
    fontWeight: '600',
    letterSpacing: 0.8,
  },
  headerTitle: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 2,
  },
  headerHistoryBtn: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  /* ────────────────────────────────────────── */

  card: { backgroundColor: 'white', borderRadius: 16, padding: 18, marginBottom: 16, borderWidth: 1, borderColor: '#EAEAEA', elevation: 2 },
  sectionTitle: { fontSize: 14, fontWeight: '600', color: '#555', marginBottom: 14 },
  actionButtonsContainer: { flexDirection: 'row', justifyContent: 'space-between' },
  actionBtn: { flex: 1, flexDirection: 'row', height: 44, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginHorizontal: 6, borderWidth: 1, borderColor: '#EAEAEA', backgroundColor: '#F8F9FA' },
  btnText: { fontWeight: '500', marginLeft: 6, fontSize: 14, color: '#333' },
  
  // Saisie Imbriquée BZV-MA-Numero
  nestedInputContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F5F6FA', borderRadius: 12, borderWidth: 1, borderColor: '#E2E4E8', overflow: 'hidden', height: 48 },
  prefixLabelBox: { backgroundColor: '#E8EAF6', paddingHorizontal: 10, height: '100%', justifyContent: 'center', borderRightWidth: 1, borderRightColor: '#C5CAE9' },
  prefixLabelText: { color: PRIMARY_BLUE, fontWeight: '700', fontSize: 14 },
  maInputField: { flex: 0.6, paddingHorizontal: 8, fontSize: 14, fontWeight: '600', color: '#222', textAlign: 'center' },
  dashSeparator: { fontSize: 12, fontWeight: 'bold', color: '#1A237E', paddingHorizontal: 2 },
  numeroInputField: { flex: 0.9, paddingHorizontal: 8, fontSize: 14, fontWeight: '600', color: '#222', textAlign: 'center' },
  checkInnerBtn: { backgroundColor: PRIMARY_BLUE, height: '100%', paddingHorizontal: 16, justifyContent: 'center', alignItems: 'center' },
  clearInnerBtn: { backgroundColor: '#FFEBEE', height: '100%', paddingHorizontal: 16, justifyContent: 'center', alignItems: 'center' },
  
  warningInputBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF8E1', borderColor: '#d2850a', borderWidth: 1, borderRadius: 12, paddingHorizontal: 12, paddingVertical: 10, minHeight: 45, marginTop: 12 },
  warningIconField: { marginRight: 8 },
  warningInputText: { flex: 1, color: '#d38e17', fontSize: 13, fontWeight: '600', lineHeight: 18 },
  
  // Boîte succès en pointillés Verts
  pboSuccessDottedBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#E8F5E9', borderStyle: 'dashed', borderWidth: 1.5, borderColor: '#2E7D32', borderRadius: 10, padding: 12, marginTop: 12 },
  pboSuccessDottedText: { color: '#2E7D32', fontWeight: '700', fontSize: 13 },
  pboErrorDottedBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFEBEE', borderStyle: 'dashed', borderWidth: 1.5, borderColor: '#D32F2F', borderRadius: 10, padding: 12, marginTop: 12 },
  pboErrorText: { color: '#D32F2F', fontWeight: '700', fontSize: 13 },
  
  // STATS PORTS
  portsManagementCard: { backgroundColor: 'white', borderRadius: 16, padding: 14, marginBottom: 16, borderWidth: 1, borderColor: '#EAEAEA' },
  portsCardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  portsSectionTitle: { fontSize: 14, fontWeight: '600', color: '#555' },
  discreetCalcBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F5F6FA', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  discreetCalcText: { fontSize: 11, fontWeight: '600', color: PRIMARY_BLUE },
  editableStatsRow: { flexDirection: 'row', justifyContent: 'space-between' },
  statInputBadge: { flex: 1, borderWidth: 1, borderRadius: 8, paddingVertical: 8, paddingHorizontal: 6, alignItems: 'center', marginHorizontal: 4, backgroundColor: 'white' },
  statLabelText: { fontSize: 10, fontWeight: 'bold', textTransform: 'uppercase', marginBottom: 4 },
  inputWithIconRow: { flexDirection: 'row', alignItems: 'center' },
  statTextInput: { fontSize: 14, fontWeight: 'bold', padding: 0, textAlign: 'center', minWidth: 20 },
  statValueDisplay: { fontSize: 16, fontWeight: 'bold', marginTop: 2 },
  
  // LISTE DES PORTS
  listHeaderSection: { flexDirection: 'row', alignItems: 'center', marginTop: 8, marginBottom: 12, paddingHorizontal: 4 },
  listSectionTitle: { fontSize: 15, fontWeight: '700', color: '#222', marginLeft: 8 },
  listContainer: { paddingBottom: 20 },
  clientCard: { backgroundColor: 'white', borderRadius: 12, padding: 12, marginBottom: 10, borderWidth: 1, borderColor: '#EAEAEA', borderLeftWidth: 4, borderLeftColor: PRIMARY_BLUE, position: 'relative' },
  clientCardLibre: { borderLeftColor: '#90A4AE', backgroundColor: '#FAFAFA', borderStyle: 'dashed' },
  editCardButton: { position: 'absolute', top: 12, right: 12, padding: 6, zIndex: 10, backgroundColor: '#F5F6FA', borderRadius: 10 },
  clientHeader: { flexDirection: 'row', alignItems: 'center' },
  avatarBadge: { width: 34, height: 34, borderRadius: 17, backgroundColor: '#E8EAF6', justifyContent: 'center', alignItems: 'center' },
  avatarBadgeLibre: { backgroundColor: '#ECEFF1' },
  avatarText: { color: PRIMARY_BLUE, fontWeight: 'bold', fontSize: 12 },
  clientMeta: { marginLeft: 10, flex: 1, paddingRight: 32 },
  clientName: { fontSize: 14, fontWeight: 'bold', color: '#222' },
  clientNameLibre: { color: '#78909C', fontWeight: '500', fontSize: 13 },
  cassetteTag: { fontSize: 11, color: '#777', fontStyle: 'italic', marginTop: 1 },
  infoCompactContainer: { marginTop: 8, paddingTop: 8, borderTopWidth: 1, borderTopColor: '#F5F5F5' },
  infoRow: { flexDirection: 'row', alignItems: 'center', marginVertical: 2 },
  infoText: { marginLeft: 6, fontSize: 12, color: '#555' },
  
  // MODAL (AMÉLIORÉE POUR CLAVIER)
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  modalContainer: { backgroundColor: 'white', borderTopLeftRadius: 24, borderTopRightRadius: 24, paddingTop: 20, maxHeight: '90%', flexShrink: 1 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingBottom: 15, borderBottomWidth: 1, borderColor: '#EFEFEF' },
  modalTitle: { fontSize: 16, fontWeight: 'bold', color: '#111' },
  modalForm: { paddingHorizontal: 20 },
  
  // Disposition en grille pour gagner de la place
  formRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
  formCol: { flex: 0.48 },
  
  inputLabel: { fontSize: 12, fontWeight: '600', color: '#555', marginBottom: 5, marginTop: 10 },
  modalInput: { backgroundColor: '#F5F6FA', borderRadius: 10, paddingHorizontal: 10, height: 40, borderWidth: 1, borderColor: '#E2E4E8', color: '#222', fontSize: 13 },
  
  modalFooter: { flexDirection: 'row', padding: 15, borderTopWidth: 1, borderColor: '#EFEFEF', backgroundColor: '#FAFAFA', paddingBottom: Platform.OS === 'ios' ? 25 : 15 },
  modalBtn: { flex: 1, height: 44, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginHorizontal: 6 },
  modalBtnCancel: { backgroundColor: '#ECEFF1' },
  modalBtnCancelText: { color: '#546E7A', fontWeight: '600', fontSize: 14 },
  modalBtnSave: { backgroundColor: PRIMARY_BLUE },
  modalBtnSaveText: { color: 'white', fontWeight: 'bold' }
});