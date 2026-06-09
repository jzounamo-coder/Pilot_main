import { Ionicons, Feather } from '@expo/vector-icons';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import * as React from 'react';
import { useState, useEffect } from 'react'; 
import axios from 'axios'; 
import { useDispatch } from 'react-redux'; 
import * as SecureStore from 'expo-secure-store'; // Ajouté pour la vérification
import { addConversation } from '../redux/slices/chatslices'; 
import PoteauxScreen, { PoteauDetailScreen } from '../screens/PoteauxScreen';
import DemandePoteauScreen from '../screens/DemandePoteauScreen'; 
import RenseignerPoteauScreen from '../screens/RenseignerPoteauScreen';
import DemandeCreationScreen from '../screens/DemandeCreationScreen';
import NouvelleDemandeScreen from '../screens/NouvelleDemandeScreen';

import { ColorSchemeName, Dimensions, Text, TouchableOpacity, View, StyleSheet, TextInput, FlatList, Alert, ActivityIndicator } from 'react-native'; 

import Colors from '../constants/Colors';
import TabOneScreen from '../screens/ChatsScreen';
import TabTwoScreen from '../screens/ListepboScreen';
import ChatRoomScreen from '../screens/ChatRoomScreen';
import StatusScreen from '../screens/StatusScreen';
import TicketFormScreen from '../screens/TicketFormScreen';
import TicketDetailScreen from '../screens/TicketDetailScreen';
import MapScreen from '../screens/MapScreen'; 
import ContactPickerScreen from '../screens/ContactPickerScreen'; 

// IMPORTS AUTHENTIFICATION
import LoginScreen from '../screens/auth/LoginScreen';
import ForgotPasswordScreen from '../screens/auth/ForgotPasswordScreen';
import OTPScreen from '../screens/auth/OTPScreen';
import ResetPasswordScreen from '../screens/auth/ResetPasswordScreen';

// IMPORTS PBO
import PboFormScreen from '../screens/pboFormScreen'; 
import PboDetailScreen from '../screens/pboDetailScreen';

// IMPORT DÉTAIL CLIENT
import ClientDetailScreen from '../screens/ClientDetailScreen';

// NOUVELLES IMPORTATIONS
import OEOTODlScreen from '../screens/OEOTODlScreen';
import ClientJobDetailScreen from '../screens/ClientJobDetailScreen';
import VisualisationScreen from '../screens/VisualisationScreen';
import SummaryScreen from '../screens/SummaryScreen'; 
import InstallationsScreen from '../screens/InstallationsScreen';
import ValidationInstallationScreen from '../screens/ValidationInstallationScreen';
import PboFullScreen from '../screens/PboFullScreen';
import TicketsTraites from '../screens/Listepbofull';
import RetourTerrainPbo from '../screens/RetourTerrainPbo';
import ListeRetoursTerrain from '../screens/ListeRetoursTerrain'; 

const PRIMARY_BLUE = '#1A237E';

type RootStackParamList = {
  Login: undefined;
  ForgotPassword: undefined;
  OTP: undefined;
  ResetPassword: undefined;
  Root: any;
  ChatRoom: any;
  CreateGroup: any;
  TicketForm: any; 
  TicketDetail: any;
  PboForm: any;   
  PboDetail: any; 
  ClientDetail: any;
  ClientJobDetail: { client: any };
  Visualisation: { client: any }; 
  SummaryScreen: { client: any, photos: any }; 
  Map: undefined; 
  ContactPicker: undefined; 
  PoteauDetail: { poteau: any }; 
  DemandePoteau: undefined;
  RenseignerPoteau: { poteau: any };
  NotFound: any;
  Installations: undefined;
  PboFull: undefined; 
  TicketsTraites: undefined; 
  RetourTerrainPbo: undefined; 
  ListeRetoursTerrain: undefined; 
  NouvelleDemande: undefined;
  nouvelleDemande: undefined;
  DemandeCreation: undefined;
  ValidationInstallation: {  
    installation: {
      id: string;
      nom: string;
      tel: string;
      ville: string;
      arrondissement: string;
      type: 'OE' | 'OT' | 'OD';
      statut: 'En attente' | 'En cours' | 'Validé';
      latitude: number;
      longitude: number;
    };
  };
};

