import React from "react"
import { Image, Text, TouchableOpacity, View } from "react-native"
import tw from "tailwind-react-native-classnames"
import { useNavigation } from '@react-navigation/native';
// On utilise Intl ou une version simplifiée si date-fns n'est pas configuré
import { format } from 'date-fns'; 
import { fr } from 'date-fns/locale';

// Si tu n'as pas encore défini le type Chat dans un fichier séparé :
interface ChatProps {
    id: string;
    lastMessage: {
        content: string;
        createdAt: any;
    };
    user: {
        name: string;
        profile?: string;
        imageUri?: string; 
    };
}

const ChatComponent: React.FC<ChatProps> = ({ id, lastMessage, user }) => {
    const navigation = useNavigation<any>();

    const click = () => {
        // On passe l'objet entier pour la ChatRoom
        navigation.navigate('ChatRoom', { contact: { ...user, id } });
    }

    return (
        <TouchableOpacity  
            onPress={click} 
            style={[tw`p-3 flex flex-row items-center`, { borderBottomWidth: 0.5, borderBottomColor: '#f0f0f0' }]}
        >
            {/* Conteneur Avatar */}
            <View style={tw`h-14 w-14 rounded-full bg-gray-200`}>
                <Image
                    style={[tw`rounded-full`, { width: '100%', height: '100%' }]}
                    source={
                        user.profile || user.imageUri 
                        ? { uri: user.profile || user.imageUri } 
                        : require('../assets/adaptive-icon.png') // Utilise l'icône par défaut qui existe
                    }
                />
            </View>

            {/* Infos Discussion */}
            <View style={tw`flex-1 ml-4`}>
               <View style={tw`flex flex-row items-center justify-between`}>
                    <Text style={[{ fontSize: 16, color: '#000' }, tw`font-bold`]}>
                        {user.name || "Utilisateur"}
                    </Text>
                    <Text style={tw`text-gray-400 text-xs`}>
                        {lastMessage.createdAt || "12:00"}
                    </Text>
               </View>
               
               <Text numberOfLines={1} style={[tw`text-gray-500 mt-1`, { fontSize: 14 }]}>
                    {lastMessage.content}
               </Text>
            </View>
        </TouchableOpacity>
    )
}

export default ChatComponent;