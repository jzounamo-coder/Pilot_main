import { AntDesign, Entypo, FontAwesome5, Fontisto, MaterialIcons, Ionicons } from '@expo/vector-icons';
import React, { useState, ReactNode, useEffect, useLayoutEffect, useRef } from 'react'; 
import { 
 ImageBackground, 
    Text, 
    View, 
    StyleSheet, 
    FlatList, 
    TextInput, 
    KeyboardAvoidingView, 
    Platform, 
    TouchableWithoutFeedback, 
    Keyboard, 
    Alert, 
    Modal, 
    TouchableOpacity, 
    Image as RNImage, 
    Linking, 
    ActivityIndicator 
} from 'react-native';
import tw from 'tailwind-react-native-classnames';
import { Message } from '../types';
import Ripple from 'react-native-material-ripple';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { sendMessage } from '../redux/slices/chatslices';
import EmojiPicker from 'rn-emoji-keyboard';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import { Audio } from 'expo-av';

const greenColor = '#c7dcff';

interface IconButtonProps {
    children: ReactNode; 
    onPress?: () => void;
}

const IconButton: React.FC<IconButtonProps> = ({ children, onPress }) => (
    <TouchableOpacity onPress={onPress} style={tw`p-2`}>
        {children}
    </TouchableOpacity>
);

