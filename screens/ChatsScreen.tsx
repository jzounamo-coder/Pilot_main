import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native'; 
import { Ionicons } from '@expo/vector-icons'; 
import { useDispatch, useSelector } from 'react-redux';
import { fetchConversations } from '../redux/slices/chatslices'; 

export default function ChatsScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>(); 
  const dispatch = useDispatch<any>();

  // On récupère les données globales (Redux)
  const user = useSelector((state: any) => state.auth.user);
  const { conversations, loading } = useSelector((state: any) => state.chats);

  // État local pour gérer l'affichage immédiat du nouveau groupe
  const [localConversations, setLocalConversations] = useState<any[]>([]);

  // Fonction de formatage de l'heure
  const formatTime = (time: any) => {
    if (!time) return "";
    const date = new Date(time);
    if (isNaN(date.getTime())) return ""; 
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Synchronisation avec Redux
  useEffect(() => {
    const userId = user?.id || user?._id;
    if (userId) {
      dispatch(fetchConversations(userId));
    }
  }, [user, dispatch]);

  // Mise à jour de la liste locale quand Redux change
  useEffect(() => {
    setLocalConversations(conversations);
  }, [conversations]);

  // ÉCOUTE DE LA CRÉATION D'UN NOUVEAU GROUPE
  useEffect(() => {
    if (route.params?.newChat) {
      const newGroup = route.params.newChat;
      
      setLocalConversations((prev) => {
        // On vérifie si le groupe n'est pas déjà présent
        const exists = prev.find((c: any) => c.id === newGroup.id);
        if (exists) return prev;
        return [newGroup, ...prev]; 
      });
    }
  }, [route.params?.newChat]);

  // Design quand il n'y a pas encore de messages
  const ListEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      {loading ? (
        <ActivityIndicator size="large" color="#1A237E" />
      ) : (
        <>
          <View style={styles.iconCircle}>
            <Ionicons name="chatbubbles-outline" size={50} color="#1A237E" />
          </View>
          <Text style={styles.emptyTitle}>Aucune discussion</Text>
          <Text style={styles.emptySubtitle}>
            Sélectionnez un contact pour commencer à discuter.
          </Text>
        </>
      )}
    </View>
  );

  const renderItem = ({ item }: any) => (
    <TouchableOpacity 
      style={styles.chatItem} 
      onPress={() => navigation.navigate('ChatRoom', { contact: item })}
    >
      <Image 
        source={{ uri: item.imageUri || item.image || 'https://via.placeholder.com/150' }} 
        style={styles.avatar} 
      />
      <View style={styles.chatDetails}>
        <View style={styles.chatHeader}>
          {/* flex-1 permet au nom de prendre la place restante et de se couper avec "..." avant de toucher l'heure */}
          <Text style={styles.name} numberOfLines={1}>
            {item.name || item.username || "Utilisateur"}
          </Text>
          <Text style={styles.time}>
            {formatTime(item.lastMessage?.createdAt)}
          </Text>
        </View>
        <Text style={styles.lastMessage} numberOfLines={1}>
          {item.lastMessage?.content || "Démarrer une discussion"}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={localConversations} 
        keyExtractor={(item, index) => item?.id?.toString() || index.toString()}
        renderItem={renderItem}
        ListEmptyComponent={ListEmptyComponent}
        contentContainerStyle={localConversations?.length === 0 && { flexGrow: 1 }}
      />

      <TouchableOpacity 
        style={styles.fab} 
        onPress={() => navigation.navigate('ContactPicker')}
      >
        <Ionicons name="chatbubbles" size={28} color="white" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white' },
  chatItem: { flexDirection: 'row', padding: 15, borderBottomWidth: 0.5, borderBottomColor: '#eee', alignItems: 'center' },
  avatar: { width: 50, height: 50, borderRadius: 25, marginRight: 15, backgroundColor: '#DFE5E7' },
  chatDetails: { flex: 1 },
  chatHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 },
  name: { fontSize: 16, fontWeight: 'bold', flex: 1, marginRight: 10, color: '#000' },
  time: { fontSize: 11, color: '#868A91' },
  lastMessage: { fontSize: 14, color: 'gray' },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 40, paddingBottom: 150 },
  iconCircle: { width: 100, height: 100, borderRadius: 50, backgroundColor: '#F5F6FF', justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
  emptyTitle: { fontSize: 20, fontWeight: 'bold', color: '#1A237E', marginBottom: 10, textAlign: 'center' },
  emptySubtitle: { fontSize: 14, color: '#757575', textAlign: 'center', lineHeight: 20 },
  fab: { position: 'absolute', bottom: 30, right: 30, backgroundColor: '#1A237E', width: 65, height: 65, borderRadius: 32.5, justifyContent: 'center', alignItems: 'center', elevation: 8, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 4.65 }
});