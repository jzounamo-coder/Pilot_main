import { useState, useEffect, useLayoutEffect } from 'react';
import { TextInput, View, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { styles } from './Status.styles';

// Typage strict d'un ticket
export interface Ticket {
  id: string;
  name: string;
  phone: string;
  date: string;
  subscriberId: string;
  imageUri: string;
}

export const useStatus = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>(); 
    
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [tickets, setTickets] = useState<Ticket[]>([
    {
      id: 'T1',
      name: ' Test',
      phone: '+242 06 444 55 66',
      date: '10/03/2026',
      subscriberId: 'PB-2026-001',
      imageUri: 'https://i.pinimg.com/736x/fe/82/6a/fe826a52f124f7691d096da3d4537802.jpg', 
    },
  ]);
  const [filteredTickets, setFilteredTickets] = useState<Ticket[]>(tickets);

  // Gestion dynamique du Header (Recherche / Titre de la page)
  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: isSearching ? () => (
        <TextInput
          style={styles.headerSearchInput}
          placeholder="Rechercher un ticket..."
          placeholderTextColor="#ccc"
          autoFocus
          value={searchQuery}
          onChangeText={(text) => setSearchQuery(text)}
        />
      ) : "Pilot",
      headerRight: () => (
        <View style={styles.headerIconsContainer}>
          <TouchableOpacity 
            onPress={() => {
              setIsSearching(!isSearching);
              if (isSearching) setSearchQuery(''); 
            }}
            style={styles.searchIconBulle}
          >
            <Ionicons name={isSearching ? "close" : "search"} size={22} color="white" />
          </TouchableOpacity>
          <MaterialCommunityIcons name="dots-vertical" srrize={24} color="white" style={{ marginLeft: 10 }} />
        </View>
      ),
    });
  }, [navigation, isSearching, searchQuery]);

  // Filtrage des tickets en fonction de la recherche
  useEffect(() => {
    const query = searchQuery.toLowerCase();
    const filtered = tickets.filter(ticket => 
      ticket.name?.toLowerCase().includes(query) || 
      ticket.subscriberId?.toLowerCase().includes(query) ||
      ticket.phone?.includes(query)
    );
    setFilteredTickets(filtered);
  }, [searchQuery, tickets]);

  // Récupération d'un nouveau ticket soumis via les paramètres de route
  useEffect(() => {
    if (route.params?.nouveauTicket) {
      setTickets((prev) => [route.params.nouveauTicket, ...prev]);
      navigation.setParams({ nouveauTicket: undefined });
    }
  }, [route.params?.nouveauTicket]);

  const handleNavigateToForm = () => {
    navigation.navigate('TicketForm');
  };

  const handleNavigateToDetail = (ticket: Ticket) => {
    navigation.navigate('TicketDetail', { ticket });
  };

  return {
    filteredTickets,
    searchQuery,
    handleNavigateToForm,
    handleNavigateToDetail,
  };
};