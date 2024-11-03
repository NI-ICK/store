import { create } from "zustand"

type MainStore = {
    showPopup: boolean
    popupMessage: string
    setShowPopup: (value: boolean) => void 
    setPopupMessage: (message: string) => void 
}

export const useMainStore = create<MainStore>(set => ({
    showPopup: false,
    popupMessage: '',
    setShowPopup: (value) => set({ showPopup: value }),
    setPopupMessage: (message) => set({ popupMessage: message }),
}))