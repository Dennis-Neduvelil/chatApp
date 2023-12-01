import { useContext } from 'react';
import SelectedUserContext from '../context/selectedUserContext';


const useSelectedUser = () => {
    return useContext(SelectedUserContext);
};

export default useSelectedUser;