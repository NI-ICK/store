import { CategoryFilter } from "@/app/products/_components/CategoryFilter"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

vi.mock("next/navigation", () => ({
    useSearchParams: () => ({ get: (key: string) => (key === "q" ? "mascara" : null) })
}))

describe("CategoryFilter", () => {
    const renderComponent = () => {
        render(<CategoryFilter categoryList={['groceries', 'furniture', 'home-appliences']}/>)
    
        return {
            user: userEvent.setup()
        }
    }

    it("should render categories", () => {
        const {} = renderComponent()
    
        expect(screen.getByText('Home appliences')).toBeInTheDocument()
    })

    it("should change selected category on click", async () => {
        const { user } = renderComponent()

        const checkbox = screen.getByLabelText('Groceries')
        expect(checkbox).not.toBeChecked()

        await user.click(checkbox)

        expect(checkbox).toBeChecked()
    })
})