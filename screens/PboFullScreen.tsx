import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ActivityIndicator, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux'; 
import { AnyAction, ThunkDispatch } from '@reduxjs/toolkit';
import { enregistrerPboFull, checkClientByAbn, clearClientInfo, checkPboByCode, clearPboInfo } from '../redux/slices/pboslices'; 
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import * as ImagePicker from 'expo-image-picker';

const PRIMARY_BLUE = '#1A237E';
const SUCCESS_GREEN = '#388E3C';

const PboInfoCard = ({ pboInfo }: { pboInfo: any }) => {
  const nomPbo = pboInfo.nomPbo || pboInfo.idPbo || pboInfo.codePbo || pboInfo.data?.idPbo || 'PBO Trouvé';
  const localisation = pboInfo.ville || pboInfo.localisation || pboInfo.data?.ville || '';
  return (
    <View style={[styles.dashedCard, { borderColor: SUCCESS_GREEN, backgroundColor: '#F1F8E9', marginTop: 12 }]}>
      <View style={styles.profileIconContainer}>
        <Ionicons name="cube" size={36} color={SUCCESS_GREEN} />
      </View>
      <View style={styles.infoContent}>
        <Text style={[styles.clientLabel, { color: SUCCESS_GREEN }]}>PBO Marqué</Text>
        <Text style={[styles.clientDetail, { fontWeight: 'bold', fontSize: 15, marginTop: 4, color: '#333' }]}>
          Nom : {nomPbo}
        </Text>
        {localisation ? <Text style={styles.clientDetail}>Zone : {localisation}</Text> : null}
      </View>
    </View>
  );
};

const ClientInfoCard = ({ clientInfo, currentLoginId }: { clientInfo: any, currentLoginId: string }) => {
  const details = clientInfo.data || {};
  const nestedData = details.data || {}; 
  const nom = clientInfo.label || details.lastName || 'Nom inconnu';
  const abonnement = clientInfo.loginId || details.msisdn || currentLoginId || 'Non trouvé';
  const arrondissement = nestedData.district || details.district || 'Non défini';
  const adresse = clientInfo.address || details.address || details.street || nestedData.street || 'Non renseignée';
  const telephone = clientInfo.officePhone || clientInfo.homePhone || details.officePhone || details.phone || '';

  return (
    <View style={styles.dashedCard}>
      <View style={styles.profileIconContainer}>
        <Ionicons name="person-circle" size={40} color="#388E3C" />
      </View>
      <View style={styles.infoContent}>
        <Text style={styles.clientLabel}>{nom}</Text>
        <View style={styles.infoRow}>
          <Ionicons name="card-outline" size={16} color="#4E342E" style={{marginRight: 5}} />
          <Text style={styles.clientDetail}>Abonnement : {abonnement}</Text>
        </View>
        {telephone ? (
          <View style={styles.infoRow}>
            <Ionicons name="call-outline" size={16} color="#4E342E" style={{marginRight: 5}} />
            <Text style={styles.clientDetail}>Téléphone : {telephone}</Text>
          </View>
        ) : null}
        <View style={styles.infoRow}>
          <Ionicons name="location-outline" size={16} color="#4E342E" style={{marginRight: 5}} />
          <Text style={styles.clientDetail}>Arrondissement : {arrondissement}</Text>
        </View>
        <View style={styles.infoRow}>
          <Ionicons name="home-outline" size={16} color="#4E342E" style={{marginRight: 5}} />
          <Text style={styles.clientDetail}>Adresse : {adresse}</Text>
        </View>
      </View>
    </View>
  );
};