const { width } = Dimensions.get('screen');

export default function Navigation({ colorScheme }: { colorScheme: ColorSchemeName }) {
    return <RootNavigator />;
}

// --- ÉCRAN DE CRÉATION DE GROUPE ---
const CreateGroupScreen = () => {
    const navigation = useNavigation<any>();
    const dispatch = useDispatch();
    const [groupName, setGroupName] = useState('');
    const [contacts, setContacts] = useState<any[]>([]);
    const [filteredContacts, setFilteredContacts] = useState<any[]>([]); 
    const [loading, setLoading] = useState(true);
    const [searchText, setSearchText] = useState('');

    useEffect(() => {
        fetchSpeedProUsers();
    }, []);

    const fetchSpeedProUsers = async () => {
        try {
            const response = await axios.get('https://control-api1.speedpro.cg/api/v1/dry/dry-user');
            const rawData = response.data.data || [];
            
            const formatted = rawData.map((u: any) => ({
                id: u._id || u.id,
                name: u.person?.label || u.label || "Utilisateur SpeedPro",
                number: u.person?.phone || u.phone || "Pas de numéro",
                selected: false 
            })).sort((a: any, b: any) => a.name.localeCompare(b.name));

            setContacts(formatted);
            setFilteredContacts(formatted);
        } catch (error) {
            console.error("Erreur API SpeedPro:", error);
            Alert.alert("Erreur", "Impossible de charger les utilisateurs.");
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (text: string) => {
        setSearchText(text);
        const filtered = contacts.filter(c => 
            c.name.toLowerCase().includes(text.toLowerCase()) || 
            c.number.includes(text)
        );
        setFilteredContacts(filtered);
    };

    const handleBackWithAlert = () => {
        const isNameFilled = groupName.trim().length > 0;
        const isMemberSelected = contacts.some((c: any) => c.selected === true);
        if (isNameFilled || isMemberSelected) {
            Alert.alert("Abandonner ?", "Voulez-vous vraiment annuler ?", [
                { text: "ANNULER", style: "cancel" },
                { text: "ABANDONNER", style: "destructive", onPress: () => navigation.goBack()}
            ]);
        } else { 
            navigation.goBack(); 
        }
    };

    const handleConfirmCreate = () => {
        if (!groupName.trim()) { 
            Alert.alert("Nom manquant", "Entrez un nom pour le groupe."); 
            return; 
        }
        
        const selectedMembers = contacts.filter(c => c.selected);
        if (selectedMembers.length === 0) {
            Alert.alert("Membres manquants", "Sélectionnez au moins un participant.");
            return;
        }

        const newGroupData = { 
            id: `group_${Date.now()}`, 
            name: groupName, 
            isGroup: true,
            members: selectedMembers,
            lastMessage: { 
                content: `Groupe "${groupName}" créé`, 
                createdAt: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) 
            }, 
            imageUri: 'https://static.vecteezy.com/ti/vecteur-libre/p1/26019617-groupe-profil-avatar-icone-vecteur-defaut-social-medias-forum-profil-photo-vectoriel.jpg' 
        };

        dispatch(addConversation(newGroupData));

        navigation.reset({
            index: 0,
            routes: [{ name: 'Root', params: { screen: 'Discussion', params: { newChat: newGroupData } } }],
        });
    };

    return (
        <View style={{ flex: 1, backgroundColor: 'white' }}>
            <View style={[styles.groupHeader, { backgroundColor: PRIMARY_BLUE }]}>
                <TouchableOpacity onPress={handleBackWithAlert} style={{ marginRight: 20 }}>
                    <Ionicons name="arrow-back" size={28} color="white" />
                </TouchableOpacity>
                <View>
                    <Text style={{ color: 'white', fontSize: 20, fontWeight: 'bold' }}>Nouveau groupe</Text>
                    <Text style={{ color: 'white', fontSize: 14 }}>
                        {loading ? 'Chargement...' : `${contacts.length} utilisateurs SpeedPro`}
                    </Text>
                </View>
            </View>

            <View style={{ padding: 15 }}>
                <TextInput 
                    placeholder="Nom du groupe..." 
                    style={{ fontSize: 18, borderBottomWidth: 1.5, borderBottomColor: PRIMARY_BLUE, paddingBottom: 5, marginBottom: 15 }} 
                    value={groupName} 
                    onChangeText={setGroupName} 
                />
                <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#f0f0f0', borderRadius: 8, paddingHorizontal: 10 }}>
                    <Ionicons name="search" size={20} color="gray" />
                    <TextInput 
                        placeholder="Rechercher un membre..." 
                        style={{ flex: 1, padding: 10 }} 
                        value={searchText}
                        onChangeText={handleSearch}
                    />
                </View>
            </View>

            {loading ? (
                <View style={{flex: 1, justifyContent: 'center'}}><ActivityIndicator color={PRIMARY_BLUE} size="large" /></View>
            ) : (
                <FlatList 
                    data={filteredContacts} 
                    keyExtractor={(item) => item.id} 
                    renderItem={({ item }) => (
                    <TouchableOpacity 
                        onPress={() => {
                            const newContacts = contacts.map(c => c.id === item.id ? {...c, selected: !c.selected} : c);
                            setContacts(newContacts);
                            setFilteredContacts(filteredContacts.map(c => c.id === item.id ? {...c, selected: !c.selected} : c));
                        }} 
                        style={[styles.contactItem, item.selected && { backgroundColor: '#E8EAF6' }]}
                    >
                        <View style={[styles.avatarBase, { backgroundColor: item.selected ? PRIMARY_BLUE : '#ccc' }]}>
                            {item.selected ? (
                                <Ionicons name="checkmark" size={24} color="white" />
                            ) : (
                                <Text style={{color: 'white', fontWeight: 'bold'}}>{item.name[0].toUpperCase()}</Text>
                            )}
                        </View>
                        <View style={{flex: 1}}>
                            <Text style={{ fontSize: 16, fontWeight: item.selected ? 'bold' : 'normal' }}>{item.name}</Text>
                            <Text style={{ fontSize: 12, color: '#666' }}>{item.number}</Text>
                        </View>
                    </TouchableOpacity>
                )} />
            )}

            <TouchableOpacity style={[styles.fab, { backgroundColor: PRIMARY_BLUE }]} onPress={handleConfirmCreate}>
                <Ionicons name="checkmark-done" size={30} color="white" />
            </TouchableOpacity>
        </View>
    );
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const RootNavigator = () => {
    const [isSearching, setIsSearching] = useState(false);
    const [searchText, setSearchText] = useState('');
    
    // Nouveaux états pour la navigation conditionnelle
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const token = await SecureStore.getItemAsync('userToken');
                setIsAuthenticated(!!token);
            } catch (e) {
                setIsAuthenticated(false);
            } finally {
                setIsLoading(false);
            }
        };
        checkAuth();
    }, []);

    const commonHeaderOptions = ({ navigation }: any) => ({
        headerShown: true,
        headerStyle: { backgroundColor: PRIMARY_BLUE },
        headerTintColor: 'white',
        headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginRight: 10 }}>
                <Ionicons name="arrow-back" size={26} color="white" />
            </TouchableOpacity>
        ),
    });

    if (isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color={PRIMARY_BLUE} />
            </View>
        );
    }

    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            {isAuthenticated ? (
                // --- ÉCRANS PRIVÉS (Connecté) ---
                <>
                    <Stack.Screen 
                        name="Root" 
                        component={BottomTabNavigator} 
                        options={({ navigation }) => ({
                            headerShown: true,
                            headerStyle: { backgroundColor: PRIMARY_BLUE },
                            headerTintColor: 'white',
                            headerTitle: () => isSearching ? (
                                <TextInput placeholder="Rechercher..." style={{ color: 'white', fontSize: 18, width: width * 0.7 }} autoFocus value={searchText} onChangeText={setSearchText} />
                            ) : (
                                <Text style={{ color: 'white', fontSize: 20, fontWeight: 'bold' }}>Pilot</Text>
                            ),
                            headerRight: () => (
                                <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 5 }}>
                                    <TouchableOpacity style={{ padding: 10 }} onPress={() => { setIsSearching(!isSearching); if (isSearching) setSearchText(''); }}>
                                        <Ionicons name={isSearching ? "close" : "search"} size={24} color="white" />
                                    </TouchableOpacity>
                                    {!isSearching && (
                                        <TouchableOpacity style={{ padding: 10 }} onPress={() => navigation.navigate('CreateGroup')}>
                                            <Ionicons name="people-outline" size={26} color="white" />
                                        </TouchableOpacity>
                                    )}
                                </View>
                            )
                        })} 
                    />
                    <Stack.Screen name="ChatRoom" component={ChatRoomScreen} options={commonHeaderOptions} />
                    <Stack.Screen name="TicketForm" component={TicketFormScreen} options={(props) => ({ ...commonHeaderOptions(props), title: 'Nouveau Ticket' })} />
                    <Stack.Screen name="TicketDetail" component={TicketDetailScreen} options={(props) => ({ ...commonHeaderOptions(props), title: 'Détails du Ticket' })} />
                    <Stack.Screen name="PboForm" component={PboFormScreen} options={(props) => ({ ...commonHeaderOptions(props), title: 'Nouveau PBO' })} />
                    <Stack.Screen name="PboDetail" component={PboDetailScreen} options={(props) => ({ ...commonHeaderOptions(props), title: 'Fiche Technique PBO' })} />
                    <Stack.Screen name="ClientDetail" component={ClientDetailScreen} options={(props) => ({ ...commonHeaderOptions(props), title: 'Fiche Information Client' })} />
                    <Stack.Screen name="ClientJobDetail" component={ClientJobDetailScreen} options={(props) => ({ ...commonHeaderOptions(props), title: 'Détails de l\'intervention' })} />
                    <Stack.Screen name="Visualisation" component={VisualisationScreen} options={(props) => ({ ...commonHeaderOptions(props), title: 'Photos de l\'intervention' })} />
                    <Stack.Screen name="Map" component={MapScreen} options={(props) => ({ ...commonHeaderOptions(props), title: 'Géolocalisation PBO' })} />
                    <Stack.Screen name="SummaryScreen" component={SummaryScreen} options={(props) => ({ ...commonHeaderOptions(props), title: 'Récapitulatif' })}/>
                    <Stack.Screen name="ContactPicker" component={ContactPickerScreen} options={(props) => ({ ...commonHeaderOptions(props), title: 'Sélectionner un contact' })} />
                    <Stack.Screen name="RenseignerPoteau" component={RenseignerPoteauScreen} options={{ title: 'Renseigner un poteau' }} />
                    <Stack.Screen name="DemandePoteau" component={DemandePoteauScreen} options={(props) => ({ ...commonHeaderOptions(props), title: 'Demande de Poteau'})} />
                    <Stack.Screen name="CreateGroup" component={CreateGroupScreen} options={{ headerShown: false }} />
                    <Stack.Screen name="PoteauDetail" component={PoteauDetailScreen} options={(props) => ({ ...commonHeaderOptions(props), title: 'Détails du Poteau' })} />
                    <Stack.Screen name="Installations" component={InstallationsScreen} options={(props) => ({ ...commonHeaderOptions(props), title: 'Installations Fibre' })} />
                    <Stack.Screen name="ValidationInstallation" component={ValidationInstallationScreen} options={(props) => ({ ...commonHeaderOptions(props), title: 'Validation Chantier' })} />
                    <Stack.Screen name="PboFull" component={PboFullScreen} options={(props) => ({ ...commonHeaderOptions(props), title: 'PBO Full' })} />
                    <Stack.Screen name="TicketsTraites" component={TicketsTraites} options={(props) => ({ ...commonHeaderOptions(props), title: 'PBO Traités' })} />
                    <Stack.Screen name="RetourTerrainPbo" component={RetourTerrainPbo} options={(props) => ({ ...commonHeaderOptions(props), title: 'Saturation' })} />
                    <Stack.Screen name="ListeRetoursTerrain" component={ListeRetoursTerrain} options={{ headerShown: false }} />
                    <Stack.Screen name="DemandeCreation" component={DemandeCreationScreen} options={{ headerShown: false }} />
                    <Stack.Screen name="NouvelleDemande" component={NouvelleDemandeScreen} options={{ headerShown: false }} />
                </>
            ) : (
                // --- ÉCRANS PUBLICS (Déconnecté) ---
                <>
                    <Stack.Screen name="Login" component={LoginScreen} />
                    <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
                    <Stack.Screen name="OTP" component={OTPScreen} />
                    <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
                </>
            )}
        </Stack.Navigator>
    );
}

