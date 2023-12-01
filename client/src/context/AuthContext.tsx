import { createContext, useState } from 'react';

type AuthProviderType = {
  userId: string;
  setUserId: React.Dispatch<React.SetStateAction<string>>;
};

const AuthProviderDefaultValues: AuthProviderType = {
  userId: localStorage.getItem("userId") || '',
  setUserId: (): void => { },
};

const AuthContext = createContext(AuthProviderDefaultValues);

type AuthProviderProps = {
  children: React.JSX.Element;
};

export const AuthProviderContext = ({ children }: AuthProviderProps) => {
  const [userId, setUserId] = useState(AuthProviderDefaultValues.userId);
  const value: AuthProviderType = {
    userId,
    setUserId,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;