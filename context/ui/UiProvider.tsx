import React, { useReducer } from 'react';
import { UiContext, uiReducer } from './';

interface Props {
    children?: React.ReactNode;
}
export interface UiState {
    isMenuOpen: boolean;
}

const UI_INITIAL_STATE: UiState = {
    isMenuOpen: false,
}

export const UiProvider:React.FC<Props> = ({ children }) => {

 const [state, dispatch] = useReducer( uiReducer, UI_INITIAL_STATE);

 const toogleSideMenu = () => {
    dispatch({ type: '[UI] - ToogleMenu' });
 }

 return (
   <UiContext.Provider value={{
       ...state,

       // Methods
       toogleSideMenu
   }}>
     { children }
   </UiContext.Provider>
 )
}