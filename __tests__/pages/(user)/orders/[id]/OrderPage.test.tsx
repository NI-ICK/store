import OrderPage from "@/app/(user)/orders/[id]/page"
import { fetchSingleOrder, fetchSingleProduct } from "@/utils/fetchData"
import { render, screen } from "@testing-library/react"
import { testOrders, testProducts } from "../../../../testdata"

vi.mock('next/navigation', () => ({ notFound: vi.fn() }))
vi.mock('@/utils/getUserFromToken')
vi.mock('@/utils/fetchData', () => ({
    fetchSingleOrder: vi.fn(),
    fetchSingleProduct: vi.fn()
}))

describe("OrderPage", () => {
    it("should render order", async () => {
        vi.mocked(fetchSingleOrder).mockResolvedValue(testOrders[0])
        vi.mocked(fetchSingleProduct).mockResolvedValue(testProducts[0])
        render(await OrderPage({ params: { id: '123' }}))

        expect(screen.getByText('Pending')).toBeInTheDocument()
    })
})