const TopTab = createMaterialTopTabNavigator();

const menuList = [
  { label: 'Discussion', component: TabOneScreen, restrict: true },
  { label: 'Ticket', component: StatusScreen, restrict: true },
  { label: 'PBO', component: TabTwoScreen, restrict: true },
  { label: 'OE/OT/OD', component: OEOTODlScreen, restrict: true },
  { label: 'Installation', component: InstallationsScreen, restrict: true },
  { label: 'Poteaux', component: PoteauxScreen, restrict: true },
  { label: 'PBO Full', component: PboFullScreen, restrict: true },
  { label: 'Retour terrain', component: RetourTerrainPbo, restrict: true },
  { label: 'Demande Création', component: DemandeCreationScreen, restrict: true },
];

const BottomTabNavigator = () => {
    const nAfficherQueTroisPages = true; 
    const tabsPourAffichage = nAfficherQueTroisPages 
        ? menuList.filter(item => item.restrict === true) 
        : menuList;

    return (
        <TopTab.Navigator 
            initialRouteName={nAfficherQueTroisPages ? "PBO" : "Discussion"} 
            screenOptions={{
                tabBarLabelStyle: { fontWeight: 'bold', color: 'white', fontSize: 12 },
                tabBarStyle: { backgroundColor: PRIMARY_BLUE },
                tabBarIndicatorStyle: { backgroundColor: 'white', height: 3 },
                tabBarScrollEnabled: true, 
            }}
        >
            {tabsPourAffichage.map((tab) => (
                <TopTab.Screen 
                    key={tab.label} 
                    name={tab.label as any}
                    component={tab.component} 
                />
            ))}
        </TopTab.Navigator>
    );
}

const styles = StyleSheet.create({
    groupHeader: { paddingTop: 50, paddingBottom: 15, paddingHorizontal: 15, flexDirection: 'row', alignItems: 'center' },
    contactItem: { flexDirection: 'row', alignItems: 'center', padding: 15, borderBottomWidth: 0.5, borderBottomColor: '#eee' },
    avatarBase: { width: 45, height: 45, borderRadius: 22.5, marginRight: 15, justifyContent: 'center', alignItems: 'center' },
    fab: { position: 'absolute', bottom: 30, right: 30, width: 65, height: 65, borderRadius: 32.5, justifyContent: 'center', alignItems: 'center', elevation: 5 }
});