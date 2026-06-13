import { Ionicons, Feather } from '@expo/vector-icons';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import * as React from 'react';
import { useState, useEffect } from 'react'; 
import axios from 'axios'; 
import { useDispatch, useSelector } from 'react-redux'; 
import * as SecureStore from 'expo-secure-store';
import { addConversation } from '../redux/slices/chatslices'; 
import PoteauxScreen, { PoteauDetailScreen } from '../screens/Poteaux/PoteauxScreen';
import DemandePoteauScreen from '../screens/demandePoteau/DemandePoteauScreen'; 
import RenseignerPoteauScreen from '../screens/RenseignerPoteau/RenseignerPoteau.screen';
import DemandeCreationScreen from '../screens/demandecreation/DemandeCreation.screen';
import NouvelleDemandeScreen from '../screens/NouvelleDemandeScreen/NouvelleDemandeScreen';
import { ColorSchemeName, Dimensions, Text, TouchableOpacity, View, StyleSheet, TextInput, FlatList, Alert, ActivityIndicator } from 'react-native'; 
import Colors from '../constants/Colors';
import TabOneScreen from '../screens/chat/chatScreen.screen';
import TabTwoScreen from '../screens/PboList/TabTwoScreen';
import ChatRoomScreen from '../screens/ChatRoom/ChatRoom.screen';
import StatusScreen from '../screens/Status/Status.screen';
import TicketFormScreen from '../screens/TicketForm/TicketForm.screen';
import TicketDetailScreen from '../screens/TicketDetail/TicketDetail.screen';
import MapScreen from '../screens/MapScreen/MapScreen'; 
import ContactPickerScreen from '../screens/ContactPicker/ContactPicker.screen'; 

// IMPORTS AUTHENTIFICATION
import LoginScreen from '../screens/auth/Login/Login.screen';
import ForgotPasswordScreen from '../screens/auth/ForgotPassword/ForgotPassword.screen';
import OTPScreen from '../screens/auth/OTP/OTP.screen';
import ResetPasswordScreen from '../screens/auth/ResetPassword/ResetPassword.screen';

// IMPORTS PBO
import PboFormScreen from '../screens/PboForm/PboForm.screen'; 
import PboDetailScreen from '../screens/pboDetail/PboDetailScreen';

// IMPORT CLIENT
import ClientDetailScreen from '../screens/client/ClientDetailScreen.screen';

// NOUVELLES IMPORTATIONS
import OEOTODlScreen from '../screens/OEOTOD/OEOTODScreen';
import ClientJobDetailScreen from '../screens/ClientJobDetail/ClientJobDetail.screen';
import VisualisationScreen from '../screens/Visualisation/Visualisation.screen';
import SummaryScreen from '../screens/Summary/Summary.screen'; 
import InstallationsScreen from '../screens/installations/InstallationsScreen';
import ValidationInstallationScreen from '../screens/ValidationInstallation/ValidationInstallation.screen';
import PboFullScreen from '../screens/PboFull/PboFullScreen';
import TicketsTraites from '../screens/TicketsTraites/TicketsTraites.Screen';
import RetourTerrainPbo from '../screens/RetourTerrainPbo/RetourTerrainPbo.screen';
import ListeRetoursTerrain from '../screens/listeRetoursTerrain/ListeRetoursTerrain.Screen'; 
import { RootState } from '../redux/store';
import CreateGroupScreen from '../screens/CreateGroup/CreateGroup.screen';

// IMPORTATION DU MENU MODAL
import MenuModal from '../components/MenuModal'; // Ajuste le chemin si nécessaire

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
      value: string; // Correction mineure si nécessaire, conservé selon structure
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

const TopTab = createMaterialTopTabNavigator();

const menuList = [
    { label: 'Discussion',       component: TabOneScreen,          restrict: true },
    { label: 'Ticket',           component: StatusScreen,          restrict: true },
    { label: 'PBO',              component: TabTwoScreen,          restrict: true },
    { label: 'OE/OT/OD',        component: OEOTODlScreen,         restrict: true },
    { label: 'Installation',     component: InstallationsScreen,   restrict: true },
    { label: 'Poteaux',          component: PoteauxScreen,         restrict: true },
    { label: 'PBO Full',         component: PboFullScreen,         restrict: true },
    { label: 'Retour terrain',   component: RetourTerrainPbo,      restrict: true },
    { label: 'Demande Création', component: DemandeCreationScreen, restrict: true },
];

//*const { user } = useSelector((state: RootState) => state.auth);
//console.log("user-3333333", user)

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
};

