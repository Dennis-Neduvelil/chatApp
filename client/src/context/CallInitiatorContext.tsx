import { createContext, useState } from 'react';

type CallInitiatorProviderType = {
  callerId: string;
  setCalledId: React.Dispatch<React.SetStateAction<string>>;
};

const CallInitiatorProviderDefaultValues: CallInitiatorProviderType = {
  callerId: '',
  setCalledId: (): void => { },
};

const CallInitiatorContext = createContext(CallInitiatorProviderDefaultValues);

type CallInitiatorProviderProps = {
  children: React.JSX.Element;
};

export const CallInitiatorProviderContext = ({ children }: CallInitiatorProviderProps) => {
  const [callerId, setCalledId] = useState(CallInitiatorProviderDefaultValues.callerId);
  const value: CallInitiatorProviderType = {
    callerId,
    setCalledId,
  };

  return <CallInitiatorContext.Provider value={value}>{children}</CallInitiatorContext.Provider>;
};

export default CallInitiatorContext;