//  COMPOSANT MESSAGE 
const MessageComponent: React.FC<Message> = ({ user, createdAt, content, id }) => {
    const loggedInUser = useSelector((state: any) => state.auth.user?.id || state.auth.user?._id);
    const isMe = user?.id === loggedInUser;
    
    const [sound, setSound] = useState<Audio.Sound | null>(null);
    const soundRef = useRef<Audio.Sound | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [position, setPosition] = useState(0);
    const [duration, setDuration] = useState(0);

    // ÉTAT POUR LE MODAL D'IMAGE
    const [isImageModalVisible, setImageModalVisible] = useState(false);

    // Détection des types de contenu
    const isAudio = content.startsWith("AUD-file://");
    const isImage = content.startsWith("📷 Image : ") || content.startsWith("📸 Photo : ");
    const isDoc = content.startsWith("📄 Doc : ");

    // Extraction des URIs et noms
    const audioUri = isAudio ? content.replace("AUD-", "") : null;
    const imageUri = isImage ? content.split(" : ")[1] : null;
    
    // Extraction Nom et URI du document (format : "📄 Doc : Nom|URI")
    const docInfo = isDoc ? content.split(" : ")[1].split("|") : [];
    const docName = docInfo[0];
    const docUri = docInfo[1];

    const formatTime = (time: any) => {
        if (!time) return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const timestamp = Number(time);
        const date = new Date(timestamp);
        if (isNaN(timestamp) || isNaN(date.getTime())) {
            return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        }
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    // Fonction pour ouvrir le document RÉELLEMENT
    const openDocument = async () => {
        if (docUri) {
            try {
                const canOpen = await Linking.canOpenURL(docUri);
                if (canOpen || Platform.OS === 'ios') {
                    await Linking.openURL(docUri);
                } else {
                    Alert.alert("Erreur", "Aucune application disponible pour ouvrir ce fichier.");
                }
            } catch (error) {
                Alert.alert("Erreur", "Impossible d'ouvrir le document.");
                console.error(error);
            }
        } else if (docName) {
            Alert.alert("Info", "L'aperçu du document est disponible, mais le lien est manquant.");
        }
    };

    const onPlaybackStatusUpdate = async (status: any) => {
        if (status.isLoaded) {
            setPosition(status.positionMillis);
            setDuration(status.durationMillis || 0);
            setIsPlaying(status.isPlaying);
            if (status.didJustFinish) {
                setIsPlaying(false);
                setPosition(0);
                if (soundRef.current) {
                    await soundRef.current.unloadAsync();
                    soundRef.current = null;
                    setSound(null);
                }
            }
        }
    };

    async function playPauseAudio() {
        if (!audioUri) return;
        try {
            await Audio.setAudioModeAsync({
                allowsRecordingIOS: false,
                playsInSilentModeIOS: true,
                shouldDuckAndroid: true,
                playThroughEarpieceAndroid: false,
            });
            if (soundRef.current) {
                if (isPlaying) await soundRef.current.pauseAsync();
                else await soundRef.current.playAsync();
            } else {
                const { sound: newSound } = await Audio.Sound.createAsync(
                    { uri: audioUri },
                    { shouldPlay: true },
                    onPlaybackStatusUpdate
                );
                soundRef.current = newSound;
                setSound(newSound);
            }
        } catch (error) {
            console.error("Erreur lecture", error);
        }
    }

    const getProgress = () => (duration > 0 ? (position / duration) * 100 : 0);

    useEffect(() => {
        return () => {
            if (soundRef.current) soundRef.current.unloadAsync();
        };
    }, []);

    return (
        <View style={tw`px-2`}>
            <View style={[
                { backgroundColor: isMe ? greenColor : 'white' }, 
                isAudio || isImage || isDoc ? { width: '80%' } : { maxWidth: '85%' }, 
                tw`relative ${isMe ? 'ml-auto' : ''} rounded-md mb-2 overflow-hidden`
            ]}>
                
                {/* RENDU IMAGE / PHOTO AVEC OPTION D'OUVERTURE */}
                {isImage && imageUri ? (
                    <View>
                        <TouchableOpacity onPress={() => setImageModalVisible(true)}>
                            <RNImage 
                                source={{ uri: imageUri as string }} 
                                style={{ width: '100%', height: 200 }} 
                                resizeMode="cover" 
                            />
                        </TouchableOpacity>

                        {/* MODAL IMAGE PLEIN ÉCRAN */}
                        <Modal visible={isImageModalVisible} transparent={true} animationType="fade">
                            <View style={[tw`flex-1 bg-black justify-center items-center`]}>
                                <TouchableOpacity 
                                    style={tw`absolute top-12 right-6 z-10`} 
                                    onPress={() => setImageModalVisible(false)}
                                >
                                    <Ionicons name="close-circle" size={45} color="white" />
                                </TouchableOpacity>
                                
                                <RNImage 
                                    source={{ uri: imageUri as string }} 
                                    style={{ width: '100%', height: '85%' }} 
                                    resizeMode="contain" 
                                />
                            </View>
                        </Modal>

                        <View style={tw`flex-row items-center justify-end p-1`}>
                            <Text style={[{color: '#9D9E9E', fontSize: 10, marginRight: 2}]}>{formatTime(createdAt)}</Text>
                            {isMe && <Ionicons name="checkmark-done" size={14} color="#4a555a" />}
                        </View>
                    </View>
                ) : isDoc ? (
                    /* RENDU DOCUMENT (STYLE  / PDF) */
                    <TouchableOpacity onPress={openDocument}>
                        <View style={[tw`p-3 flex-row items-center`, { backgroundColor: isMe ? '#adcaff' : '#f0f0f0' }]}>
                            <View style={[tw`p-2 rounded-lg mr-3`, { backgroundColor: '#E53935' }]}>
                                <FontAwesome5 name="file-pdf" size={24} color="white" />
                            </View>
                            <View style={tw`flex-1`}>
                                <Text numberOfLines={1} style={tw`font-bold text-gray-800 text-sm`}>{docName}</Text>
                                <Text style={tw`text-xs text-gray-500`}>PDF • Appuyer pour ouvrir</Text>
                            </View>
                            <Ionicons name="eye-outline" size={20} color="#868A91" />
                        </View>
                        <View style={tw`flex-row items-center justify-end p-1`}>
                            <Text style={[{color: '#9D9E9E', fontSize: 10, marginRight: 2}]}>{formatTime(createdAt)}</Text>
                            {isMe && <Ionicons name="checkmark-done" size={14} color="#4a555a" />}
                        </View>
                    </TouchableOpacity>
                ) : isAudio ? (
                    /* RENDU AUDIO */
                    <View style={tw`p-2`}>
                        <View style={tw`flex-row items-center p-1`}>
                            <TouchableOpacity onPress={playPauseAudio}>
                                <Ionicons name={isPlaying ? "pause" : "play"} size={30} color={isMe ? "#1A237E" : "#868A91"} />
                            </TouchableOpacity>
                            <View style={tw`flex-1 ml-3 h-1 bg-gray-300 rounded-full overflow-hidden`}>
                                <View style={[tw`h-full rounded-full`, { width: `${getProgress()}%`, backgroundColor: isMe ? '#1A237E' : '#868A91' }]} />
                            </View>
                            <Ionicons name="mic" size={16} color="#868A91" style={tw`ml-2`} />
                        </View>
                        <View style={tw`flex-row items-center justify-end mt-1`}>
                            <Text style={[tw`text-xs mr-1`, {color: '#9D9E9E'}]}>{formatTime(createdAt)}</Text>
                            {isMe && <Ionicons name="checkmark-done" size={16} color="#4FC3F7" />}
                        </View>
                    </View>
                ) : (
                    /* RENDU TEXTE PAR DÉFAUT */
                    <View style={{ paddingVertical: 4, paddingHorizontal: 7 }}>
                        <Text style={[tw`text-black`, { fontSize: 16, fontWeight: '500' }]}>{content}</Text>
                        <View style={tw`flex-row items-center justify-end mt-0.5`}>
                            <Text style={[{color: '#9D9E9E', fontSize: 10, marginRight: 2}]}>{formatTime(createdAt)}</Text>
                            {isMe && <Ionicons name="checkmark-done" size={14} color="#4a555a" />}
                        </View>
                    </View>
                )}
               <View style={[styles.triangle, tw`absolute ${isMe ? '-mr-1 right-0' : '-ml-2'}`, { borderBottomColor: isMe ? greenColor : 'white' }, { transform: [{ rotate: "-63deg" }] }]} />
            </View>
        </View>
    );
};

// --- COMPOSANT PRINCIPAL CHATROOM ---
const ChatRoom: React.FC = () => {
    const route = useRoute<any>();
    const navigation = useNavigation<any>();
    const dispatch = useDispatch<any>();
    
    const [text, setText] = useState<string>('');
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [recording, setRecording] = useState<Audio.Recording | null>(null);
    const [isRecording, setIsRecording] = useState(false);

    const [contactModalVisible, setContactModalVisible] = useState(false);
    const [allUsers, setAllUsers] = useState<any[]>([]);
    const [filteredUsers, setFilteredUsers] = useState<any[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loadingUsers, setLoadingUsers] = useState(false);

    const { contact } = route.params;
    const currentUser = useSelector((state: any) => state.auth.user);
    const conversations = useSelector((state: any) => state.chats.conversations);
    const currentChat = conversations.find((c: any) => c.id === contact.id || c.tel === contact.tel);

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 1,
        });
        if (!result.canceled) handleSend(`📷 Image : ${result.assets[0].uri}`);
    };

    const takePhoto = async () => {
        const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
        if (permissionResult.granted === false) {
            Alert.alert("Accès refusé", "Vous devez autoriser l'accès à la caméra.");
            return;
        }
        let result = await ImagePicker.launchCameraAsync();
        if (!result.canceled) handleSend(`📸 Photo : ${result.assets[0].uri}`);
    };

    const pickDocument = async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync({ type: "*/*" });
            if (!result.canceled) {
                const asset = result.assets[0];
                handleSend(`📄 Doc : ${asset.name}|${asset.uri}`);
            }
        } catch (err) { console.error(err); }
    };

    const fetchUsersFromDB = async () => {
        setLoadingUsers(true);
        setFilteredUsers([]); 
        try {
            const response = await axios.get('https://control-api1.speedpro.cg/api/v1/dry/dry-user');
            const rawData = response.data.data || [];
            if (Array.isArray(rawData)) {
                const formattedUsers = rawData.map((u: any) => ({
                    _id: u._id || u.id,
                    name: u.person?.label || u.label || "Utilisateur SpeedPro",
                    tel: u.person?.phone || u.phone || "Pas de numéro",
                    image: u.image || null
                }));
                setAllUsers(formattedUsers);
                setFilteredUsers(formattedUsers);
            }
        } catch (error: any) {
            console.error("Erreur API Users:", error.message);
        } finally {
            setLoadingUsers(false);
        }
    };

    useLayoutEffect(() => {
        // Détection si c'est un groupe
        const isGroup = contact.isGroup || (contact.participants && contact.participants.length > 0) || contact.type === 'group';
        
        // Calcul robuste du nombre de participants
        const nbMembres = contact.participants?.length || contact.members?.length || contact.contactIds?.length || 0;

        // Image par défaut différente pour groupe et contact
        const defaultImage = isGroup 
            ? 'https://cdn-icons-png.flaticon.com/512/615/615075.png' 
            : 'https://i.pinimg.com/1200x/cd/4b/d9/cd4bd9b0ea2807611ba3a67c331bff0b.jpg';

        navigation.setOptions({
            headerTitle: () => (
                <View style={[tw`flex-row items-center`, { marginLeft: -12 }]}>
                    <RNImage 
                        source={{ uri: (contact.image || contact.imageUri || defaultImage) as string }} 
                        style={tw`w-10 h-10 rounded-full mr-3`} 
                    />
                    <View>
                        <Text style={tw`text-white font-bold text-base`}>{contact.name || contact.username || (isGroup ? "Groupe" : "Chat")}</Text>
                        <Text style={tw`text-gray-300 text-xs`}>
                            {isGroup ? (nbMembres > 0 ? `${nbMembres} participant${nbMembres > 1 ? 's' : ''}` : "Infos du groupe") : "En ligne"}
                        </Text>
                    </View>
                </View>
            ),
            headerLeft: () => (
                <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginLeft: 8, paddingRight: 4 }}>
                    <Ionicons name="chevron-back" size={22} color="white" />
                </TouchableOpacity>
            ),
            headerRight: () => (
                <TouchableOpacity 
                    style={tw`mr-4`}
                    onPress={() => {
                        const phoneNumber = contact.tel || contact.phone;
                        if (phoneNumber && !isGroup) Linking.openURL(`tel:${phoneNumber}`);
                        else if (isGroup) Alert.alert("Infos Groupe", "Affichage des détails du groupe...");
                        else Alert.alert("Numéro introuvable");
                    }}
                >
                    <Ionicons name={isGroup ? "information-circle-outline" : "call"} size={20} color="white" />
                </TouchableOpacity>
            ),
            headerStyle: { backgroundColor: '#1A237E' },
            headerTintColor: 'white',
        });
    }, [navigation, contact]);

    const handleSend = (content: string) => {
        if (!content.trim()) return;
        const messagePayload: any = {
            conversationId: currentChat?.id || contact.id,
            text: content,
            senderId: currentUser.id || currentUser._id,
            createdAt: Date.now().toString()
        };
        dispatch(sendMessage(messagePayload));
    };

    async function startRecording() {
        try {
            const permission = await Audio.requestPermissionsAsync();
            if (permission.status === "granted") {
                await Audio.setAudioModeAsync({ allowsRecordingIOS: true, playsInSilentModeIOS: true });
                const { recording: newRecording } = await Audio.Recording.createAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
                setRecording(newRecording);
                setIsRecording(true);
            }
        } catch (err) { console.error(err); }
    }

    async function stopRecording() {
        if (!recording) return;
        setIsRecording(false);
        try {
            await recording.stopAndUnloadAsync();
            const uri = recording.getURI();
            setRecording(null);
            if (uri) handleSend(`AUD-${uri}`);
        } catch (err) { console.error(err); }
    }

    const showAttachmentOptions = () => {
        Alert.alert("Partager", "Choisissez un type de contenu", [
            { text: "📷 Caméra", onPress: takePhoto },
            { text: "🖼️ Galerie", onPress: pickImage },
            { text: "📄 Document", onPress: pickDocument },
            { text: "👤 Utilisateur SpeedPro", onPress: () => { 
                fetchUsersFromDB();
                setContactModalVisible(true);
            }},
            { text: "Annuler", style: "cancel" }
        ]);
    };

    return (
        <ImageBackground source={require('../assets/wallpaper.png')} resizeMode="cover" style={tw`h-full`}>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} keyboardVerticalOffset={99} style={tw`flex-1`}>
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View style={tw`py-2 flex px-2 flex-1`}>
                        <FlatList
                            style={tw`flex-1`}
                            data={currentChat?.messages || []}
                            keyExtractor={(item, index) => item.id?.toString() || index.toString()}
                            renderItem={({ item }) => (
                                <MessageComponent id={item.id} user={item.user || {id: item.senderId}} content={item.text || item.content} createdAt={item.createdAt} />
                            )}
                        />
                        <View style={tw`flex flex-row items-center mb-2`}>
                            <View style={tw`bg-white flex-1 flex flex-row px-1 items-center h-12 rounded-full`}>
                                <IconButton onPress={() => setIsOpen(true)}>
                                    <FontAwesome5 name="laugh-beam" size={24} color="#868A91" />
                                </IconButton>
                                <TextInput 
                                    value={text} 
                                    onChangeText={setText} 
                                    style={[{ fontSize: 18, color: 'black' }, tw`flex-1 pl-2`]} 
                                    placeholder={isRecording ? 'Enregistrement...' : 'Message...'} 
                                    placeholderTextColor={isRecording ? '#FF3B30' : '#868A91'}
                                    editable={!isRecording}
                                />
                                <IconButton onPress={showAttachmentOptions}>
                                    <Entypo name="attachment" size={22} color="#868A91" />
                                </IconButton>
                            </View>
                            {text ? (
                                <Ripple onPress={() => { handleSend(text); setText(''); }} style={[tw`p-3 rounded-full ml-2`, { backgroundColor: '#1A237E' }]}>
                                    <MaterialIcons name="send" size={24} color="white" />
                                </Ripple>
                            ) : (
                                <Ripple onPressIn={startRecording} onPressOut={stopRecording} style={[tw`p-3 rounded-full ml-2`, { backgroundColor: isRecording ? '#FF3B30' : '#1A237E' }]}>
                                    <MaterialIcons name={isRecording ? "stop" : "keyboard-voice"} size={24} color="white" />
                                </Ripple>
                            )}
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>

            <Modal visible={contactModalVisible} animationType="slide" onRequestClose={() => setContactModalVisible(false)}>
                <View style={tw`flex-1 bg-white`}>
                    <View style={[tw`flex flex-row items-center p-4 pt-12`, { backgroundColor: '#1A237E' }]}>
                        <TouchableOpacity onPress={() => setContactModalVisible(false)}>
                            <Ionicons name="arrow-back" size={24} color="white" />
                        </TouchableOpacity>
                        <Text style={tw`text-white text-lg font-bold ml-4`}>Base de données SpeedPro</Text>
                    </View>
                    <View style={tw`p-2 bg-gray-100`}>
                        <TextInput 
                            placeholder="Rechercher nom ou numéro..." 
                            style={tw`bg-white p-2 rounded-lg px-4`} 
                            value={searchQuery} 
                            onChangeText={(q) => {
                                setSearchQuery(q);
                                setFilteredUsers(allUsers.filter(u => u.name.toLowerCase().includes(q.toLowerCase()) || u.tel.includes(q)));
                            }} 
                        />
                    </View>
                    {loadingUsers ? (
                        <ActivityIndicator size="large" color="#1A237E" style={tw`mt-10`} />
                    ) : (
                        <FlatList
                            data={filteredUsers}
                            keyExtractor={(item) => item._id}
                            renderItem={({ item }) => (
                                <TouchableOpacity style={tw`p-4 border-b border-gray-200 flex flex-row items-center`} onPress={() => {
                                    handleSend(`👤 Contact : ${item.name}\n📞 Tél : ${item.tel}`);
                                    setContactModalVisible(false);
                                }}>
                                    <View style={tw`w-10 h-10 rounded-full bg-indigo-100 items-center justify-center mr-4`}>
                                        <Ionicons name="person" size={20} color="#1A237E" />
                                    </View>
                                    <View>
                                        <Text style={tw`text-lg font-bold`}>{item.name}</Text>
                                        <Text style={tw`text-gray-500`}>{item.tel}</Text>
                                    </View>
                                </TouchableOpacity>
                            )}
                        />
                    )}
                </View>
            </Modal>
            <EmojiPicker onEmojiSelected={(emoji) => setText(prev => prev + emoji.emoji)} open={isOpen} onClose={() => setIsOpen(false)} />
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    triangle: { width: 0, height: 0, backgroundColor: "transparent", borderStyle: "solid", borderLeftWidth: 8, borderRightWidth: 5, borderBottomWidth: 10, marginTop: -1.4, borderLeftColor: "transparent", borderRightColor: "transparent" }
});

export default ChatRoom;