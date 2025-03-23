import { SearchedQuery } from "@/app/products/_components/SearchedQuery"
import { render, screen } from "@testing-library/react"

describe("SearchedQuery", () => {
    it("should display query if its provided", () => {
        render(<SearchedQuery query="mascara"/>)
    
        const query = screen.getByText(/mascara/i)

        expect(query).toBeInTheDocument()
    })
})