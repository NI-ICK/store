import Settings from "@/app/(user)/settings/page"
import { useUserStore } from "@/store/useUserStore"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import axios from "axios"
import mockRouter from 'next-router-mock'

vi.mock('axios')

describe("Settings", () => {
    mockRouter.push = vi.fn()

    const renderComponent = () => {
        useUserStore.setState({ user: { id: '123', name: "John Doe", isAdmin: 0 }})
        render(<Settings />)

        return {
            user: userEvent.setup(),
            name: screen.getByLabelText(/change name/i),
            email: screen.getByLabelText(/change email/i),
            password: screen.getByLabelText(/change password/i),
            submit: screen.getByRole('button', { name: /save/i }),
            delModal: screen.getByRole('button', { name: /delete/i }),
        }
    }

    const originalUserState = useUserStore.getState()
    afterEach(() => useUserStore.setState(originalUserState))

    it("should fill out inputs and send form", async () => {
        const { user, name, email, password, submit } = renderComponent()

        await user.type(name, "John Doe")
        await user.type(email, "test@gmail.com")
        await user.type(password, "password")
        await user.click(submit)

        expect(axios.put).toHaveBeenCalledWith('/api/user', { name: "John Doe", email: "test@gmail.com", password: "password", id: '123' })
    })

    it("should delete user on click", async () => {
        const { user, delModal } = renderComponent()
    
        await user.click(delModal)
        const del = screen.getAllByRole('button', { name: /delete/i })[1]
        await user.click(del)
        mockRouter.push('/')

        expect(axios.delete).toHaveBeenCalledWith('/api/user', { data: { userId: '123' }})
        expect(mockRouter.push).toHaveBeenCalledWith('/')
    })
})