export default function PboFullScreen() {
  const navigation = useNavigation();
  const dispatch: ThunkDispatch<any, any, AnyAction> = useDispatch();
  
  const { loading, clientInfo, loadingCheckClient, errorCheckClient } = useSelector((state: any) => state.pbos);

  const [localPboInfo, setLocalPboInfo] = useState<any>(null);
  const [localLoadingCheckPbo, setLocalLoadingCheckPbo] = useState(false);
  const [localErrorCheckPbo, setLocalErrorCheckPbo] = useState<string | null>(null);
  const [pboCheckDone, setPboCheckDone] = useState(false);
  const [loginCheckDone, setLoginCheckDone] = useState(false);

  const isClientFound = !!clientInfo;
  const isPboFound = !!localPboInfo;

  const [activeField, setActiveField] = useState<string | null>(null);
  const [isPboNomme, setIsPboNomme] = useState<boolean | null>(null);
  const [pboMa, setPboMa] = useState('');
  const [pboNumero, setPboNumero] = useState('');
  const [nomClient, setNomClient] = useState('');
  const [phoneNumber, setPhoneNumber] = useState(''); 
  const [loginId, setLoginId] = useState('');          
  const [photoPboUri, setPhotoPboUri] = useState<string | null>(null);
  const [photoEnvironnementUri, setPhotoEnvironnementUri] = useState<string | null>(null);

  useEffect(() => {
    if (clientInfo) {
      const details = clientInfo.data || {};
      const nom = clientInfo.label || details.lastName || "";
      const tel = clientInfo.officePhone || details.officePhone || clientInfo.homePhone || "";
      setNomClient(nom);
      setPhoneNumber(tel);
    } else {
      setNomClient('');
      setPhoneNumber('');
    }
  }, [clientInfo]);

  const pboConditionOk = isPboNomme === false || (isPboNomme === true && isPboFound);
  const auMoinsUnCheckFait = pboCheckDone || loginCheckDone;
  const canSubmit = !loading && pboConditionOk && auMoinsUnCheckFait;

  const handlePickPhoto = async (type: 'pbo' | 'env') => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission requise', "Nous avons besoin de l'accès à l'appareil photo pour continuer.");
      return;
    }
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      if (type === 'pbo') setPhotoPboUri(result.assets[0].uri);
      else setPhotoEnvironnementUri(result.assets[0].uri);
    }
  };

  const resetPbo = () => {
    setLocalPboInfo(null);
    setLocalErrorCheckPbo(null);
    setPboCheckDone(false);
    setPboMa('');
    setPboNumero('');
    dispatch(clearPboInfo());
  };

  const resetLogin = () => {
    dispatch(clearClientInfo());
    setLoginCheckDone(false);
    setLoginId('');
    setNomClient('');
    setPhoneNumber('');
  };

  const handleCheckPbo = async () => {
    if (!pboMa.trim() || !pboNumero.trim()) {
      Alert.alert('Erreur', 'Veuillez remplir le code MA et le numéro du PBO.');
      return;
    }
    const pboFinal = `BZV-${pboMa.trim().toUpperCase()}-PB${pboNumero.trim()}`;
    setLocalLoadingCheckPbo(true);
    setLocalErrorCheckPbo(null);
    setLocalPboInfo(null);
    try {
      const response = await fetch('https://control-api-dev.speedpro.cg/api/v1/ftth/pbo/check-by-idpbo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idPbo: pboFinal }),
      });
      const rawText = await response.text();
      let json: any;
      try { json = JSON.parse(rawText); } catch (e) {
        setLocalErrorCheckPbo('Réponse invalide du serveur.');
        setPboCheckDone(true);
        return;
      }
      if (json && json.success === true && json.data) {
        setLocalPboInfo(json.data);
        setLocalErrorCheckPbo(null);
      } else {
        setLocalErrorCheckPbo(json?.message || 'PBO non Marqué ou invalide.');
      }
    } catch (err) {
      setLocalErrorCheckPbo('Erreur de connexion au serveur.');
    } finally {
      setLocalLoadingCheckPbo(false);
      setPboCheckDone(true);
    }
  };

  const handleCheckLogin = async () => {
    if (!loginId.trim()) {
      Alert.alert('Erreur', 'Veuillez saisir un Login ID.');
      return;
    }
    await dispatch(checkClientByAbn(loginId.trim()) as any);
    setLoginCheckDone(true);
  };

  const handleValider = async () => {
    if (isPboNomme === null) {
      Alert.alert('Erreur', 'Veuillez spécifier si le PBO est nommé ou non.');
      return;
    }
    let pboFinal = '';
    if (isPboNomme) {
      if (!isPboFound) {
        Alert.alert('Vérification requise', "Veuillez valider le PBO à l'aide du bouton de recherche avant d'enregistrer.");
        return;
      }
      pboFinal = `BZV-${pboMa.trim().toUpperCase()}-PB${pboNumero.trim()}`;
    }
    const donneesTicket = {
      isPboNomme,
      pbo: isPboNomme ? pboFinal : null,
      nomClient: nomClient.trim(),
      phoneNumber: phoneNumber.trim(),
      loginId: loginId.trim(),
      photoPbo: photoPboUri,
      photoEnvironnement: photoEnvironnementUri
    };
    try {
      await dispatch(enregistrerPboFull(donneesTicket) as any).unwrap();
      Alert.alert('Succès', 'Enregistré avec succès !', [{
        text: 'OK', onPress: () => {
          dispatch(clearClientInfo());
          dispatch(clearPboInfo());
          setLocalPboInfo(null); setLocalErrorCheckPbo(null);
          setPboCheckDone(false); setLoginCheckDone(false);
          setLoginId(''); setPboMa(''); setPboNumero('');
          setPhotoPboUri(null); setPhotoEnvironnementUri(null);
          navigation.goBack();
        }
      }]);
    } catch (error: any) {
      Alert.alert('Erreur', error || "Une erreur est survenue lors de l'enregistrement.");
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#F5F6FA' }}>
      {/* ── HEADER AVEC LE BOUTON HISTORIQUE INTÉGRÉ ── */}
      <View style={styles.headerContainer}>
        <View>
          <Text style={styles.headerSubtitle}>suivi infrastructures</Text>
          <Text style={styles.headerTitle}>PBO Full</Text>
        </View>
        <TouchableOpacity 
          style={styles.headerHistoryBtn} 
          onPress={() => navigation.navigate('TicketsTraites' as never)}
        >
          <Ionicons name="time-outline" size={24} color={PRIMARY_BLUE} />
        </TouchableOpacity>
      </View>

      <KeyboardAwareScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContainer}
        enableOnAndroid={true}
        extraScrollHeight={100}
        showsVerticalScrollIndicator={false}
      >
        {isPboNomme === null ? (
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Le PBO est-il Marqué ?</Text>
            <View style={styles.choiceContainer}>
              <TouchableOpacity style={[styles.choiceBtn, isPboNomme === true && styles.choiceBtnActive]} onPress={() => setIsPboNomme(true)}>
                <Ionicons name="checkmark-circle" size={20} color={isPboNomme === true ? 'white' : '#666'} />
                <Text style={[styles.choiceText, isPboNomme === true && styles.choiceTextActive]}>Oui</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.choiceBtn, isPboNomme === false && styles.choiceBtnActive]} onPress={() => setIsPboNomme(false)}>
                <Ionicons name="close-circle" size={20} color={isPboNomme === false ? 'white' : '#666'} />
                <Text style={[styles.choiceText, isPboNomme === false && styles.choiceTextActive]}>Non</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View style={[styles.card, styles.compactCard]}>
            <View style={styles.compactContent}>
              <Ionicons name={isPboNomme ? "checkmark-circle" : "close-circle"} size={22} color={PRIMARY_BLUE} />
              <Text style={styles.compactText}>PBO : <Text style={{ fontWeight: 'bold' }}>{isPboNomme ? 'Oui' : 'Non'}</Text></Text>
            </View>
            <TouchableOpacity onPress={() => { setIsPboNomme(null); resetPbo(); }} style={styles.editButton}>
              <Ionicons name="create-outline" size={20} color={PRIMARY_BLUE} />
            </TouchableOpacity>
          </View>
        )}

        {isPboNomme === true && (
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Identifiant du PBO</Text>
            <View style={styles.checkContainer}>
              <View style={[styles.pboInputGroup, { flex: 1 }]}>
                <View style={styles.prefixBadge}><Text style={styles.prefixText}>BZV</Text></View>
                <Text style={styles.separator}>-</Text>
                <TextInput
                  style={[styles.inputField, styles.styledInput, { flex: 1.5, textAlign: 'center' }, activeField === 'pboMa' && styles.inputFieldActive]}
                  placeholder="MA"
                  value={pboMa}
                  onChangeText={(t) => { setPboMa(t); setLocalPboInfo(null); setLocalErrorCheckPbo(null); setPboCheckDone(false); dispatch(clearPboInfo()); }}
                  maxLength={4}
                  editable={!pboCheckDone}
                  onFocus={() => setActiveField('pboMa')}
                  onBlur={() => setActiveField(null)}
                />
                <Text style={styles.separator}>-</Text>
                <View style={[styles.pboNumberContainer, { flex: 2 }, activeField === 'pboNumero' && styles.inputWrapperActive]}>
                  <Text style={styles.pboPrefixText}>PB</Text>
                  <TextInput
                    style={[styles.inputField, { flex: 1, paddingLeft: 5 }]}
                    placeholder="Num"
                    value={pboNumero}
                    onChangeText={(n) => { setPboNumero(n.replace(/[^0-9]/g, '')); setLocalPboInfo(null); setLocalErrorCheckPbo(null); setPboCheckDone(false); dispatch(clearPboInfo()); }}
                    keyboardType="numeric"
                    editable={!pboCheckDone}
                    onFocus={() => setActiveField('pboNumero')}
                    onBlur={() => setActiveField(null)}
                  />
                </View>
              </View>
              {!pboCheckDone ? (
                <TouchableOpacity style={styles.smallCheckBtn} onPress={handleCheckPbo} disabled={localLoadingCheckPbo}>
                  {localLoadingCheckPbo ? <ActivityIndicator color={PRIMARY_BLUE} /> : <Ionicons name="search" size={22} color={PRIMARY_BLUE} />}
                </TouchableOpacity>
              ) : (
                <TouchableOpacity style={styles.clearBtn} onPress={resetPbo}>
                  <Ionicons name="close" size={20} color="#D32F2F" />
                </TouchableOpacity>
              )}
            </View>
            {localPboInfo && <PboInfoCard pboInfo={localPboInfo} />}
            {localErrorCheckPbo && (
              <View style={styles.errorBox}>
                <Ionicons name="close-circle-outline" size={16} color="#D32F2F" style={{ marginRight: 6 }} />
                <Text style={styles.errorBoxText}>{localErrorCheckPbo}</Text>
              </View>
            )}
          </View>
        )}

        {isPboNomme === false && (
          <View style={[styles.card, styles.warningCard]}>
            <Ionicons name="warning-outline" size={26} color="#D84315" style={styles.warningIcon} />
            <Text style={styles.warningText}>Rapprochez-vous à moins d'un mètre du PBO.</Text>
          </View>
        )}

        {isPboNomme !== null && (
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Informations Complémentaires</Text>
            
            <View style={styles.checkContainer}>
              <TextInput 
                style={[styles.inputWrapper, activeField === 'loginId' && styles.activeInput, { flex: 1, marginRight: 10 }]} 
                placeholder="NumAbonnement" 
                value={loginId} 
                onChangeText={(t) => { setLoginId(t); dispatch(clearClientInfo()); setLoginCheckDone(false); }}
                editable={!loginCheckDone}
                onFocus={() => setActiveField('loginId')}
                onBlur={() => setActiveField(null)}
              />
              {!loginCheckDone ? (
                <TouchableOpacity style={styles.smallCheckBtn} onPress={handleCheckLogin} disabled={loadingCheckClient}>
                  {loadingCheckClient ? <ActivityIndicator color={PRIMARY_BLUE} /> : <Ionicons name="search" size={22} color={PRIMARY_BLUE} />}
                </TouchableOpacity>
              ) : (
                <TouchableOpacity style={styles.clearBtn} onPress={resetLogin}>
                  <Ionicons name="close" size={20} color="#D32F2F" />
                </TouchableOpacity>
              )}
            </View>

            {clientInfo && <ClientInfoCard clientInfo={clientInfo} currentLoginId={loginId} />}
            {errorCheckClient && (
              <View style={styles.errorBox}>
                <Ionicons name="close-circle-outline" size={16} color="#D32F2F" style={{ marginRight: 6 }} />
                <Text style={styles.errorBoxText}>{errorCheckClient}</Text>
              </View>
            )}

            <TextInput 
              editable={isClientFound}
              style={[styles.inputWrapper, activeField === 'phoneNumber' && styles.activeInput, !isClientFound && styles.disabledInput, { marginTop: 8 }]} 
              placeholder="Numéro de téléphone" 
              value={phoneNumber} 
              onChangeText={setPhoneNumber} 
              keyboardType="phone-pad"
              onFocus={() => setActiveField('phoneNumber')}
              onBlur={() => setActiveField(null)}
            />
            <TextInput 
              editable={isClientFound}
              style={[styles.inputWrapper, activeField === 'nomClient' && styles.activeInput, !isClientFound && styles.disabledInput]} 
              placeholder="Nom complet" 
              value={nomClient} 
              onChangeText={setNomClient}
              onFocus={() => setActiveField('nomClient')}
              onBlur={() => setActiveField(null)}
            />

            <View style={styles.photoRow}>
              <View style={styles.photoContainer}>
                <Text style={styles.photoLabel}>Photo PBO</Text>
                <View style={styles.photoDashedBox}>
                  {!photoPboUri ? (
                    <TouchableOpacity style={styles.photoPlaceholder} onPress={() => handlePickPhoto('pbo')}>
                      <Ionicons name="camera-outline" size={28} color="#757575" />
                      <Text style={styles.photoPlaceholderText}>Prendre</Text>
                    </TouchableOpacity>
                  ) : (
                    <View style={styles.photoPreviewContainer}>
                      <Image source={{ uri: photoPboUri }} style={styles.photoImage} />
                      <View style={styles.photoActions}>
                        <TouchableOpacity style={[styles.photoActionBtn, { backgroundColor: PRIMARY_BLUE }]} onPress={() => handlePickPhoto('pbo')}>
                          <Ionicons name="refresh" size={14} color="white" />
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.photoActionBtn, { backgroundColor: '#D32F2F' }]} onPress={() => setPhotoPboUri(null)}>
                          <Ionicons name="trash-outline" size={14} color="white" />
                        </TouchableOpacity>
                      </View>
                    </View>
                  )}
                </View>
              </View>
              <View style={styles.photoContainer}>
                <Text style={styles.photoLabel}>Photo Env.</Text>
                <View style={styles.photoDashedBox}>
                  {!photoEnvironnementUri ? (
                    <TouchableOpacity style={styles.photoPlaceholder} onPress={() => handlePickPhoto('env')}>
                      <Ionicons name="camera-outline" size={28} color="#757575" />
                      <Text style={styles.photoPlaceholderText}>Prendre</Text>
                    </TouchableOpacity>
                  ) : (
                    <View style={styles.photoPreviewContainer}>
                      <Image source={{ uri: photoEnvironnementUri }} style={styles.photoImage} />
                      <View style={styles.photoActions}>
                        <TouchableOpacity style={[styles.photoActionBtn, { backgroundColor: PRIMARY_BLUE }]} onPress={() => handlePickPhoto('env')}>
                          <Ionicons name="refresh" size={14} color="white" />
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.photoActionBtn, { backgroundColor: '#D32F2F' }]} onPress={() => setPhotoEnvironnementUri(null)}>
                          <Ionicons name="trash-outline" size={14} color="white" />
                        </TouchableOpacity>
                      </View>
                    </View>
                  )}
                </View>
              </View>
            </View>

            <TouchableOpacity 
              style={[styles.submitBtn, !canSubmit && styles.submitBtnDisabled]} 
              onPress={handleValider} 
              disabled={!canSubmit}
              activeOpacity={0.8}
            >
              {loading ? (
                <ActivityIndicator size="small" color="white" style={{ marginRight: 8 }} />
              ) : (
                <Ionicons name="checkmark-sharp" size={20} color="white" style={{ marginRight: 8 }} />
              )}
              <Text style={styles.submitBtnText}>{loading ? 'Envoi en cours...' : 'Enregistrer le PBO'}</Text>
            </TouchableOpacity>

            {!canSubmit && isPboNomme !== null && (
              <Text style={styles.submitHint}>
                {isPboNomme && !isPboFound
                  ? 'Vérifiez le PBO pour activer l\'enregistrement'
                  : 'Effectuez au moins un check pour activer l\'enregistrement'}
              </Text>
            )}
          </View>
        )}
      </KeyboardAwareScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: PRIMARY_BLUE,
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    // Flex ajouté pour aligner le texte à gauche et le bouton à droite
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerSubtitle: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 14,
    textTransform: 'lowercase',
    fontWeight: '500',
    letterSpacing: 0.5,
  },
  headerTitle: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 2,
  },
  // Nouveau bouton d'historique intégré au header
  headerHistoryBtn: {
    backgroundColor: 'white',
    height: 40,
    width: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  container: { flex: 1 }, 
  scrollContainer: { padding: 15 },
  card: { backgroundColor: 'white', borderRadius: 12, padding: 18, marginBottom: 15, elevation: 3 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 12 },
  smallCheckBtn: { width: 45, height: 45, justifyContent: 'center', alignItems: 'center', marginLeft: 5 },
  clearBtn: { width: 45, height: 45, justifyContent: 'center', alignItems: 'center', marginLeft: 5, backgroundColor: '#FFEBEE', borderRadius: 10, borderWidth: 1, borderColor: '#FFCDD2' },
  errorBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFEBEE', borderStyle: 'dashed', borderWidth: 1.5, borderColor: '#D32F2F', borderRadius: 10, padding: 10, marginTop: 8 },
  errorBoxText: { color: '#D32F2F', fontSize: 13, fontWeight: '600', flex: 1 },
  compactCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 12, backgroundColor: '#E8EAF6', borderRadius: 12 },
  compactContent: { flexDirection: 'row', alignItems: 'center' },
  compactText: { marginLeft: 8, fontSize: 14, color: '#1A237E' },
  editButton: { padding: 4, backgroundColor: '#FFF', borderRadius: 6, borderWidth: 1, borderColor: '#C5CAE9' },
  choiceContainer: { flexDirection: 'row', justifyContent: 'space-between' },
  choiceBtn: { flex: 1, flexDirection: 'row', backgroundColor: '#F0F2F5', padding: 12, borderRadius: 10, justifyContent: 'center', marginHorizontal: 5 },
  choiceBtnActive: { backgroundColor: PRIMARY_BLUE },
  choiceText: { marginLeft: 8, fontWeight: '600' },
  choiceTextActive: { color: 'white' },
  pboInputGroup: { flexDirection: 'row', alignItems: 'center' },
  prefixBadge: { backgroundColor: '#E8F5E9', paddingHorizontal: 10, height: 45, borderRadius: 10, justifyContent: 'center', borderWidth: 1, borderColor: '#388E3C' },
  prefixText: { color: '#388E3C', fontWeight: 'bold' },
  separator: { fontSize: 18, fontWeight: 'bold', paddingHorizontal: 3 },
  styledInput: { backgroundColor: '#F0F2F5', height: 45, borderRadius: 10 },
  pboNumberContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F0F2F5', height: 45, borderRadius: 10, paddingHorizontal: 8 },
  pboPrefixText: { fontWeight: 'bold', color: '#666', fontSize: 13 },
  warningCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF8E1', borderWidth: 1, borderColor: '#d2850a', borderRadius: 12, padding: 18, marginBottom: 15 },
  warningIcon: { marginRight: 12 },
  warningText: { flex: 1, color: '#d2850a' },
  inputWrapper: { backgroundColor: '#F0F2F5', borderRadius: 10, paddingHorizontal: 10, height: 45, marginBottom: 10, borderWidth: 1, borderColor: 'transparent' },
  disabledInput: { backgroundColor: '#E0E0E0', color: '#9E9E9E' }, 
  inputField: { flex: 1, height: '100%' },
  inputFieldActive: { borderColor: PRIMARY_BLUE, borderWidth: 1.5 },
  inputWrapperActive: { borderColor: PRIMARY_BLUE, borderWidth: 1.5 },
  activeInput: { borderColor: PRIMARY_BLUE, backgroundColor: '#FFFFFF', shadowColor: PRIMARY_BLUE, shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.3, shadowRadius: 5, elevation: 5 },
  checkContainer: { flexDirection: 'row', alignItems: 'center' },
  submitBtn: { backgroundColor: PRIMARY_BLUE, flexDirection: 'row', height: 50, borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginTop: 15 },
  submitBtnDisabled: { backgroundColor: '#BDBDBD' },
  submitBtnText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
  submitHint: { textAlign: 'center', fontSize: 12, color: '#999', marginTop: 8, fontStyle: 'italic' },
  errorText: { color: 'red', fontSize: 12, marginBottom: 10, marginTop: -5 },
  dashedCard: { borderWidth: 2, borderColor: '#388E3C', borderStyle: 'dashed', borderRadius: 12, padding: 15, marginBottom: 15, flexDirection: 'row', alignItems: 'center', backgroundColor: '#F1F8E9' },
  profileIconContainer: { marginRight: 15 },
  infoContent: { flex: 1 },
  clientLabel: { fontSize: 16, fontWeight: 'bold', color: '#1B5E20' },
  clientDetail: { fontSize: 13, color: '#4E342E', marginTop: 2 },
  infoRow: { flexDirection: 'row', alignItems: 'center', marginTop: 3 },
  photoRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10, marginBottom: 10 },
  photoContainer: { flex: 1, marginHorizontal: 4 },
  photoLabel: { fontSize: 14, fontWeight: '600', color: '#333', marginBottom: 6 },
  photoDashedBox: { height: 120, borderWidth: 1.5, borderColor: '#9E9E9E', borderStyle: 'dashed', borderRadius: 10, backgroundColor: '#F0F2F5', overflow: 'hidden' },
  photoPlaceholder: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  photoPlaceholderText: { fontSize: 12, color: '#757575', marginTop: 4 },
  photoPreviewContainer: { flex: 1, position: 'relative' },
  photoImage: { width: '100%', height: '100%' },
  photoActions: { position: 'absolute', bottom: 5, right: 5, flexDirection: 'row' },
  photoActionBtn: { width: 28, height: 28, borderRadius: 14, justifyContent: 'center', alignItems: 'center', marginLeft: 6, elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.22, shadowRadius: 2.22 },
});