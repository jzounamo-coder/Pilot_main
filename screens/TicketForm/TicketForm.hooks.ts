import { useState } from 'react';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export interface TicketFormState {
  nom: string;
  idClient: string;
  tel: string;
  adresse: string;
  nAbonnement: string;
  pon: string;
  pbo: string;
  lat: string;
  lnf: string;
  valPbo: string;
  valPto: string;
  disn: string;
  edl: string;
  npl: string;
  npv: string;
}

export const useTicketForm = () => {
  const navigation = useNavigation<any>();

  const [form, setForm] = useState<TicketFormState>({
    nom: '',
    idClient: '',
    tel: '',
    adresse: '',
    nAbonnement: '',
    pon: '',
    pbo: '',
    lat: '',
    lnf: '',
    valPbo: '',
    valPto: '',
    disn: '',
    edl: '',
    npl: '',
    npv: '',
  });

  const handleInputChange = (key: keyof TicketFormState, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleValider = () => {
    if (!form.nom || !form.idClient) {
      Alert.alert("Attention", "Le nom et l'ID client sont obligatoires.");
      return;
    }

    const nouveauTicket = {
      id: String(Date.now()),
      name: form.nom,
      phone: form.tel,
      adresse: form.adresse, 
      nAbonnement: form.nAbonnement,
      pon: form.pon,
      pbo: form.pbo,
      lat: form.lat,
      lnf: form.lnf,
      valPbo: form.valPbo,
      valPto: form.valPto,
      disn: form.disn,
      edl: form.edl,
      npl: form.npl,
      npv: form.npv,
      subscriberId: form.idClient,
      date: new Date().toLocaleDateString(),
      imageUri: 'https://i.pinimg.com/736x/fe/82/6a/fe826a52f124f7691d096da3d4537802.jpg'
    };

    // Transmission du nouveau ticket à l'écran de destination
    navigation.navigate('Root', {
      screen: 'Ticket',
      params: { nouveauTicket },
    });
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  return {
    form,
    handleInputChange,
    handleValider,
    handleGoBack,
  };
};