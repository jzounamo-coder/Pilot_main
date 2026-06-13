import { useState } from 'react';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';

// Importations Redux
import { addPbo } from '../../redux/slices/pboslices'; 

export const usePboForm = () => {
  const navigation = useNavigation<any>();
  const dispatch = useDispatch<any>();

  // Récupération de l'état de chargement global de Redux
  const { loading } = useSelector((state: any) => state.pbos);

  // États locaux du formulaire
  const [nomPbo, setNomPbo] = useState('');
  const [nbPboTotal, setNbPboTotal] = useState('');
  const [portsDispos, setPortsDispos] = useState('');
  const [localisation, setLocalisation] = useState('Brazzaville'); 

  const handleValiderPbo = () => {
    const total = parseInt(nbPboTotal);
    const libres = parseInt(portsDispos) || 0;

    // 1. Validation de la présence des champs requis
    if (!nomPbo || !nbPboTotal) {
      Alert.alert("Erreur", "Veuillez remplir le nom et le nombre de PBO.");
      return;
    }

    // 2. Sécurité : Empêcher les valeurs négatives
    if (total < 0 || libres < 0) {
      Alert.alert("Erreur", "Le nombre de ports ne peut pas être négatif.");
      return;
    }

    // 3. Sécurité : Vérifier l'intégrité de la contenance
    if (libres > total) {
      Alert.alert("Erreur", "Le nombre de ports libres ne peut pas être supérieur au total des ports.");
      return;
    }

    // 4. Pop-up de confirmation
    Alert.alert(
      "Confirmation",
      `Voulez-vous créer le PBO "${nomPbo}" ?`,
      [
        { text: "Annuler", style: "cancel" },
        { 
          text: "OUI, CRÉER", 
          onPress: async () => {
            const pboData = {
              nomPbo,
              pboNumberTotalPort: total,
              pboNumberFreePort: libres,
              pboNumberUsedPort: total - libres, // Calcul dynamique de l'occupation
              localisation,
              dateMaj: new Date().toISOString(),
              imageUri: 'https://cdn-icons-png.flaticon.com/512/149/149071.png'
            };

            // Exécution de l'action asynchrone Redux Thunk
            const resultAction = await dispatch(addPbo(pboData));

            if (addPbo.fulfilled.match(resultAction)) {
              Alert.alert("Succès", "Le PBO a été enregistré sur le serveur.");
              navigation.goBack();
            } else {
              Alert.alert("Erreur", "Le serveur a refusé la création : " + resultAction.payload);
            }
          }
        }
      ]
    );
  };

  return {
    nomPbo,
    setNomPbo,
    nbPboTotal,
    setNbPboTotal,
    portsDispos,
    setPortsDispos,
    localisation,
    setLocalisation,
    loading,
    handleValiderPbo
  };
};