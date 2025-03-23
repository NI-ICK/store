import { RecomendedProducts } from "@/components/Home/RecomendedProducts"
import { render, screen } from "@testing-library/react"
import { testProducts } from "../../testdata"
import userEvent from "@testing-library/user-event"

describe("RecomendedProducts", () => {
    const renderComponent = () => {
        render(<RecomendedProducts products={testProducts}/>)
    
        return {
            user: userEvent.setup(),
            prevBtn: screen.getAllByRole('button')[0],
            nextBtn: screen.getAllByRole('button')[1],
        }
    }

    it("should render products", () => {
        const {} = renderComponent()
    
        const product1 = screen.getByText("Essence Mascara Lash Princess".substring(0, 22) + '...')
        const product2 = screen.getByText("Eyeshadow Palette with Mirror".substring(0, 22) + '...')

        expect(product1).toBeInTheDocument()
        expect(product2).toBeInTheDocument()
    })

    it("should navigate through products with buttons", async () => {
        const { user, nextBtn } = renderComponent()

        const product = screen.getByText("Essence Mascara Lash Princess".substring(0, 22) + '...')
        expect(product).toBeInTheDocument()

        await user.click(nextBtn)
        
        const productAgain = screen.queryByText("Essence Mascara Lash Princess".substring(0, 22) + '...')
        expect(productAgain).not.toBeInTheDocument()
    })
})