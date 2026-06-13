import { useEffect, useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchConversations } from '../../redux/slices/chatslices';

// ─── Utilitaire ───────────────────────────────────────────────────────────────

export const formatTime = (time: any): string => {
    if (!time) return '';
    const date = new Date(time);
    if (isNaN(date.getTime())) return '';
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

// ─── Hook principal ───────────────────────────────────────────────────────────

export const useChatsScreen = () => {
    const navigation = useNavigation<any>();
    const route = useRoute<any>();
    const dispatch = useDispatch<any>();

    const user = useSelector((state: any) => state.auth.user);
    const { conversations, loading } = useSelector((state: any) => state.chats);

    // Liste locale pour afficher immédiatement un nouveau groupe
    const [localConversations, setLocalConversations] = useState<any[]>([]);

    // ── Chargement initial depuis Redux ───────────────────────────────────────
    useEffect(() => {
        const userId = user?.id || user?._id;
        if (userId) {
            dispatch(fetchConversations(userId));
        }
    }, [user, dispatch]);

    // ── Synchronisation Redux → état local ───────────────────────────────────
    useEffect(() => {
        setLocalConversations(conversations);
    }, [conversations]);

    // ── Écoute de la création d'un nouveau groupe (via route.params) ──────────
    useEffect(() => {
        if (!route.params?.newChat) return;
        const newGroup = route.params.newChat;

        setLocalConversations((prev) => {
            const alreadyExists = prev.some((c: any) => c.id === newGroup.id);
            if (alreadyExists) return prev;
            return [newGroup, ...prev];
        });
    }, [route.params?.newChat]);

    // ── Actions de navigation ─────────────────────────────────────────────────
    const openChatRoom = (contact: any) => {
        navigation.navigate('ChatRoom', { contact });
    };

    const openContactPicker = () => {
        navigation.navigate('ContactPicker');
    };

    return {
        localConversations,
        loading,
        openChatRoom,
        openContactPicker,
    };
};
