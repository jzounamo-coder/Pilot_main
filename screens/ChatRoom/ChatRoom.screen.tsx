import React, { useLayoutEffect } from 'react';
import { View, Text, FlatList, TextInput, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, Modal, TouchableOpacity, ActivityIndicator, ImageBackground, Image as RNImage, Linking, Alert } from 'react-native';
import { Ionicons, FontAwesome5, Entypo, MaterialIcons } from '@expo/vector-icons'; // [cite: 1]
import tw from 'tailwind-react-native-classnames'; // [cite: 4]
import Ripple from 'react-native-material-ripple'; // [cite: 4]
import EmojiPicker from 'rn-emoji-keyboard'; // [cite: 6]

// Éléments du découpage
import { useChatRoom } from './useChatRoom.hooks';
import { MessageComponent } from './components/MessageComponent';
import { IconButton } from './components/IconButton';

const ChatRoom: React.FC = () => {
    const hook = useChatRoom();

    useLayoutEffect(() => {
        // Détection si c'est un groupe
        const isGroup = hook.contact.isGroup || (hook.contact.participants && hook.contact.participants.length > 0) || hook.contact.type === 'group'; // [cite: 85]
        
        // Calcul robuste du nombre de participants
        const nbMembres = hook.contact.participants?.length || hook.contact.members?.length || hook.contact.contactIds?.length || 0; // [cite: 85]

        // Image par défaut différente pour groupe et contact
        const defaultImage = isGroup 
            ? 'https://cdn-icons-png.flaticon.com/512/615/615075.png' 
            : 'https://i.pinimg.com/1200x/cd/4b/d9/cd4bd9b0ea2807611ba3a67c331bff0b.jpg'; // [cite: 85, 86]

        hook.navigation.setOptions({
            headerTitle: () => (
                <View style={[tw`flex-row items-center`, { marginLeft: -12 }]}> {/* [cite: 86] */}
                    <RNImage 
                        source={{ uri: (hook.contact.image || hook.contact.imageUri || defaultImage) as string }} // [cite: 87]
                        style={tw`w-10 h-10 rounded-full mr-3`} 
                    />
                    <View>
                        <Text style={tw`text-white font-bold text-base`}>{hook.contact.name || hook.contact.username || (isGroup ? "Groupe" : "Chat")}</Text> {/* [cite: 88, 89] */}
                        <Text style={tw`text-gray-300 text-xs`}>
                            {isGroup ? (nbMembres > 0 ? `${nbMembres} participant${nbMembres > 1 ? 's' : ''}` : "Infos du groupe") : "En ligne"} {/* [cite: 89, 90] */}
                        </Text>
                    </View>
                </View>
            ),
            headerLeft: () => (
                <TouchableOpacity onPress={() => hook.navigation.goBack()} style={{ marginLeft: 8, paddingRight: 4 }}> {/* [cite: 91] */}
                    <Ionicons name="chevron-back" size={22} color="white" />
                </TouchableOpacity>
            ),
            headerRight: () => (
                 <TouchableOpacity 
                    style={tw`mr-4`}
                    onPress={() => {
                        const phoneNumber = hook.contact.tel || hook.contact.phone; // [cite: 92]
                        if (phoneNumber && !isGroup) Linking.openURL(`tel:${phoneNumber}`); // [cite: 93]
                        else if (isGroup) Alert.alert("Infos Groupe", "Affichage des détails du groupe..."); // [cite: 93]
                        else Alert.alert("Numéro introuvable"); // [cite: 93]
                    }}
                 >
                    <Ionicons name={isGroup ? "information-circle-outline" : "call"} size={20} color="white" /> {/* [cite: 94, 95] */}
                </TouchableOpacity>
            ),
            headerStyle: { backgroundColor: '#1A237E' }, // [cite: 95]
            headerTintColor: 'white', // [cite: 95]
        });
    }, [hook.navigation, hook.contact]);

    return (
        <ImageBackground source={require('../../assets/wallpaper.png')} resizeMode="cover" style={tw`h-full`}> {/* [cite: 108] */}
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} keyboardVerticalOffset={99} style={tw`flex-1`}> {/* [cite: 108] */}
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View style={tw`py-2 flex px-2 flex-1`}> {/* [cite: 108] */}
                        <FlatList
                            style={tw`flex-1`} // [cite: 109]
                            data={hook.currentChat?.messages || []} // [cite: 109]
                            keyExtractor={(item, index) => item.id?.toString() || index.toString()} // [cite: 109]
                            renderItem={({ item }) => (
                                <MessageComponent id={item.id} user={item.user || {id: item.senderId}} content={item.text || item.content} createdAt={item.createdAt} /> // [cite: 110]
                            )}
                        />
                        <View style={tw`flex flex-row items-center mb-2`}> {/* [cite: 111] */}
                            <View style={tw`bg-white flex-1 flex flex-row px-1 items-center h-12 rounded-full`}> {/* [cite: 111] */}
                                <IconButton onPress={() => hook.setIsOpen(true)}>
                                    <FontAwesome5 name="laugh-beam" size={24} color="#868A91" /> {/* [cite: 112] */}
                                </IconButton>
                                <TextInput 
                                    value={hook.text} 
                                    onChangeText={hook.setText} 
                                    style={[{ fontSize: 18, color: 'black' }, tw`flex-1 pl-2`]} // [cite: 113, 114]
                                    placeholder={hook.isRecording ? 'Enregistrement...' : 'Message...'} // [cite: 114, 115]
                                    placeholderTextColor={hook.isRecording ? '#FF3B30' : '#868A91'} // [cite: 115, 116]
                                    editable={!hook.isRecording} // [cite: 116]
                                />
                                <IconButton onPress={hook.showAttachmentOptions}>
                                    <Entypo name="attachment" size={22} color="#868A91" /> {/* [cite: 117] */}
                                </IconButton>
                            </View>
                            {hook.text ? (
                                <Ripple onPress={() => { hook.handleSend(hook.text); hook.setText(''); }} style={[tw`p-3 rounded-full ml-2`, { backgroundColor: '#1A237E' }]}> {/* [cite: 118, 119] */}
                                    <MaterialIcons name="send" size={24} color="white" /> {/* [cite: 119] */}
                                </Ripple>
                            ) : (
                                <Ripple onPressIn={hook.startRecording} onPressOut={hook.stopRecording} style={[tw`p-3 rounded-full ml-2`, { backgroundColor: hook.isRecording ? '#FF3B30' : '#1A237E' }]}> {/* [cite: 120] */}
                                    <MaterialIcons name={hook.isRecording ? "stop" : "keyboard-voice"} size={24} color="white" /> {/* [cite: 121] */}
                                </Ripple>
                            )}
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>

            {/* MODAL UTILISATEURS SPEEDPRO */}
            <Modal visible={hook.contactModalVisible} animationType="slide" onRequestClose={() => hook.setContactModalVisible(false)}> {/* [cite: 122] */}
                <View style={tw`flex-1 bg-white`}> {/* [cite: 123] */}
                    <View style={[tw`flex flex-row items-center p-4 pt-12`, { backgroundColor: '#1A237E' }]}> {/* [cite: 123] */}
                        <TouchableOpacity onPress={() => hook.setContactModalVisible(false)}>
                            <Ionicons name="arrow-back" size={24} color="white" /> {/* [cite: 123, 124] */}
                        </TouchableOpacity>
                        <Text style={tw`text-white text-lg font-bold ml-4`}>Base de données SpeedPro</Text> {/* [cite: 124] */}
                    </View>
                    <View style={tw`p-2 bg-gray-100`}> {/* [cite: 124] */}
                        <TextInput 
                            placeholder="Rechercher nom ou numéro..." 
                            style={tw`bg-white p-2 rounded-lg px-4`} // [cite: 125]
                            value={hook.searchQuery} 
                            onChangeText={(q) => {
                                hook.setSearchQuery(q); // [cite: 126]
                                hook.setFilteredUsers(hook.allUsers.filter(u => u.name.toLowerCase().includes(q.toLowerCase()) || u.tel.includes(q))); // [cite: 127]
                            }} 
                        />
                    </View>
                    {hook.loadingUsers ? (
                        <ActivityIndicator size="large" color="#1A237E" style={tw`mt-10`} /> // [cite: 127, 128]
                    ) : (
                        <FlatList
                            data={hook.filteredUsers} // [cite: 129]
                            keyExtractor={(item) => item._id} // [cite: 129]
                            renderItem={({ item }) => (
                                <TouchableOpacity style={tw`p-4 border-b border-gray-200 flex flex-row items-center`} onPress={() => { // [cite: 129, 130]
                                    hook.handleSend(`👤 Contact : ${item.name}\n📞 Tél : ${item.tel}`); // [cite: 130]
                                    hook.setContactModalVisible(false); // [cite: 130]
                                }}>
                                    <View style={tw`w-10 h-10 rounded-full bg-indigo-100 items-center justify-center mr-4`}> {/* [cite: 131] */}
                                        <Ionicons name="person" size={20} color="#1A237E" /> {/* [cite: 131, 132] */}
                                    </View>
                                    <View>
                                        <Text style={tw`text-lg font-bold`}>{item.name}</Text> {/* [cite: 133] */}
                                        <Text style={tw`text-gray-500`}>{item.tel}</Text> {/* [cite: 133] */}
                                    </View>
                                </TouchableOpacity>
                            )}
                        />
                    )}
                </View>
            </Modal>
            <EmojiPicker onEmojiSelected={(emoji) => hook.setText(prev => prev + emoji.emoji)} open={hook.isOpen} onClose={() => hook.setIsOpen(false)} /> {/* [cite: 135] */}
        </ImageBackground>
    );
};

export default ChatRoom; //