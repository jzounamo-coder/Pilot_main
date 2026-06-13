import React from 'react';
import {
    View,
    Text,
    FlatList,
    Image,
    TouchableOpacity,
    ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useChatsScreen, formatTime } from '../../screens/chat/chatScreen.hooks';
import { chatsStyles, BRAND_COLOR } from '../../screens/chat/chatScreen.styles';

// ─── Empty state ──────────────────────────────────────────────────────────────

const ListEmptyComponent: React.FC<{ loading: boolean }> = ({ loading }) => (
    <View style={chatsStyles.emptyContainer}>
        {loading ? (
            <ActivityIndicator size="large" color={BRAND_COLOR} />
        ) : (
            <>
                <View style={chatsStyles.iconCircle}>
                    <Ionicons name="chatbubbles-outline" size={50} color={BRAND_COLOR} />
                </View>
                <Text style={chatsStyles.emptyTitle}>Aucune discussion</Text>
                <Text style={chatsStyles.emptySubtitle}>
                    Sélectionnez un contact pour commencer à discuter.
                </Text>
            </>
        )}
    </View>
);

// ─── Item conversation ────────────────────────────────────────────────────────

const ChatItem: React.FC<{ item: any; onPress: () => void }> = ({ item, onPress }) => (
    <TouchableOpacity style={chatsStyles.chatItem} onPress={onPress}>
        <Image
            source={{
                uri: item.imageUri || item.image || 'https://via.placeholder.com/150',
            }}
            style={chatsStyles.avatar}
        />
        <View style={chatsStyles.chatDetails}>
            <View style={chatsStyles.chatHeader}>
                <Text style={chatsStyles.name} numberOfLines={1}>
                    {item.name || item.username || 'Utilisateur'}
                </Text>
                <Text style={chatsStyles.time}>
                    {formatTime(item.lastMessage?.createdAt)}
                </Text>
            </View>
            <Text style={chatsStyles.lastMessage} numberOfLines={1}>
                {item.lastMessage?.content || 'Démarrer une discussion'}
            </Text>
        </View>
    </TouchableOpacity>
);

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function ChatsScreen() {
    const { localConversations, loading, openChatRoom, openContactPicker } =
        useChatsScreen();

    return (
        <View style={chatsStyles.container}>
            <FlatList
                data={localConversations}
                keyExtractor={(item, index) =>
                    item?.id?.toString() || index.toString()
                }
                renderItem={({ item }) => (
                    <ChatItem item={item} onPress={() => openChatRoom(item)} />
                )}
                ListEmptyComponent={<ListEmptyComponent loading={loading} />}
                contentContainerStyle={
                    localConversations?.length === 0 ? { flexGrow: 1 } : undefined
                }
            />

            {/* ── FAB nouvelle conversation ─────────────────────────────── */}
            <TouchableOpacity style={chatsStyles.fab} onPress={openContactPicker}>
                <Ionicons name="chatbubbles" size={28} color="white" />
            </TouchableOpacity>
        </View>
    );
}
