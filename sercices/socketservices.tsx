import { io, Socket } from 'socket.io-client';

// L'URL du serveur Socket.IO (à adapter selon votre configuration)
const SOCKET_URL = 'https://control-api.speedpro.cg';

class SocketService {
  public socket: Socket | null = null;

  // Connexion au serveur
  connect(userId: string) {
    this.socket = io(SOCKET_URL, {
      query: { userId }, 
      transports: ['websocket'],
    });

    this.socket.on('connect', () => {
     
    });

    this.socket.on('disconnect', () => {
     
    });
  }

  // Pour écouter l'arrivée d'un nouveau message
  onMessageReceived(callback: (message: any) => void) {
    this.socket?.on('new_message', callback);
  }

  // Pour couper la connexion
  disconnect() {
    this.socket?.disconnect();
  }
}

export default new SocketService();