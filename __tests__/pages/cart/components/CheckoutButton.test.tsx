import { CheckoutButton } from "@/app/cart/_components/CheckoutButton"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import axios from "axios"
import { testProducts } from "../../../testdata"
import { useUserStore } from "@/store/useUserStore"
import { useCartStore } from "@/store/useCartStore"

vi.mock('axios')
vi.mock('@/utils/getUserFromToken', () => ({
    getUserFromToken: vi.fn().mockImplementation(() => ({ id: '123', name: 'John Doe', isAdmin: 0 }))
}))

describe("CheckoutButton", () => {
    const origianlUserState = useUserStore.getState()
    const origianlCartState = useCartStore.getState()
    afterEach(() => useUserStore.setState(origianlUserState))
    afterEach(() => useCartStore.setState(origianlCartState))

    it("should send request and open/close modal on click ", async () => {
        useUserStore.setState({ user: { name: "John Doe", id: '123', isAdmin: 0 }})
        useCartStore.setState({ cartItems: [{ ...testProducts[0], quantity: 1 }] })
        render(<CheckoutButton />)

        vi.spyOn(axios, 'post').mockResolvedValue({ data: { session: { client_secret: 'test_client_secret' } }})

        const user = userEvent.setup() 
        const checkoutBtn = screen.getByText(/checkout/i)
        await user.click(checkoutBtn)
        
        expect(screen.getByText(/card numbers/i)).toBeInTheDocument()
        expect(axios.post).toHaveBeenCalledWith('/api/checkout', { cartItems: [{ ...testProducts[0], quantity: 1 }], userId: '123' })

        const cancelBtn = screen.getByText(/cancel/i)
        await user.click(cancelBtn)
        const cancelBtnAgain = screen.queryByText(/cancel/i)
        expect(cancelBtnAgain).toBeNull()

    })
})