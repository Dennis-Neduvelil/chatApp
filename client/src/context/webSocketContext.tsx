import { Socket, io } from "socket.io-client";
import { createContext } from "react";

export const socket = io("http://localhost:4000");
export const webSocketContext = createContext<Socket>(socket);
export const WebSocketProvider = webSocketContext.Provider;