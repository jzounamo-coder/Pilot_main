// useContactPicker.ts
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createConversation } from '../../redux/slices/chatslices'; 
import axios from 'axios';

export const useContactPicker = (navigation: any) => {
  const [contacts, setContacts] = useState<any[]>([]);
  const [filteredContacts, setFilteredContacts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const dispatch = useDispatch<any>();
  // Récupération de l'utilisateur connecté dans le store Redux
  const user = useSelector((state: any) => state.auth.user);

  // Chargement initial des utilisateurs depuis l'API
  useEffect(() => {
    (async () => {
      try {
        const response = await axios.get('https://control-api1.speedpro.cg/api/v1/dry/dry-user');
        const rawData = response.data.data || [];
        
        const formatted = rawData.map((u: any) => ({
          id: u._id || u.id,
          name: u.person?.label || u.label || "Utilisateur SpeedPro",
          phoneNumber: u.person?.phone || u.phone || "Pas de numéro",
          image: u.image || 'https://cdn-icons-png.flaticon.com/512/149/149071.png'
        }));

        setContacts(formatted);
        setFilteredContacts(formatted);
      } catch (error) {
        console.error("Erreur lors de la récupération des utilisateurs:", error);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Gestion de la barre de recherche
  const handleSearch = (text: string) => {
    setSearch(text);
    const filtered = contacts.filter(c => 
      c.name.toLowerCase().includes(text.toLowerCase()) || 
      c.phoneNumber.includes(text)
    );
    setFilteredContacts(filtered);
  };

  // Création ou récupération de la discussion lors de la sélection
  const handleSelectContact = async (item: any) => {
    const userId = user?.id || user?._id;

    if (!userId) {
      console.error("Erreur : Impossible de créer la discussion car ton ID utilisateur est introuvable.");
      return;
    }

    try {
      const resultAction = await dispatch(createConversation({ 
        userId: userId, 
        contactId: item.id 
      }));

      if (createConversation.fulfilled.match(resultAction)) {
        const newChatData = resultAction.payload;
        
        // Redirection vers l'écran de discussion
        navigation.replace('ChatRoom', { 
            contact: {
              ...newChatData,
              name: item.name, 
              imageUri: item.image
            } 
        });
      }
    } catch (err) {
      console.error("Erreur lors de la sélection du contact :", err);
    }
  };

  return {
    filteredContacts,
    loading,
    search,
    handleSearch,
    handleSelectContact,
  };
};