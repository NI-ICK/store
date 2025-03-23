import Cart from "@/app/cart/page"
import { useCartStore } from "@/store/useCartStore"
import { render, screen } from "@testing-library/react"
import { testProducts } from "../../testdata"
import userEvent from "@testing-library/user-event"

vi.mock('axios')

describe("Cart", () => {
    const renderComponent = () => {
        useCartStore.setState({ cartItems: [{ ...testProducts[0], quantity: 1 }] })
        render(<Cart />)

        return {
            user: userEvent.setup(),
            product: screen.getByRole("heading"),
            removeBtn: screen.getByLabelText('remove-button')
        }
    }

    const originalCartState = useCartStore.getState()
    afterEach(() => useCartStore.setState(originalCartState))

    it("should render cart items", () => {
        const { product } = renderComponent()

        expect(product).toBeInTheDocument()
    })

    it("should allow to change product quantity and remove product", async () => {
        const { removeBtn, user } = renderComponent()
        
        const changeQuantity = screen.getByLabelText('change-quantity') as HTMLInputElement
        await user.type(changeQuantity, '4', { initialSelectionStart: 0, initialSelectionEnd: changeQuantity.value.length })
        expect(changeQuantity).toHaveValue(4)

        await user.click(removeBtn)
        expect(useCartStore.getState().cartItems.some(item => item.id === testProducts[0].id)).toBe(false)
    })
})