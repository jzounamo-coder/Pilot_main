import { useState, useEffect, useLayoutEffect, useRef } from 'react';
import { Alert, Linking, Keyboard, Platform } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native'; // [cite: 5]
import { useDispatch, useSelector } from 'react-redux';
import { sendMessage } from '../../redux/slices/chatslices'; // [cite: 5]
import { Audio } from 'expo-av'; // [cite: 7]
import * as DocumentPicker from 'expo-document-picker'; // [cite: 6]
import * as ImagePicker from 'expo-image-picker'; // [cite: 6]
import axios from 'axios'; // [cite: 6]

export const useChatRoom = () => {
  const route = useRoute<any>(); // [cite: 66]
  const navigation = useNavigation<any>(); // [cite: 67]
  const dispatch = useDispatch<any>(); // [cite: 67]
  
  const [text, setText] = useState<string>(''); // [cite: 67]
  const [isOpen, setIsOpen] = useState<boolean>(false); // [cite: 67]
  const [recording, setRecording] = useState<Audio.Recording | null>(null); // [cite: 68]
  const [isRecording, setIsRecording] = useState(false); // [cite: 68]

  const [contactModalVisible, setContactModalVisible] = useState(false); // [cite: 68]
  const [allUsers, setAllUsers] = useState<any[]>([]); // [cite: 69]
  const [filteredUsers, setFilteredUsers] = useState<any[]>([]); // [cite: 69]
  const [searchQuery, setSearchQuery] = useState(''); // [cite: 69]
  const [loadingUsers, setLoadingUsers] = useState(false); // [cite: 69]
  
  const { contact } = route.params; // [cite: 70]
  const currentUser = useSelector((state: any) => state.auth.user); // [cite: 70]
  const conversations = useSelector((state: any) => state.chats.conversations); // [cite: 70]
  const currentChat = conversations.find((c: any) => c.id === contact.id || c.tel === contact.tel); // [cite: 71]

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    }); // [cite: 72]
    if (!result.canceled) handleSend(`📷 Image : ${result.assets[0].uri}`); // [cite: 73]
  };

  const takePhoto = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync(); // [cite: 73]
    if (permissionResult.granted === false) {
      Alert.alert("Accès refusé", "Vous devez autoriser l'accès à la caméra."); // [cite: 74]
      return; // [cite: 75]
    }
    let result = await ImagePicker.launchCameraAsync(); // [cite: 75]
    if (!result.canceled) handleSend(`📸 Photo : ${result.assets[0].uri}`); // [cite: 75]
  };

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({ type: "*/*" }); // [cite: 76]
      if (!result.canceled) {
        const asset = result.assets[0]; // [cite: 77]
        handleSend(`📄 Doc : ${asset.name}|${asset.uri}`); // [cite: 78]
      }
    } catch (err) { 
      console.error(err); // [cite: 78]
    }
  };

  const fetchUsersFromDB = async () => {
    setLoadingUsers(true); // [cite: 79]
    setFilteredUsers([]);  // 
    try {
      const response = await axios.get('https://control-api1.speedpro.cg/api/v1/dry/dry-user'); // 
      const rawData = response.data.data || []; // [cite: 81]
      if (Array.isArray(rawData)) {
        const formattedUsers = rawData.map((u: any) => ({
          _id: u._id || u.id,
          name: u.person?.label || u.label || "Utilisateur SpeedPro",
          tel: u.person?.phone || u.phone || "Pas de numéro", // [cite: 81, 82]
          image: u.image || null
        })); // [cite: 81, 82]
        setAllUsers(formattedUsers); // [cite: 83]
        setFilteredUsers(formattedUsers); // [cite: 83]
      }
    } catch (error: any) {
      console.error("Erreur API Users:", error.message); // [cite: 83]
    } finally {
      setLoadingUsers(false); // [cite: 84]
    }
  };

  const handleSend = (content: string) => {
    if (!content.trim()) return; // [cite: 96]
    const messagePayload: any = {
      conversationId: currentChat?.id || contact.id, // [cite: 97, 98]
      text: content, // [cite: 98]
      senderId: currentUser.id || currentUser._id, // [cite: 98, 99]
      createdAt: Date.now().toString() // [cite: 99]
    };
    dispatch(sendMessage(messagePayload)); // [cite: 100]
  };

  async function startRecording() {
    try {
      const permission = await Audio.requestPermissionsAsync(); // [cite: 100]
      if (permission.status === "granted") {
        await Audio.setAudioModeAsync({ allowsRecordingIOS: true, playsInSilentModeIOS: true }); // [cite: 101]
        const { recording: newRecording } = await Audio.Recording.createAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY); // [cite: 102]
        setRecording(newRecording); // [cite: 102]
        setIsRecording(true); // [cite: 102]
      }
    } catch (err) { 
      console.error(err); // [cite: 103]
    }
  }

  async function stopRecording() {
    if (!recording) return; // [cite: 104]
    setIsRecording(false); // [cite: 105]
    try {
      await recording.stopAndUnloadAsync(); // [cite: 105]
      const uri = recording.getURI(); // [cite: 105]
      setRecording(null); // [cite: 106]
      if (uri) handleSend(`AUD-${uri}`); // [cite: 106]
    } catch (err) { 
      console.error(err); 
    }
  };

  const showAttachmentOptions = () => {
    Alert.alert("Partager", "Choisissez un type de contenu", [
      { text: "📷 Caméra", onPress: takePhoto },
      { text: "🖼️ Galerie", onPress: pickImage },
      { text: "📄 Document", onPress: pickDocument },
      { text: "👤 Utilisateur SpeedPro", onPress: () => { 
          fetchUsersFromDB();
          setContactModalVisible(true);
      }}, // [cite: 106, 107]
      { text: "Annuler", style: "cancel" }
    ]); // [cite: 107]
  };

  return {
    text, setText,
    isOpen, setIsOpen,
    isRecording,
    contactModalVisible, setContactModalVisible,
    filteredUsers, setFilteredUsers,
    allUsers,
    searchQuery, setSearchQuery,
    loadingUsers,
    contact,
    currentChat,
    handleSend,
    startRecording,
    stopRecording,
    showAttachmentOptions,
    navigation
  };
};