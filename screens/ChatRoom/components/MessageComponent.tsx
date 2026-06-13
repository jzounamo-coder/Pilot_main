import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Modal, Image as RNImage, Platform, Alert, Linking } from 'react-native';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons'; // [cite: 1]
import { useSelector } from 'react-redux';
import { Audio } from 'expo-av'; // [cite: 7]
import tw from 'tailwind-react-native-classnames'; // [cite: 4]
import { Message } from '../types'; // [cite: 4]
import { greenColor, styles } from '../chatRoom.styles';

export const MessageComponent: React.FC<Message> = ({ user, createdAt, content }) => {
    const loggedInUser = useSelector((state: any) => state.auth.user?.id || state.auth.user?._id); // [cite: 9]
    const isMe = user?.id === loggedInUser; // [cite: 10]
    
    const [sound, setSound] = useState<Audio.Sound | null>(null); // [cite: 10]
    const soundRef = useRef<Audio.Sound | null>(null); // [cite: 10]
    const [isPlaying, setIsPlaying] = useState(false); // [cite: 11]
    const [position, setPosition] = useState(0); // [cite: 11]
    const [duration, setDuration] = useState(0); // [cite: 11]
    
    // ÉTAT POUR LE MODAL D'IMAGE
    const [isImageModalVisible, setImageModalVisible] = useState(false); // [cite: 12]
    
    // Détection des types de contenu
    const isAudio = content.startsWith("AUD-file://"); // [cite: 13]
    const isImage = content.startsWith("📷 Image : ") || content.startsWith("📸 Photo : "); // [cite: 14]
    const isDoc = content.startsWith("📄 Doc : "); // [cite: 14]
    
    // Extraction des URIs et noms
    const audioUri = isAudio ? content.replace("AUD-", "") : null; // [cite: 15]
    const imageUri = isImage ? content.split(" : ")[1] : null; // [cite: 16]
    
    // Extraction Nom et URI du document (format : "📄 Doc : Nom|URI")
    const docInfo = isDoc ? content.split(" : ")[1].split("|") : []; // [cite: 17, 18]
    const docName = docInfo[0]; // [cite: 18]
    const docUri = docInfo[1]; // [cite: 18]

    const formatTime = (time: any) => {
        if (!time) return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }); // [cite: 19]
        const timestamp = Number(time); // [cite: 20]
        const date = new Date(timestamp); // [cite: 20]
        if (isNaN(timestamp) || isNaN(date.getTime())) {
            return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }); // [cite: 20]
        }
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }); // [cite: 21]
    };

    // Fonction pour ouvrir le document RÉELLEMENT
    const openDocument = async () => {
        if (docUri) {
            try {
                const canOpen = await Linking.canOpenURL(docUri); // [cite: 22]
                if (canOpen || Platform.OS === 'ios') {
                    await Linking.openURL(docUri); // [cite: 23]
                } else {
                    Alert.alert("Erreur", "Aucune application disponible pour ouvrir ce fichier."); // [cite: 24]
                }
            } catch (error) {
                Alert.alert("Erreur", "Impossible d'ouvrir le document."); // [cite: 25]
                console.error(error); // [cite: 26]
            }
        } else if (docName) {
            Alert.alert("Info", "L'aperçu du document est disponible, mais le lien est manquant."); // [cite: 26]
        }
    };

    const onPlaybackStatusUpdate = async (status: any) => {
        if (status.isLoaded) {
            setPosition(status.positionMillis); // [cite: 27]
            setDuration(status.durationMillis || 0); // [cite: 28]
            setIsPlaying(status.isPlaying); // [cite: 28]
            if (status.didJustFinish) {
                setIsPlaying(false); // [cite: 28]
                setPosition(0); // [cite: 29]
                if (soundRef.current) {
                    await soundRef.current.unloadAsync(); // [cite: 29]
                    soundRef.current = null; // [cite: 30]
                    setSound(null); // [cite: 30]
                }
            }
        }
    };

    async function playPauseAudio() {
        if (!audioUri) return; // [cite: 31]
        try {
            await Audio.setAudioModeAsync({
                allowsRecordingIOS: false,
                playsInSilentModeIOS: true,
                shouldDuckAndroid: true,
                playThroughEarpieceAndroid: false,
            }); // [cite: 32]
            if (soundRef.current) {
                if (isPlaying) await soundRef.current.pauseAsync(); // [cite: 33]
                else await soundRef.current.playAsync(); // [cite: 34]
            } else {
                const { sound: newSound } = await Audio.Sound.createAsync(
                    { uri: audioUri },
                    { shouldPlay: true },
                    onPlaybackStatusUpdate
                ); // [cite: 34, 35]
                soundRef.current = newSound; // [cite: 35]
                setSound(newSound); // [cite: 35]
            }
        } catch (error) {
            console.error("Erreur lecture", error); // [cite: 36]
        }
    }

    const getProgress = () => (duration > 0 ? (position / duration) * 100 : 0); // [cite: 37]

    useEffect(() => {
        return () => {
            if (soundRef.current) soundRef.current.unloadAsync(); // [cite: 38]
        };
    }, []);

    return (
        <View style={tw`px-2`}>
            <View style={[
                { backgroundColor: isMe ? greenColor : 'white' }, 
                isAudio || isImage || isDoc ? { width: '80%' } : { maxWidth: '85%' }, 
                tw`relative ${isMe ? 'ml-auto' : ''} rounded-md mb-2 overflow-hidden` // [cite: 39, 40]
            ]}>
                
                {/* RENDU IMAGE / PHOTO AVEC OPTION D'OUVERTURE */}
                {isImage && imageUri ? (
                    <View>
                        <TouchableOpacity onPress={() => setImageModalVisible(true)}>
                            <RNImage 
                                source={{ uri: imageUri as string }} 
                                style={{ width: '100%', height: 200 }} // [cite: 41, 42]
                                resizeMode="cover" 
                            />
                        </TouchableOpacity>

                        {/* MODAL IMAGE PLEIN ÉCRAN */}
                        <Modal visible={isImageModalVisible} transparent={true} animationType="fade">
                            <View style={[tw`flex-1 bg-black justify-center items-center`]}>
                                <TouchableOpacity 
                                    style={tw`absolute top-12 right-6 z-10`} 
                                    onPress={() => setImageModalVisible(false)} // [cite: 44, 45]
                                >
                                    <Ionicons name="close-circle" size={45} color="white" />
                                </TouchableOpacity>
                                
                                <RNImage 
                                    source={{ uri: imageUri as string }} // [cite: 46, 47]
                                    style={{ width: '100%', height: '85%' }} // [cite: 47]
                                    resizeMode="contain" 
                                />
                            </View>
                        </Modal>

                        <View style={tw`flex-row items-center justify-end p-1`}>
                            <Text style={[{color: '#9D9E9E', fontSize: 10, marginRight: 2}]}>{formatTime(createdAt)}</Text> {/* [cite: 49] */}
                            {isMe && <Ionicons name="checkmark-done" size={14} color="#4a555a" />} {/* [cite: 49] */}
                        </View>
                    </View>
                ) : isDoc ? (
                    /* RENDU DOCUMENT (STYLE  / PDF) */
                    <TouchableOpacity onPress={openDocument}>
                        <View style={[tw`p-3 flex-row items-center`, { backgroundColor: isMe ? '#adcaff' : '#f0f0f0' }]}> {/* [cite: 51] */}
                            <View style={[tw`p-2 rounded-lg mr-3`, { backgroundColor: '#E53935' }]}> {/* [cite: 52] */}
                                <FontAwesome5 name="file-pdf" size={24} color="white" />
                            </View>
                            <View style={tw`flex-1`}> {/* [cite: 53] */}
                                <Text numberOfLines={1} style={tw`font-bold text-gray-800 text-sm`}>{docName}</Text> {/* [cite: 53] */}
                                <Text style={tw`text-xs text-gray-500`}>PDF • Appuyer pour ouvrir</Text> {/* [cite: 53] */}
                            </View>
                            <Ionicons name="eye-outline" size={20} color="#868A91" /> {/* [cite: 54] */}
                        </View>
                        <View style={tw`flex-row items-center justify-end p-1`}>
                            <Text style={[{color: '#9D9E9E', fontSize: 10, marginRight: 2}]}>{formatTime(createdAt)}</Text> {/* [cite: 55] */}
                            {isMe && <Ionicons name="checkmark-done" size={14} color="#4a555a" />} {/* [cite: 55] */}
                        </View>
                    </TouchableOpacity>
                ) : isAudio ? (
                    /* RENDU AUDIO */
                    <View style={tw`p-2`}>
                        <View style={tw`flex-row items-center p-1`}>
                            <TouchableOpacity onPress={playPauseAudio}> {/* [cite: 57, 58] */}
                                <Ionicons name={isPlaying ? "pause" : "play"} size={30} color={isMe ? "#1A237E" : "#868A91"} /> {/* [cite: 58] */}
                            </TouchableOpacity>
                            <View style={tw`flex-1 ml-3 h-1 bg-gray-300 rounded-full overflow-hidden`}> {/* [cite: 59] */}
                                <View style={[tw`h-full rounded-full`, { width: `${getProgress()}%`, backgroundColor: isMe ? '#1A237E' : '#868A91' }]} /> {/* [cite: 59] */}
                            </View>
                            <Ionicons name="mic" size={16} color="#868A91" style={tw`ml-2`} /> {/* [cite: 60] */}
                        </View>
                        <View style={tw`flex-row items-center justify-end mt-1`}>
                            <Text style={[tw`text-xs mr-1`, {color: '#9D9E9E'}]}>{formatTime(createdAt)}</Text> {/* [cite: 60] */}
                            {isMe && <Ionicons name="checkmark-done" size={16} color="#4FC3F7" />} {/* [cite: 61] */}
                        </View>
                    </View>
                ) : (
                    /* RENDU TEXTE PAR DÉFAUT */
                    <View style={{ paddingVertical: 4, paddingHorizontal: 7 }}> {/* [cite: 61, 62] */}
                        <Text style={[tw`text-black`, { fontSize: 16, fontWeight: '500' }]}>{content}</Text> {/* [cite: 62] */}
                        <View style={tw`flex-row items-center justify-end mt-0.5`}> {/* [cite: 62, 63] */}
                            <Text style={[{color: '#9D9E9E', fontSize: 10, marginRight: 2}]}>{formatTime(createdAt)}</Text> {/* [cite: 63] */}
                            {isMe && <Ionicons name="checkmark-done" size={14} color="#4a555a" />} {/* [cite: 63] */}
                        </View>
                    </View>
                )}
               <View style={[styles.triangle, tw`absolute ${isMe ? '-mr-1 right-0' : '-ml-2'}`, { borderBottomColor: isMe ? greenColor : 'white' }, { transform: [{ rotate: "-63deg" }] }]} /> {/* [cite: 64, 65] */}
            </View>
        </View>
    );
};