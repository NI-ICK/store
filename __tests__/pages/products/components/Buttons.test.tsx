import { Buttons } from "@/app/products/_components/Buttons"
import { testProducts } from "../../../testdata"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { useUserStore } from "@/store/useUserStore"
import { useCartStore } from "@/store/useCartStore"
import { useWishlistStore } from "@/store/useWishlistStore"

vi.mock('axios')

describe("Buttons", () => {
    const renderComponent = () => {
        useUserStore.setState({ user: { name: "John Doe", id: '123', isAdmin: 0 }})
        render(<Buttons product={testProducts[0]} />)

        return {
            user: userEvent.setup(),
            addToCartBtn: screen.getByLabelText(/add-to-cart/i)
        }
    }

    const originalUserState = useUserStore.getState()
    const originalCartState = useCartStore.getState()
    const originalWishlistState = useWishlistStore.getState()
    afterEach(() => useUserStore.setState(originalUserState))
    afterEach(() => useCartStore.setState(originalCartState))
    afterEach(() => useWishlistStore.setState(originalWishlistState))

    it("should not render if user is not logged in", () => {
        render(<Buttons product={testProducts[0]} />)

        const button = screen.queryByLabelText("add-to-cart")
        
        expect(button).toBeNull()
    })

    it("should add product to cart", async () => {
        const { user, addToCartBtn } = renderComponent()
    
        await user.click(addToCartBtn)

        expect(useCartStore.getState().cartItems.some(item => item.id === testProducts[0].id)).toBe(true)
    })  

    it("should add product to wishlist if there is none and remove if there is", async () => {
        const { user } = renderComponent()
        const addToWishlistBtn = screen.getByLabelText(/add-to-wishlist/i)
        
        await user.click(addToWishlistBtn)
        expect(useWishlistStore.getState().wishlistItems.some(item => item.id === testProducts[0].id)).toBe(true)
        
        const removeFromWishlistBtn = screen.getByLabelText(/remove-from-wishlist/i)
        await user.click(removeFromWishlistBtn)
        
        expect(useWishlistStore.getState().wishlistItems.some(item => item.id === testProducts[0].id)).toBe(false)

    })  
})
