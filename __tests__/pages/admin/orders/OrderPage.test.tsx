import OrderPage from "@/app/admin/orders/page"
import { fetchAllOrders, fetchSingleProduct } from "@/utils/fetchData"
import { render, screen } from "@testing-library/react"
import { testOrders, testProducts } from "../../../testdata"

vi.mock('@/utils/fetchData', () => ({
    fetchAllOrders: vi.fn(),
    fetchSingleProduct: vi.fn()
}))
vi.mock('next/headers', () => ({ cookies: vi.fn() }))

describe("AdminOrderPage", () => {
    it("should render orders", async () => {
        vi.mocked(fetchAllOrders).mockResolvedValue({ orders: testOrders })
        vi.mocked(fetchSingleProduct).mockResolvedValue(testProducts[0])
        
        render(await OrderPage())

        expect(screen.getByText((_, element) => element?.textContent === 'User ID: 123')).toBeInTheDocument()
    })
})