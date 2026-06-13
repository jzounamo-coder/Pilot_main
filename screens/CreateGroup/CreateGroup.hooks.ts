import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';

// Importations Redux
import { addConversation } from '../../redux/slices/chatslices';
import { RootState } from '../../redux/store';

export const useCreateGroup = () => {
  const navigation = useNavigation<any>();
  const dispatch = useDispatch();

  const [groupName, setGroupName] = useState('');
  const [contacts, setContacts] = useState<any[]>([]);
  const [filteredContacts, setFilteredContacts] = useState<any[]>([]); 
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');

  const { user } = useSelector((state: RootState) => state.auth);

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

  const handleToggleContact = (id: string) => {
    setContacts(prev => prev.map(c => c.id === id ? { ...c, selected: !c.selected } : c));
    setFilteredContacts(prev => prev.map(c => c.id === id ? { ...c, selected: !c.selected } : c));
  };

  const handleBackWithAlert = () => {
    const isNameFilled = groupName.trim().length > 0;
    const isMemberSelected = contacts.some((c: any) => c.selected === true);
    
    if (isNameFilled || isMemberSelected) {
      Alert.alert("Abandonner ?", "Voulez-vous vraiment annuler ?", [
        { text: "ANNULER", style: "cancel" },
        { text: "ABANDONNER", style: "destructive", onPress: () => navigation.goBack() }
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
        createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
      }, 
      imageUri: 'https://static.vecteezy.com/ti/vecteur-libre/p1/26019617-groupe-profil-avatar-icone-vecteur-defaut-social-medias-forum-profil-photo-vectoriel.jpg' 
    };

    dispatch(addConversation(newGroupData));

    navigation.reset({
      index: 0,
      routes: [{ name: 'Root', params: { screen: 'Discussion', params: { newChat: newGroupData } } }],
    });
  };

  return {
    groupName,
    setGroupName,
    filteredContacts,
    contactsCount: contacts.length,
    loading,
    searchText,
    handleSearch,
    handleToggleContact,
    handleBackWithAlert,
    handleConfirmCreate
  };
};