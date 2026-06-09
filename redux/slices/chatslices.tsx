import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

interface ChatState {
  conversations: any[]; 
  loading: boolean;
}

const initialState: ChatState = {
  conversations: [], 
  loading: false,
};

//  1. CHARGER LES DISCUSSIONS (GET) 
export const fetchConversations = createAsyncThunk(
  'chats/fetchConversations',
  async (userId: string) => {
    try {
      const response = await fetch(`https://control-api1.speedpro.cg/api/v1/pilote/conversation/user/${userId}`);
      if (!response.ok) throw new Error("Erreur de récupération des conversations");
      const data = await response.json();
      return data; 
    } catch (error) {
      console.error("Erreur fetchConversations:", error);
      throw error;
    }
  }
);

//  2. CRÉER UNE CONVERSATION (POST) " 
export const createConversation = createAsyncThunk(
  'chats/createConversation',
  async ({ userId, contactId }: { userId: string, contactId: string }) => {
    try {
      const response = await fetch('https://control-api1.speedpro.cg/api/v1/pilote/conversation/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          participants: [userId, contactId] 
        }),
      });

      if (!response.ok) throw new Error("Erreur lors de la création de la discussion sur le serveur");
      
      const data = await response.json();
      return data; 
    } catch (error) {
      console.error("Erreur createConversation:", error);
      throw error;
    }
  }
);

//  3. ENVOYER UN MESSAGE (POST) 
export const sendMessage = createAsyncThunk(
  'chats/sendMessage',
  async ({ conversationId, text, senderId }: { conversationId: string, text: string, senderId: string }) => {
    try {
      const response = await fetch('https://control-api1.speedpro.cg/api/v1/pilote/message/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ conversationId, text, senderId }),
      });

      if (!response.ok) throw new Error("Serveur en maintenance");

      const data = await response.json();
      return { conversationId, message: data.newMessage };
    } catch (error) {
      return { 
        conversationId, 
        message: { 
          _id: Date.now().toString(), 
          text, 
          senderId, 
          createdAt: new Date().toISOString() 
        } 
      };
    }
  }
);

const chatSlice = createSlice({
  name: 'chats',
  initialState,
  reducers: {
    addConversation: (state, action: PayloadAction<any>) => {
      const newChat = action.payload;
      const alreadyExists = state.conversations.find(c => c.id === newChat.id || c._id === newChat._id);
      if (!alreadyExists) {
        state.conversations = [newChat, ...state.conversations];
      }
    },
    receiveMessage: (state, action: PayloadAction<{ conversationId: string, message: any }>) => {
      const { conversationId, message } = action.payload;
      const chat = state.conversations.find((c: any) => c.id === conversationId || c._id === conversationId);
      
      if (chat) {
        if (!chat.messages) chat.messages = [];
        chat.messages.push(message);
        chat.lastMessage = { 
          content: message.text, 
          createdAt: new Date().toISOString() 
        };
      }
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Conversations
      .addCase(fetchConversations.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchConversations.fulfilled, (state, action) => {
        state.loading = false;
        state.conversations = action.payload;
      })
      .addCase(fetchConversations.rejected, (state) => {
        state.loading = false;
      })
      // Create Conversation (Lien Serveur)
      .addCase(createConversation.fulfilled, (state, action) => {
        const newChat = action.payload;
        const exists = state.conversations.find(c => c._id === newChat._id);
        if (!exists) {
          state.conversations = [newChat, ...state.conversations];
        }
      })
      // Send Message
      .addCase(sendMessage.fulfilled, (state: any, action) => {
        const { conversationId, message } = action.payload;
        const chat = state.conversations.find((c: any) => c.id === conversationId || c._id === conversationId);
        if (chat) {
          if (!chat.messages) chat.messages = [];
          chat.messages.push(message);
          chat.lastMessage = { 
            content: message.text, 
            createdAt: message.createdAt 
          };
        }
      });
  },
});

export const { addConversation, receiveMessage } = chatSlice.actions;
export default chatSlice.reducer;