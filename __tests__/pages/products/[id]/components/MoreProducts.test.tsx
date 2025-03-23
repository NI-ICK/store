import { MoreProducts } from "@/app/products/[id]/_components/MoreProducts"
import { render, screen } from "@testing-library/react"
import { testProducts } from "../../../../testdata"
import userEvent from "@testing-library/user-event"

describe("MoreProducts", () => {
    const renderComponent = () => {
        render(<MoreProducts moreProducts={testProducts} productId={123}/>)

        return {
            user: userEvent.setup(),
            prevBtn: screen.getAllByRole('button')[0],
            nextBtn: screen.getAllByRole('button')[1],
        }
    }
    
    it("should render products", () => {
        const { } = renderComponent()

        const product = screen.queryByText("Essence Mascara Lash P...")

        expect(product).toBeInTheDocument()
    })

    it("should navigate through products with buttons", async () => {
        const { user, nextBtn, prevBtn } = renderComponent()

        await user.click(nextBtn)
        const product = screen.queryByText("Essence Mascara Lash P...")
        expect(product).toBeNull()
        
        await user.click(prevBtn)
        const productAgain = screen.queryByText("Essence Mascara Lash P...")
        expect(productAgain).toBeInTheDocument()
    })
})