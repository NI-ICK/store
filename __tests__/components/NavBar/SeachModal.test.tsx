import { SearchModal } from "@/components/NavBar/SearchModal"
import { render, screen } from "@testing-library/react"

describe("SearchModal", () => {
    it("should not render if showModal is false", () => {
        render(<SearchModal showModal={false} setShowModal={vi.fn()} navigate={vi.fn()}/>)
        const btn = screen.queryByText(/search/i)
        expect(btn).toBeNull()
    })

    it("should render if showModal is true", () => {
        render(<SearchModal showModal={true} setShowModal={vi.fn()} navigate={vi.fn()}/>)
        const btn = screen.queryByText(/search/i)
        expect(btn).toBeInTheDocument()
    })
})