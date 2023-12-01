import { useContext } from 'react';
import CallInitiatorContext from '../context/CallInitiatorContext';



const useCallInit = () => {
    return useContext(CallInitiatorContext);
};

export default useCallInit;