import Orders from "@/app/(user)/orders/page"
import { fetchSingleProduct, fetchUserOrders } from "@/utils/fetchData"
import { render, screen } from "@testing-library/react"
import { testOrders, testProducts } from "../../../testdata"
import { getUserFromToken } from "@/utils/getUserFromToken"

vi.mock('@/utils/getUserFromToken')
vi.mock('@/utils/fetchData', () => ({
    fetchUserOrders: vi.fn(),
    fetchSingleProduct: vi.fn()
}))

describe("Orders", () => {
    it("should render orders", async () => {
        vi.mocked(fetchUserOrders).mockResolvedValue({ orders: testOrders })
        vi.mocked(fetchSingleProduct).mockResolvedValue(testProducts[0])
        vi.mocked(getUserFromToken).mockResolvedValue({ id: '123', name: "John Doe", isAdmin: 0 })
        render(await Orders())
    
        expect(screen.getAllByText('Pending')[0]).toBeInTheDocument()
    })

    it("should render text if order has more than 3 items", async () => {
        vi.mocked(fetchUserOrders).mockResolvedValue({ orders: testOrders })
        vi.mocked(fetchSingleProduct).mockResolvedValue(testProducts[0])
        vi.mocked(getUserFromToken).mockResolvedValue({ id: '123', name: "John Doe", isAdmin: 0 })
        render(await Orders())
    
        expect(screen.getByText(/more/i)).toBeInTheDocument()
    })
})