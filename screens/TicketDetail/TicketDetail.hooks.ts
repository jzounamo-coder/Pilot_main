import { useRoute, useNavigation } from '@react-navigation/native';

export interface TicketData {
  imageUri?: string;
  name?: string;
  subscriberId?: string;
  phone?: string;
  adresse?: string;
  lat?: string;
  lnf?: string;
  totalPorts?: string | number;
  npl?: string | number;
  nAbonnement?: string;
  pbo?: string;
  disn?: string;
  edl?: string;
}

export const useTicketDetail = () => {
  const route = useRoute<any>();
  const navigation = useNavigation();
  const ticket: TicketData = route.params?.ticket || {};

  // Traitement et calculs techniques de saturation
  const totalPorts = parseInt((ticket.totalPorts || 16).toString(), 10); 
  const freePorts = parseInt((ticket.npl || 0).toString(), 10); 
  const occupiedPorts = totalPorts - freePorts;
  const isSaturated = freePorts === 0;
  
  // Calcul du pourcentage d'occupation pour la jauge
  const occupancyPercentage = totalPorts > 0 ? (occupiedPorts / totalPorts) * 100 : 0;

  const handleGoBack = () => {
    navigation.goBack();
  };

  return {
    ticket,
    totalPorts,
    freePorts,
    occupiedPorts,
    isSaturated,
    occupancyPercentage,
    handleGoBack,
  };
};