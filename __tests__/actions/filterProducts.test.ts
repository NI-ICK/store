import { filterProducts } from "@/app/_actions/filterProducts"
import { redirect } from "next/navigation"

vi.mock('next/navigation', () => ({
    redirect: vi.fn(),
}))

describe("filterProducts", () => {
    it("should redirect with correct params", async () => {
        const formData = new FormData()
        formData.append('category', 'Electronics')
        formData.append('priceFrom', '10')
        formData.append('priceTo', '500')
        formData.append('query', 'laptop')

        await filterProducts(formData)

        expect(redirect).toHaveBeenCalledWith('/products?q=laptop&c=electronics&pr=10-500')
    })
})