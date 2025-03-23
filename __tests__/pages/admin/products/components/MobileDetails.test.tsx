import { MobileDetails } from "@/app/admin/products/_components/MobileDetails"
import { testProducts } from "../../../../testdata"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

describe("MobileDetails", () => {
    it("should render product details", async () => {
        render(<MobileDetails product={testProducts[0]}/>)
        const user = userEvent.setup()
    
        const details = screen.getByLabelText('details')
        await user.click(details)

        expect(screen.getByText('Beauty')).toBeInTheDocument()
    })
})