// MAPPING string → composant réel (hors composant pour éviter les re-créations)
const SCREEN_COMPONENTS: Record<string, React.ComponentType<any>> = {
  BottomTabNavigator,   
  ChatRoomScreen,
  TicketFormScreen,
  TicketDetailScreen,
  PboFormScreen,
  PboDetailScreen,
  ClientDetailScreen,
  ClientJobDetailScreen,
  VisualisationScreen,
  MapScreen,
  SummaryScreen,
  ContactPickerScreen,
  RenseignerPoteauScreen,
  DemandePoteauScreen,
  PoteauDetailScreen,
  InstallationsScreen,
  ValidationInstallationScreen,
  PboFullScreen,
  TicketsTraites,
  RetourTerrainPbo,
  ListeRetoursTerrain,
  DemandeCreationScreen,
  NouvelleDemandeScreen,
  CreateGroupScreen, // Ajouté ici pour faire le lien avec MENU_SCREENS
};

// CONFIG DES ÉCRANS (hors composant — statique)
type ScreenConfig = {
  name: string;
  component: string;
  headerShown: boolean;
  title: string | null;
  headerCustom?: boolean;
};
console.log("Configuration des écrans de navigation...");
let MENU_SCREENS: ScreenConfig[] = [
  { name: 'Root',                   component: 'BottomTabNavigator',          headerShown: true,  title: null,                        headerCustom: true },
  { name: 'ChatRoom',               component: 'ChatRoomScreen',              headerShown: true,  title: null },
  { name: 'TicketForm',             component: 'TicketFormScreen',            headerShown: true,  title: 'Nouveau Ticket' },
  { name: 'TicketDetail',           component: 'TicketDetailScreen',          headerShown: true,  title: 'Détails du Ticket' },
  { name: 'PboForm',                component: 'PboFormScreen',               headerShown: true,  title: 'Nouveau PBO' },
  { name: 'PboDetail',              component: 'PboDetailScreen',             headerShown: true,  title: 'Fiche Technique PBO' },
  { name: 'ClientDetail',           component: 'ClientDetailScreen',          headerShown: true,  title: 'Fiche Information Client' },
  { name: 'ClientJobDetail',        component: 'ClientJobDetailScreen',       headerShown: true,  title: "Détails de l'intervention" },
  { name: 'Visualisation',          component: 'VisualisationScreen',         headerShown: true,  title: "Photos de l'intervention" },
  { name: 'Map',                    component: 'MapScreen',                   headerShown: true,  title: 'Géolocalisation PBO' },
  { name: 'SummaryScreen',          component: 'SummaryScreen',               headerShown: true,  title: 'Récapitulatif' },
  { name: 'ContactPicker',          component: 'ContactPickerScreen',         headerShown: true,  title: 'Sélectionner un contact' },
  { name: 'RenseignerPoteau',       component: 'RenseignerPoteauScreen',      headerShown: true,  title: 'Renseigner un poteau' },
  { name: 'DemandePoteau',          component: 'DemandePoteauScreen',         headerShown: true,  title: 'Demande de Poteau' },
  { name: 'CreateGroup',            component: 'CreateGroupScreen',           headerShown: false, title: null },
  { name: 'PoteauDetail',           component: 'PoteauDetailScreen',          headerShown: true,  title: 'Détails du Poteau' },
  { name: 'Installations',          component: 'InstallationsScreen',         headerShown: true,  title: 'Installations Fibre' },
  { name: 'ValidationInstallation', component: 'ValidationInstallationScreen',headerShown: true,  title: 'Validation Chantier' },
  { name: 'PboFull',                component: 'PboFullScreen',               headerShown: true,  title: 'PBO Full' },
  { name: 'TicketsTraites',         component: 'TicketsTraites',              headerShown: true,  title: 'PBO Traités' },
  { name: 'RetourTerrainPbo',       component: 'RetourTerrainPbo',            headerShown: true,  title: 'Saturation' },
  { name: 'ListeRetoursTerrain',    component: 'ListeRetoursTerrain',         headerShown: false, title: null },
  { name: 'DemandeCreation',        component: 'DemandeCreationScreen',       headerShown: false, title: null },
  { name: 'NouvelleDemande',        component: 'NouvelleDemandeScreen',       headerShown: false, title: null },
];

