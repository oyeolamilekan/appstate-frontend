import { useReducer } from 'react';

const useModals = () => {
  const initState = {
    deleteProductModal: false,
    removeImageModal: false,
    addImageModal: false,
    editProductModal: false,
    changeProductLogoModal: false,
    successModal: false,
    createIntegrationModal: false, 
    deleteIntegrationModal: false,
    createStoreModal: false,
    logoutModal: false,
    editStoreImageModal: false
  };

  const [modals, updateModals] = useReducer(
    (prev: typeof initState, next: Partial<typeof initState>): typeof initState => {
      return { ...prev, ...next };
    },
    initState
  );

  return { modals, updateModals };
};

export { useModals }