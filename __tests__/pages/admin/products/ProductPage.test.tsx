import ProductPage from "@/app/admin/products/page"
import { fetchAllProductsByPage } from "@/utils/fetchData"
import { render, screen } from "@testing-library/react"
import { testProducts } from "../../../testdata"
import { AnchorHTMLAttributes, ImgHTMLAttributes } from "react"

vi.mock('@/utils/fetchData', () => ({
    fetchAllProductsByPage: vi.fn()
}))
vi.mock('next/image', () => ({
    __esModule: true,
    default: (props: ImgHTMLAttributes<HTMLImageElement>) => <img {...props} />,
}))
vi.mock('next/link', () => ({
    __esModule: true,
    default: (props: AnchorHTMLAttributes<HTMLAnchorElement>) => <a {...props} />,
}))

describe("ProductPage", () => {
    const renderComponent = async () => {
        vi.mocked(fetchAllProductsByPage).mockResolvedValue({ products: testProducts, total: 7 })
        render(await ProductPage({ searchParams: Promise.resolve({ p: '1' })}))

        return {

        }
    }

    it("should render fetched products", async () => {
        const { } = await renderComponent()
        
        expect(screen.getAllByText('Beauty')[0]).toBeInTheDocument()
    })
})