// STACK + NAVIGATEUR PRINCIPAL
const Stack = createNativeStackNavigator<RootStackParamList>();
const RootNavigator = () => {
    const [isSearching, setIsSearching] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    
    const [isMenuVisible, setIsMenuVisible] = useState(false);
    const navigationRef = React.useRef<any>(null);

    const { user, token } = useSelector((state: RootState) => state.auth);

    useEffect(() => {
        console.log("--- Changement d'état Redux (Auth) ---");
        if (user) {
            console.log("Utilisateur connecté :", user.edl);
            console.log("Utilisateur connecté :", user.partenaire);
        } else {
            console.log("Aucun utilisateur dans le store Redux.");
        }
    }, [user]); 

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const storedToken = await SecureStore.getItemAsync('userToken');
                setIsAuthenticated(!!storedToken || !!token);
            } catch (e) {
                console.error("Erreur lecture SecureStore:", e);
                setIsAuthenticated(!!token);
            } finally {
                setIsLoading(false);
            }
        };
        checkAuth();
    }, [token]);

    const handleLogout = async () => {
        setIsMenuVisible(false);
        try {
            await SecureStore.deleteItemAsync('userToken');
            setIsAuthenticated(false); 
        } catch (e) {
            console.error("Erreur de déconnexion:", e);
        }
    };

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
        <View style={{ flex: 1 }}>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                {isAuthenticated ? (
                    <>
                        <Stack.Screen
                            name="Root"
                            component={BottomTabNavigator}
                            options={({ navigation }: any) => {
                                navigationRef.current = navigation;
                                
                                return {
                                    headerShown: true,
                                    headerStyle: { backgroundColor: PRIMARY_BLUE },
                                    headerTintColor: 'white',
                                    headerTitle: () => isSearching ? (
                                        <TextInput
                                            placeholder="Rechercher..."
                                            style={{ color: 'white', fontSize: 18, width: width * 0.7 }}
                                            autoFocus
                                            value={searchText}
                                            onChangeText={setSearchText}
                                        />
                                    ) : (
                                        <Text style={{ color: 'white', fontSize: 20, fontWeight: 'bold' }}>Pilot</Text>
                                    ),
                                    headerRight: () => (
                                        <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 5 }}>
                                            <TouchableOpacity
                                                style={{ padding: 10 }}
                                                onPress={() => { setIsSearching(!isSearching); if (isSearching) setSearchText(''); }}
                                            >
                                                <Ionicons name={isSearching ? "close" : "search"} size={24} color="white" />
                                            </TouchableOpacity>
                                            {!isSearching && (
                                                <TouchableOpacity style={{ padding: 10 }} onPress={() => setIsMenuVisible(true)}>
                                                    <Ionicons name="ellipsis-vertical" size={24} color="white" />
                                                </TouchableOpacity>
                                            )}
                                        </View>
                                    ),
                                };
                            }}
                        />

                        {MENU_SCREENS.filter(s => s.name !== 'Root').map(({ name, component, headerShown, title }) => {
                            const Component = SCREEN_COMPONENTS[component];
                            if (!Component) return null;

                            return (
                                <Stack.Screen
                                    key={name}
                                    name={name as any}
                                    component={Component}
                                    options={
                                        !headerShown
                                            ? { headerShown: false }
                                            : title
                                            ? (props: any) => ({ ...commonHeaderOptions(props), title })
                                            : commonHeaderOptions
                                    }
                                />
                            );
                        })}
                    </>
                ) : (
                    <>
                        <Stack.Screen name="Login" component={LoginScreen} />
                        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
                        <Stack.Screen name="OTP" component={OTPScreen} />
                        <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
                    </>
                )}
            </Stack.Navigator>

            <MenuModal 
                isVisible={isMenuVisible}
                onClose={() => setIsMenuVisible(false)}
                onLogout={handleLogout}
                onNavigateCreate={() => {
                    setIsMenuVisible(false);
                    navigationRef.current?.navigate('PboFull');
                }}
                onNavigateCreateGroup={() => {
                    setIsMenuVisible(false);
                    navigationRef.current?.navigate('CreateGroup');
                }}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    groupHeader: { paddingTop: 50, paddingBottom: 15, paddingHorizontal: 15, flexDirection: 'row', alignItems: 'center' },
    contactItem: { flexDirection: 'row', alignItems: 'center', padding: 15, borderBottomWidth: 0.5, borderBottomColor: '#eee' },
    avatarBase: { width: 45, height: 45, borderRadius: 22.5, marginRight: 15, justifyContent: 'center', alignItems: 'center' },
    fab: { position: 'absolute', bottom: 30, right: 30, width: 65, height: 65, borderRadius: 32.5, justifyContent: 'center', alignItems: 'center', elevation: 5 }
});