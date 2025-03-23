import { SearchModal } from '@/components/NavBar/SearchModal'
import { render, screen } from '@testing-library/react'
import { vi } from 'vitest'
import mockRouter from 'next-router-mock'
import userEvent from '@testing-library/user-event'

describe("SearchModal", () => {
    mockRouter.push = vi.fn()

    it('should not render if showModal is false', () => {
        render(<SearchModal setShowModal={vi.fn()} showModal={false} navigate={vi.fn()}/>)

        expect(screen.queryByText('Search')).toBeNull()
    })

    it('should render if showModal is true', () => {
        render(<SearchModal setShowModal={vi.fn()} showModal={true} navigate={vi.fn()}/>)

        expect(screen.getByRole('button', { name: "Search" })).toBeInTheDocument()
    })

    it('should navigate correctly', async () => {
        render(<SearchModal setShowModal={vi.fn()} showModal={true} navigate={vi.fn()}/>)
        
        const user = userEvent.setup()
        const searchBar = screen.getByPlaceholderText('Search') as HTMLInputElement

        await user.type(searchBar, 'Sofa')
        await user.keyboard('{Enter}')
        mockRouter.push('/products?q=Sofa')

        expect(searchBar.value).toBe('Sofa')
        expect(mockRouter.push).toHaveBeenCalledWith("/products?q=Sofa")
    })
})