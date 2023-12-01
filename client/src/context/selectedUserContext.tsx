import { createContext, useState } from 'react';

interface IselectedUser {
    fullName: string;
    email: string;
    id: string;
}

type SelectedUserProviderType = {
    selectedUser: IselectedUser;
    setSelectedUser: React.Dispatch<React.SetStateAction<IselectedUser>>;
};

const SelectedUserProviderDefaultValues: SelectedUserProviderType = {
    selectedUser: JSON.parse(localStorage.getItem("selectedUser") || '{"fullName": "", "email": "", "id": ""}'),
    setSelectedUser: (): void => { },
};

const SelectedUserContext = createContext(SelectedUserProviderDefaultValues);

type SelectedUserProviderProps = {
    children: React.JSX.Element;
};

export const SelectedUserProviderContext = ({ children }: SelectedUserProviderProps) => {
    const [selectedUser, setSelectedUser] = useState(SelectedUserProviderDefaultValues.selectedUser);
    const value: SelectedUserProviderType = {
        selectedUser,
        setSelectedUser,
    };

    return <SelectedUserContext.Provider value={value}>{children}</SelectedUserContext.Provider>;
};

export default SelectedUserContext;