import { RegisterModal } from "@/components/NavBar/RegisterModal"
import { useMainStore } from "@/store/useMainStore"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import axios from "axios"

vi.mock('axios')

describe("RegisterModal", () => {
    const mockSetPopupMessage = vi.spyOn(useMainStore.getState(), "setPopupMessage").mockImplementation(() => {})
    const mockSetShowPopup = vi.spyOn(useMainStore.getState(), "setShowPopup").mockImplementation(() => {})
    const mockSetShowRegisterModal = vi.fn()

    const renderComponent = () => {
        render(<RegisterModal showRegisterModal={true} setShowRegisterModal={mockSetShowRegisterModal} />)
        const [ passwordInput, repPasswordInput ] = screen.getAllByLabelText(/password/i)

        return {
            user: userEvent.setup(),
            emailInput: screen.getByLabelText(/e-mail/i),
            passwordInput: passwordInput,
            repPasswordInput: repPasswordInput,
            nameInput: screen.getByLabelText(/full name/i),
            checkbox: screen.getByLabelText(/policy/i),
            customCheckbox: screen.getByLabelText(/checkbox/i),
            registerBtn: screen.getByRole('button', { name: /register/i }),
        }
    }

    const originalState = useMainStore.getInitialState()
    afterEach(() => { useMainStore.setState(originalState) })

    it("should not render component if showModal is false", () => {
        render(<RegisterModal showRegisterModal={false} setShowRegisterModal={vi.fn()} />)
        expect(screen.queryByText(/register/i)).toBeNull()
    })

    it("should update input on user typing", async () => {
        const { emailInput, passwordInput, repPasswordInput, nameInput, user, checkbox, customCheckbox } = renderComponent()

        await user.type(emailInput, "test@gmail.com")
        await user.type(nameInput, "John Doe")
        await user.type(passwordInput, "password")
        await user.type(repPasswordInput, "password")
        await user.click(customCheckbox)

        expect(emailInput).toHaveValue("test@gmail.com")
        expect(checkbox).toBeChecked()
        expect(nameInput).toHaveValue("John Doe")
        expect(passwordInput).toHaveValue("password")
        expect(repPasswordInput).toHaveValue("password")
    })

    it("should toggle password visibility", async () => {
        const { user, passwordInput, repPasswordInput } = renderComponent()

        const [ eyeIcon1, eyeIcon2 ] = screen.getAllByRole('button', { name: 'visibility-toggle' })
        await user.click(eyeIcon1)
        expect(passwordInput).toHaveAttribute("type", "text")
        await user.click(eyeIcon2)
        expect(repPasswordInput).toHaveAttribute("type", "text")

        const [ slashEyeIcon1, slashEyeIcon2 ] = screen.getAllByRole('button', { name: 'visibility-toggle' })
        await user.click(slashEyeIcon1)
        expect(passwordInput).toHaveAttribute("type", "password")
        await user.click(slashEyeIcon2)
        expect(repPasswordInput).toHaveAttribute("type", "password")
    })

    it("should submit form succesfully", async () => {
        const { user, passwordInput, emailInput, registerBtn, nameInput, repPasswordInput, checkbox, customCheckbox } = renderComponent()

        await user.type(emailInput, "test@gmail.com")
        await user.type(nameInput, "John Doe")
        await user.type(passwordInput, "password")
        await user.type(repPasswordInput, "password")
        await user.click(customCheckbox)
        await user.click(registerBtn)

        expect(axios.post).toHaveBeenCalledWith('/api/register', { email: "test@gmail.com", password: "password", repPassword: "password", name: "John Doe" })
        expect(mockSetShowPopup).toHaveBeenCalledWith(true)
        expect(mockSetPopupMessage).toHaveBeenCalledWith('Registered Succesfully')
        expect(mockSetShowRegisterModal).toHaveBeenCalledWith(false)
    })

    it("should handle API error and display popup", async () => {
        const { user, emailInput, passwordInput, registerBtn, nameInput, repPasswordInput, customCheckbox } = renderComponent()

        vi.spyOn(axios, 'post').mockRejectedValue({})

        await user.type(emailInput, "test@gmail.com")
        await user.type(nameInput, "John Doe")
        await user.type(passwordInput, "password")
        await user.type(repPasswordInput, "password")
        await user.click(customCheckbox)
        await user.click(registerBtn)

        expect(mockSetShowPopup).toHaveBeenCalledWith(true)
        expect(mockSetPopupMessage).toHaveBeenCalledWith('Unknown Error')
    })
})