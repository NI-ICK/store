import { Popup } from "@/components/Popup"
import { useMainStore } from "@/store/useMainStore"
import { render, screen } from "@testing-library/react"

describe("Popup", () => {
    const originalState = useMainStore.getState()
    afterEach(() => useMainStore.setState(originalState))

    it("should not render popup if showPopup is false", () => {
        useMainStore.setState({ showPopup: false, popupMessage: "test" })
        render(<Popup />)

        const msg = screen.queryByText("test")
        expect(msg).not.toBeInTheDocument()
    })

    it("should render popup if showPopup is true and display message", () => {
        useMainStore.setState({ showPopup: true, popupMessage: "test" })
        render(<Popup />)

        const msg = screen.queryByText("test")
        expect(msg).toBeInTheDocument()
    })
})