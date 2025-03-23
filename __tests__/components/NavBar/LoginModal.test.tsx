import { LoginModal } from "@/components/NavBar/LoginModal"
import { useMainStore } from "@/store/useMainStore"
import { useUserStore } from "@/store/useUserStore"
import { render, screen } from "@testing-library/react"
import userEvent from '@testing-library/user-event'
import axios from "axios"

vi.mock('axios')
vi.mock('@/utils/getUserFromToken')

describe("LoginModal", () => {
    const mockSetShowLoginModal = vi.fn()
    const mockSetShowRegisterModal = vi.fn()
    const renderComponent = () => {
        render(<LoginModal showLoginModal={true} setShowLoginModal={mockSetShowLoginModal} setShowRegisterModal={mockSetShowRegisterModal}/>)

        return {
            user: userEvent.setup(),
            emailInput: screen.getByLabelText(/e-mail/i),
            passwordInput: screen.getByLabelText(/password/i),
            loginBtn: screen.getByRole('button', { name: /login/i }),
        }
    }

    const originalState = useMainStore.getInitialState()
    afterEach(() => { useMainStore.setState(originalState) })

    it("should not render component if showModal is false", () => {
        render(<LoginModal showLoginModal={false} setShowLoginModal={vi.fn()} setShowRegisterModal={vi.fn()}/>)
        expect(screen.queryByText(/login/i)).toBeNull()
    })

    it("should update input on user typing", async () => {
        const { emailInput, passwordInput, user } = renderComponent()

        await user.type(emailInput, "test@gmail.com")
        await user.type(passwordInput, "password")
        
        expect(emailInput).toHaveValue("test@gmail.com")
        expect(passwordInput).toHaveValue("password")
    })

    it("should toggle password visibility", async () => {
        const { user, passwordInput } = renderComponent()

        const eyeIcon = screen.getByRole('button', { name: 'visibility-toggle' })
        await user.click(eyeIcon)
        expect(passwordInput).toHaveAttribute("type", "text")

        const slashEyeIcon = screen.getByRole('button', { name: 'visibility-toggle' })
        await user.click(slashEyeIcon)
        expect(passwordInput).toHaveAttribute("type", "password")
    })

    it("should submit form succesfully", async () => {
        const { user, passwordInput, emailInput, loginBtn } = renderComponent()

        await user.type(emailInput, "test@gmail.com")
        await user.type(passwordInput, "password")
        await user.click(loginBtn)
        const userS = useUserStore.getState().user

        expect(axios.post).toHaveBeenCalledWith('/api/login', { email: "test@gmail.com", password: "password" })
        expect(userS).not.toBeNull()
        expect(mockSetShowLoginModal).toHaveBeenCalledWith(false)
    })

    it("should handle API error and display popup", async () => {
        const { user, emailInput, passwordInput, loginBtn }  = renderComponent()

        const mockSetPopupMessage = vi.spyOn(useMainStore.getState(), "setPopupMessage").mockImplementation(() => {})
        const mockSetShowPopup = vi.spyOn(useMainStore.getState(), "setShowPopup").mockImplementation(() => {})
        vi.spyOn(axios, 'post').mockRejectedValue({})

        await user.type(emailInput, 'test@gmail.com')
        await user.type(passwordInput, 'wrongpassword')
        await user.click(loginBtn)

        expect(mockSetShowPopup).toHaveBeenCalledWith(true)
        expect(mockSetPopupMessage).toHaveBeenCalledWith('Unknown Error')
    })
})