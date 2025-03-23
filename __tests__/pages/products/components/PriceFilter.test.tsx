import { PriceFilter } from "@/app/products/_components/PriceFilter"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

vi.mock("next/navigation", () => ({
    useSearchParams: () => ({ get: (key: string) => (key === "pr" ? "50-300" : null) })
}))

describe("PriceFilter", () => {
    const renderComponent = () => {
        render(<PriceFilter />)

        return {
            user: userEvent.setup(),
            priceFrom: screen.getAllByRole('spinbutton')[0] as HTMLInputElement,
            priceTo: screen.getAllByRole('spinbutton')[1] as HTMLInputElement,
        }
    }

    it("should render input fields with default values from params", () => {
        const { priceFrom, priceTo } = renderComponent()
    
        expect(priceFrom).toHaveValue(50)
        expect(priceTo).toHaveValue(300)
    })

    it("should limit amount to 99999", async () => {
        const { priceFrom, priceTo, user } = renderComponent()
    
        await user.clear(priceFrom)
        await user.type(priceFrom, '100000')
        await user.clear(priceTo)
        await user.type(priceTo, '100000')

        expect(priceFrom).toHaveValue(10000)
        expect(priceTo).toHaveValue(10000)
    })

    it("should change input while typing", async () => {
        const { priceFrom, priceTo, user } = renderComponent()
    
        await user.clear(priceFrom)
        await user.type(priceFrom, '50')
        await user.clear(priceTo)
        await user.type(priceTo, '200')

        expect(priceFrom).toHaveValue(50)
        expect(priceTo).toHaveValue(200)
    })
})