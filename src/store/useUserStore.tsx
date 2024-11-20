import { getUserFromToken } from "@/utils/getUserFromToken"
import { create } from "zustand"

type UserStore = {
    user: UserPayload | null
    setUser: () => void
    logoutUser: () => void
}

export const useUserStore = create<UserStore>(set => ({
    user: null,
    setUser: async () => {
        const user = await getUserFromToken()
        set({ user })
    },
    logoutUser: () => set({ user: null }),
}))