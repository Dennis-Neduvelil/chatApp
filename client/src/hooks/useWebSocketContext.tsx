import { useContext } from 'react';
import { webSocketContext } from '../context/webSocketContext';


const useWebSocket = () => {
    return useContext(webSocketContext);
};

export default useWebSocket;