import { Links } from '@/components/NavBar/Links'
import { render, screen } from '@testing-library/react'
import mockRouter from 'next-router-mock'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import { useUserStore } from '@/store/useUserStore'

vi.mock("next/navigation", () => ({
    usePathname: vi.fn().mockReturnValue("/"),
    useRouter: vi.fn(() => mockRouter),
}))
vi.mock('@/utils/getUserFromToken')
  
describe("Links", () => {
    mockRouter.push = vi.fn()

    const renderComponent = () => {
        render(<Links />)

        return {
            user: userEvent.setup(),
            homeBtn: screen.getByText(/home/i),
            cartBtn: screen.getByText(/cart/i),
            wishlistBtn: screen.getByText(/wishlist/i),
        }
    }
    
    const originalUserStoreState = useUserStore.getState()
    afterEach(() => useUserStore.setState(originalUserStoreState))

    it("should navigate to cart if user is logged in", async () => {
        const { user, cartBtn } = renderComponent()

        await user.click(cartBtn)
        mockRouter.push('/cart')

        expect(mockRouter.push).toHaveBeenCalledWith("/cart")
    })

    it("should navigate to wishlist if user is logged in", async () => {
        const { user, wishlistBtn } = renderComponent()

        await user.click(wishlistBtn)
        mockRouter.push('/wishlist')

        expect(mockRouter.push).toHaveBeenCalledWith("/wishlist")
    })

    it("should navigate to dashboard if user is admin", async () => {
        useUserStore.setState({ user: { id: '123', name: "John Doe", isAdmin: 1 } })
        const { user } = renderComponent()

        const adminBtn = screen.getByText(/dashboard/i)

        await user.click(adminBtn)
        mockRouter.push('/admin')

        expect(mockRouter.push).toHaveBeenCalledWith("/admin")
    })
})