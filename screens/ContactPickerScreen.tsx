import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { createConversation } from '../redux/slices/chatslices'; 
import axios from 'axios'; 

export default function ContactPickerScreen({ navigation }: any) {
  const [contacts, setContacts] = useState<any[]>([]);
  const [filteredContacts, setFilteredContacts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  const dispatch = useDispatch<any>();
  // On récupère l'utilisateur connecté pour avoir son ID (le "sender")
  const user = useSelector((state: any) => state.auth.user);

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

  const handleSearch = (text: string) => {
    setSearch(text);

    const filtered = contacts.filter(c => 
      c.name.toLowerCase().includes(text.toLowerCase()) || 
      c.phoneNumber.includes(text)
    );
    setFilteredContacts(filtered);
  };

  const handleSelectContact = async (item: any) => {
    const userId = user?.id || user?._id;

    if (!userId) {
      console.error("Erreur : Impossible de créer la discussion car ton ID utilisateur est introuvable.");
      return;
    }

    try {
      //  APPEL AU SERVEUR VIA REDUX 
      const resultAction = await dispatch(createConversation({ 
        userId: userId, 
        contactId: item.id 
      }));

      if (createConversation.fulfilled.match(resultAction)) {
        const newChatData = resultAction.payload;
        
        // On navigue vers la salle de chat avec les données réelles du serveur
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

  const renderContact = ({ item }: any) => (
    <TouchableOpacity 
      style={styles.item}
      onPress={() => handleSelectContact(item)}
    >
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{item.name ? item.name[0].toUpperCase() : '?'}</Text>
      </View>
      <View>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.phone}>{item.phoneNumber}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchHeader}>
        <Ionicons name="search" size={20} color="gray" style={{ marginLeft: 10 }} />
        <TextInput 
          style={styles.searchBar} 
          placeholder="Rechercher sur SpeedPro..." 
          value={search}
          onChangeText={handleSearch}
        />
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#1A237E" style={{marginTop: 20}} />
      ) : (
        <FlatList 
          data={filteredContacts}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderContact}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  searchHeader: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F0F0F0', margin: 10, borderRadius: 10, paddingHorizontal: 5 },
  searchBar: { flex: 1, padding: 12, fontSize: 16 },
  item: { flexDirection: 'row', padding: 15, alignItems: 'center', borderBottomWidth: 0.5, borderBottomColor: '#eee' },
  avatar: { width: 45, height: 45, borderRadius: 22.5, backgroundColor: '#1A237E', justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  avatarText: { color: 'white', fontWeight: 'bold', fontSize: 18 },
  name: { fontSize: 16, fontWeight: '600', color: '#333' },
  phone: { color: '#666', marginTop: 3 }
});
