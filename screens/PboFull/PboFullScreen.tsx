import React from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import { styles, PRIMARY_BLUE } from './pboFull.style';
import { usePboFull } from './pboFull.hooks';
import { PboInfoCard } from './components/PboInfoCard';
import { ClientInfoCard } from './components/ClientInfoCard';

export default function PboFullScreen() {
  const {
    loading,
    clientInfo,
    loadingCheckClient,
    errorCheckClient,
    localPboInfo,
    localLoadingCheckPbo,
    localErrorCheckPbo,
    pboCheckDone,
    loginCheckDone,
    isClientFound,
    activeField,
    setActiveField,
    isPboNomme,
    setIsPboNomme,
    pboMa,
    isPboFound,
    setPboMa,
    pboNumero,
    setPboNumero,
    nomClient,
    setNomClient,
    phoneNumber,
    setPhoneNumber,
    loginId,
    setLoginId,
    photoPboUri,
    setPhotoPboUri,
    photoEnvironnementUri,
    setPhotoEnvironnementUri,
    canSubmit,
    handlePickPhoto,
    resetPbo,
    resetLogin,
    handleCheckPbo,
    handleCheckLogin,
    handleValider,
    navigation
  } = usePboFull();

  return (
    <View style={{ flex: 1, backgroundColor: '#F5F6FA' }}>
      {/* ── HEADER ── */}
      <View style={styles.headerContainer}>
        <View>
          <Text style={styles.headerSubtitle}>suivi infrastructures</Text>
          <Text style={styles.headerTitle}>PBO Full</Text>
        </View>
        <TouchableOpacity 
          style={styles.headerHistoryBtn} 
          onPress={() => navigation.navigate('TicketsTraites')}
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
        {/* Choix Initial : PBO Marqué */}
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

        {/* Section de vérification d'Identifiant PBO */}
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
                  onChangeText={(t) => { setPboMa(t); resetPbo(); setPboMa(t); }}
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
                    onChangeText={(n) => { setPboNumero(n.replace(/[^0-9]/g, '')); resetPbo(); setPboNumero(n.replace(/[^0-9]/g, '')); }}
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

        {/* Informations Complémentaires */}
        {isPboNomme !== null && (
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Informations Complémentaires</Text>
            
            <View style={styles.checkContainer}>
              <TextInput 
                style={[styles.inputWrapper, activeField === 'loginId' && styles.activeInput, { flex: 1, marginRight: 10 }]} 
                placeholder="NumAbonnement" 
                value={loginId} 
                onChangeText={(t) => { setLoginId(t); resetLogin(); setLoginId(t); }}
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

            {/* Captures Photos */}
            <View style={styles.photoRow}>
              {/* Photo PBO */}
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

              {/* Photo Environnement */}
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

            {/* Bouton de soumission */}
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
                  ? "Vérifiez le PBO pour activer l'enregistrement"
                  : "Effectuez au moins un check pour activer l'enregistrement"}
              </Text>
            )}
          </View>
        )}
      </KeyboardAwareScrollView>
    </View>
  );
}