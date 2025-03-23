import { SettingsModal } from "@/components/NavBar/SettingsModal"
import { useUserStore } from "@/store/useUserStore"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import axios from "axios"
import mockRouter from 'next-router-mock'

vi.mock('axios')
vi.mock("next/navigation", () => ({
    useRouter: vi.fn(() => mockRouter),
}))

describe("SettingsModal", () => {
    mockRouter.push = vi.fn()

    const renderComponent = () => {
        render(<SettingsModal setShowSettingsModal={vi.fn()} showSettingsModal={true} isMobile={false} isAdmin={0}/>)

        return {
            user: userEvent.setup(),
            logoutBtn: screen.getByText(/log out/i)
        }
    }

    const originalState = useUserStore.getState()
    afterEach(() => useUserStore.setState(originalState))

    it("should not render if showModal is false", () => {
        render(<SettingsModal setShowSettingsModal={vi.fn()} showSettingsModal={false} isMobile={false} isAdmin={0} />)
        const link = screen.queryByText(/settings/i)
        expect(link).toBeNull()
    })

    it("should logout user after pressing logout button", async () => {
        useUserStore.setState({ user: { id: '1', name: 'John Doe', isAdmin: 0 }})
        const { user, logoutBtn } = renderComponent()
    
        await user.click(logoutBtn)
        mockRouter.push('/')

        expect(axios.post).toHaveBeenCalledWith('/api/logout')
        expect(useUserStore.getState().user).toBeNull()
        expect(mockRouter.push).toHaveBeenCalledWith('/')
    })

    it("should render link to admin dashboard on mobile and if user is admin", () => {
        render(<SettingsModal setShowSettingsModal={vi.fn()} showSettingsModal={true} isMobile={true} isAdmin={1}/>)
        const adminLink = screen.getByText(/admin/i)
        expect(adminLink).toBeInTheDocument()
    })
})