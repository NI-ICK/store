import Dashboard from "@/app/admin/page"
import { fetchAdminData } from "@/utils/fetchData"
import { render, screen } from "@testing-library/react"

vi.mock('next/headers', () => ({ cookies: vi.fn() }))
vi.mock('@/utils/fetchData', () => ({
    fetchAdminData: vi.fn()
}))

describe("Dashboard", () => {
    it("should render default data if fetch returns null", async () => {
        vi.mocked(fetchAdminData).mockResolvedValue(null)
        render(await Dashboard())
        
        expect(screen.getByText((_, element) => element?.textContent === 'Total Orders: 0')).toBeInTheDocument()
        expect(screen.getByText((_, element) => element?.textContent === 'Total Value: $0')).toBeInTheDocument()
        expect(screen.getByText((_, element) => element?.textContent === 'Total products: 194')).toBeInTheDocument()
        expect(screen.getByText((_, element) => element?.textContent === 'Total users: 0')).toBeInTheDocument()
        expect(screen.getByText((_, element) => element?.textContent === 'Total admin users: 0')).toBeInTheDocument()
    })

    it("should render fetched data", async () => {
        vi.mocked(fetchAdminData).mockResolvedValue({
            orderCount: 5,
            totalOrderPrice: 250,
            userCount: 10,
            adminUserCount: 2,
            statusData: [
                { status: "Pending", statusCount: 3 },
                { status: "Refunded", statusCount: 2 }
            ]
        })
        render(await Dashboard())
        
        expect(screen.getByText((_, element) => element?.textContent === 'Total Orders: 5')).toBeInTheDocument()
        expect(screen.getByText((_, element) => element?.textContent === 'Total Value: $250')).toBeInTheDocument()
        expect(screen.getByText((_, element) => element?.textContent === 'Total products: 194')).toBeInTheDocument()
        expect(screen.getByText((_, element) => element?.textContent === 'Total users: 10')).toBeInTheDocument()
        expect(screen.getByText((_, element) => element?.textContent === 'Total admin users: 2')).toBeInTheDocument()
        expect(screen.getByText((_, element) => element?.textContent === 'Pending Orders: 3')).toBeInTheDocument()
        expect(screen.getByText((_, element) => element?.textContent === 'Refunded Orders: 2')).toBeInTheDocument()
    })
})