import Wishlist from "@/app/wishlist/page"
import { useWishlistStore } from "@/store/useWishlistStore"
import { render, screen, within } from "@testing-library/react"
import { testProducts } from "../testdata"
import { useCartStore } from "@/store/useCartStore"
import userEvent from "@testing-library/user-event"
import axios from "axios"

vi.mock('axios')

describe("Wishlist", () => {
    const renderComponent = () => {
        useWishlistStore.setState({ wishlistItems: testProducts, userId: '123' })
        useCartStore.setState({ userId: '123' })
        render(<Wishlist />)
    
        const prod1 = screen.getByText("Essence Mascara Lash Princess")
        const parent = screen.getAllByLabelText(/product/i)[0]

        return {
            user: userEvent.setup(),
            product: prod1,
            addToCartBtn: within(parent).getAllByRole('button')[0],
            removeFromWBtn: within(parent).getAllByRole('button')[1],
        }
    }

    const originalWishlistState = useWishlistStore.getState()
    const originalCartState = useCartStore.getState()
    afterEach(() => useWishlistStore.setState(originalWishlistState))
    afterEach(() => useCartStore.setState(originalCartState))

    it("should render wishlist products", () => {
        const { product } = renderComponent()
        expect(product).toBeInTheDocument()
    })

    it("should remove product from wishlist on button click", async () => {
        const { user, removeFromWBtn } = renderComponent()

        await user.click(removeFromWBtn)
        expect(axios.post).toHaveBeenCalledWith('/api/wishlist/remove', { productId: 1, userId: '123' })
    })

    it("should add product to cart on button click", async () => {
        const { user, addToCartBtn } = renderComponent()

        await user.click(addToCartBtn)
        expect(axios.post).toHaveBeenCalledWith('/api/cart/add', { productId: 1, userId: '123' })
    })
})