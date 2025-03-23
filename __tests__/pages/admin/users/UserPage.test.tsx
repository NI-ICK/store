import UserPage from "@/app/admin/users/page"
import { fetchUserData } from "@/utils/fetchData"
import { render, screen } from "@testing-library/react"

vi.mock('next/headers', () => ({ cookies: vi.fn() }))
vi.mock('@/utils/fetchData', () => ({
    fetchUserData: vi.fn()
}))

describe("UserPage", () => {
    
    it("should render fetched data", async () => {
        vi.mocked(fetchUserData).mockResolvedValue([{
            id: '123',
            email: 'test@gmail.com',
            name: "John Doe",
            isAdmin: 1,
            userOrders: 2
        }])
        render(await UserPage())

        expect(screen.getByText('Admin')).toBeInTheDocument()
        expect(screen.getByText((_, element) => element?.textContent === 'ID: 123')).toBeInTheDocument()
        expect(screen.getByText((_, element) => element?.textContent === 'Email: test@gmail.com')).toBeInTheDocument()
        expect(screen.getByText((_, element) => element?.textContent === 'Name: John Doe')).toBeInTheDocument()
        expect(screen.getByText((_, element) => element?.textContent === 'Orders total: 2')).toBeInTheDocument()
    })
})