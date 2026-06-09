import React, { useState, useEffect, useLayoutEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity, TextInput } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';

export default function StatusScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>(); 
    
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [tickets, setTickets] = useState([
    {
      id: 'T1',
      name: ' Test',
      phone: '+242 06 444 55 66',
      date: '10/03/2026',
      subscriberId: 'PB-2026-001',
      imageUri: 'https://i.pinimg.com/736x/fe/82/6a/fe826a52f124f7691d096da3d4537802.jpg', 
    },
  ]);
  const [filteredTickets, setFilteredTickets] = useState(tickets);

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
            {/* L'icône de recherche devient blanche pour contraster avec le header bleu */}
            <Ionicons name={isSearching ? "close" : "search"} size={22} color="white" />
          </TouchableOpacity>
          <MaterialCommunityIcons name="dots-vertical" size={24} color="white" style={{marginLeft: 10}} />
        </View>
      ),
    });
  }, [navigation, isSearching, searchQuery]);

  useEffect(() => {
    const query = searchQuery.toLowerCase();
    const filtered = tickets.filter(ticket => 
      ticket.name?.toLowerCase().includes(query) || 
      ticket.subscriberId?.toLowerCase().includes(query) ||
      ticket.phone?.includes(query)
    );
    setFilteredTickets(filtered);
  }, [searchQuery, tickets]);

  useEffect(() => {
    if (route.params?.nouveauTicket) {
      setTickets((prev) => [route.params.nouveauTicket, ...prev]);
      navigation.setParams({ nouveauTicket: undefined });
    }
  }, [route.params?.nouveauTicket]);

  const renderTicket = ({ item }: any) => (
    <TouchableOpacity 
      style={styles.ticketRow}
      onPress={() => navigation.navigate('TicketDetail', { ticket: item })}
    >
      <Image source={{ uri: item.imageUri }} style={styles.avatar} />
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.phoneText}>{item.name || item.phone}</Text>
          <Text style={styles.dateText}>{item.date}</Text>
        </View>
        <View style={styles.footer}>
          <Text style={styles.subLabel}>Abonné : </Text>
          <Text style={styles.subNumber}>{item.subscriberId}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList 
        data={filteredTickets} 
        keyExtractor={(item) => item.id} 
        renderItem={renderTicket} 
        ListEmptyComponent={
          searchQuery ? <Text style={styles.emptyText}>Aucun résultat pour "{searchQuery}"</Text> : null
        }
      />
      {/* BOUTON FLOTTANT CORRIGÉ EN BLEU #1A237E */}
      <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate('TicketForm')}>
        <Ionicons name="add" size={35} color="white" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  headerIconsContainer: { flexDirection: 'row', alignItems: 'center', marginRight: 15 },
  
  // Bulle de recherche discrète
  searchIconBulle: { backgroundColor: 'rgba(255,255,255,0.15)', padding: 8, borderRadius: 20 },
  headerSearchInput: { color: 'white', fontSize: 17, width: 220, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.3)' },
  emptyText: { textAlign: 'center', marginTop: 30, color: '#999' },

  ticketRow: { flexDirection: 'row', padding: 15, backgroundColor: 'white', alignItems: 'center', borderBottomWidth: 0.5, borderBottomColor: '#eee' },
  avatar: { width: 55, height: 55, borderRadius: 27.5, marginRight: 15, backgroundColor: '#DFE5E7' },
  content: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 },
  phoneText: { fontSize: 16, fontWeight: 'bold', color: '#000' },
  dateText: { fontSize: 12, color: '#666' },
  footer: { flexDirection: 'row', alignItems: 'center' },
  subLabel: { fontSize: 13, color: '#666' },
  subNumber: { fontSize: 13, color: '#1A237E', fontWeight: '600' },
  
  // STYLE DU BOUTON FLOTTANT (FAB) - PASSÉ EN BLEU FONCÉ
  fab: { 
    position: 'absolute', 
    bottom: 25, 
    right: 25, 
    backgroundColor: '#1A237E', 
    width: 65, 
    height: 65, 
    borderRadius: 32.5, 
    justifyContent: 'center', 
    alignItems: 'center', 
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65
  }
});