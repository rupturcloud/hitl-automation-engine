import { createContext, useContext } from 'react';

export const ToastContext = createContext({ push: () => {} });
export const useToast = () => useContext(ToastContext);
