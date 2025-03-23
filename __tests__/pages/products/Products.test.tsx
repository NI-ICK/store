import Products from "@/app/products/page"
import { render, screen } from "@testing-library/react"
import { ImgHTMLAttributes } from "react"
import { vi } from 'vitest'

vi.mock('next/image', () => ({
    __esModule: true,
    default: (props: ImgHTMLAttributes<HTMLImageElement>) => <img {...props} />,
}))

vi.mock("next/navigation", () => ({
    useSearchParams: () => ({ get: (key: string) => (key === "q" ? "mascara" : null) })
}))

vi.mock("@/utils/fetchData", () => ({
    fetchAllProductsByPage: vi.fn().mockResolvedValue({
        products: [
            { id: 1, title: "Essence Mascara Lash Princess", price: 10, discountPercentage: 10, thumbnail: "/mascara.jpg" },
        ],
        total: 1,
    }),
    fetchProductsByCategory: vi.fn().mockResolvedValue({
        products: [],
        total: 0,
    }),
    fetchProductsByQuery: vi.fn().mockResolvedValue({
        products: [
            { id: 1, title: "Essence Mascara Lash Princess", price: 10, discountPercentage: 10, thumbnail: "/mascara.jpg" },
        ],
        total: 1,
    }),
    fetchCategories: vi.fn().mockResolvedValue(["Makeup", "Skincare"]),
}))

describe("Products", () => {
    const renderComponent = async () => {
        render(await Products({ searchParams: { q: "1" } }))

        return {

        }
    }

    it("should render products", async () => {
        const {} = await renderComponent()

        const product = screen.getByText("Essence Mascara Lash Princess")
        expect(product).toBeInTheDocument() 
    })
})