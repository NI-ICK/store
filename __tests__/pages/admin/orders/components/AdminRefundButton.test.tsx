import { AdminRefundButton } from "@/app/admin/orders/_components/AdminRefundButton"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import axios from "axios"

vi.mock('axios')

describe("AdminRefundButton", () => {
    it("should not render button if order is already refunded", () => {
        render(<AdminRefundButton orderId="123" paymentIntentId="456" status="Refunded" />)

        expect(screen.queryByText(/refund/i)).toBeNull()
    })

    it("should refund order on button click", async () => {
        render(<AdminRefundButton orderId="123" paymentIntentId="456" status="Pending" />)

        const user = userEvent.setup()
        const modalButton = screen.getByRole('button', { name: /refund/i })
        await user.click(modalButton)
        const refundButton = screen.getAllByRole('button', { name: /refund/i })[1]
        await user.click(refundButton)

        expect(axios.put).toHaveBeenCalledWith('/api/orders', { orderId: '123', paymentIntentId: '456' })
    })
})