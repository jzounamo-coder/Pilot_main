import { useRoute, useNavigation } from '@react-navigation/native';
import { Linking, Alert } from 'react-native';

// ─── Typage du client ─────────────────────────────────────────────────────────

export interface Client {
    name?: string;
    phone?: string;
    address?: string;
    email?: string;
    portNumber?: string;
    offre?: string;
    refClient?: string;
}

// ─── Hook principal ───────────────────────────────────────────────────────────

export const useClientDetail = () => {
    const route = useRoute<any>();
    const navigation = useNavigation();

    const client: Client = route.params?.client ?? {};

    // Initiale pour l'avatar
    const avatarLetter = client.name
        ? client.name.charAt(0).toUpperCase()
        : 'C';

    // Appel téléphonique
    const handleCall = async () => {
        const phone = client.phone;
        if (!phone) {
            Alert.alert('Numéro manquant', "Ce client n'a pas de numéro enregistré.");
            return;
        }
        const url = `tel:${phone}`;
        const canOpen = await Linking.canOpenURL(url);
        if (canOpen) {
            await Linking.openURL(url);
        } else {
            Alert.alert('Erreur', "Impossible d'ouvrir l'application téléphone.");
        }
    };

    const handleGoBack = () => navigation.goBack();

    return {
        client,
        avatarLetter,
        handleCall,
        handleGoBack,
    };
};
