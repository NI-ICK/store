import { create } from "zustand"

type UserStore = {
    user: User | null
    loading: boolean
    setUser: (user: User) => void
    logoutUser: () => void
    setLoading: (value: boolean) => void
}

export const useUserStore = create<UserStore>(set => ({
    user: null,
    loading: true,
    setUser: (user) => set({ user }),
    logoutUser: () => set({ user: null }),
    setLoading: (value) => set({ loading: value })
}))