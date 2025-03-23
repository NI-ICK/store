import { SearchBar } from '@/components/NavBar/SearchBar'
import { render, screen } from '@testing-library/react'
import mockRouter from 'next-router-mock'
import userEvent from '@testing-library/user-event'

describe('SearchBar', () => {
    mockRouter.push = vi.fn()

    const renderComponent = () => {
        render(<SearchBar categories={['furniture', 'groceries', 'home-appliances']}/>)
        return {
            user: userEvent.setup(),
            searchBar: screen.getByPlaceholderText('Search') as HTMLInputElement,
            dropdownBtn: screen.getByText('Category')
        }
    } 

    it('should change query on input change and navigate correctly', async () => {
        const { user, searchBar } = renderComponent()
        
        await user.type(searchBar, 'Sofa')
        await user.keyboard('{Enter}')
    
        mockRouter.push('/products?q=Sofa')
    
        expect(mockRouter.push).toHaveBeenCalledWith('/products?q=Sofa')
        expect(searchBar).toBeInTheDocument()
        expect(searchBar.value).toBe('Sofa')
    });

    it('should show dropdown on click and list all categories inside', async () => {
        const { user, dropdownBtn } = renderComponent()

        await user.click(dropdownBtn)

        expect(screen.getByText('Furniture')).toBeInTheDocument()
        expect(screen.getByText('Groceries')).toBeInTheDocument()
        expect(screen.getByText('Home appliances')).toBeInTheDocument()
    })

    it("should change category on dropdown category click", async () => {
        const { user, dropdownBtn } = renderComponent()

        await user.click(dropdownBtn)
        await user.click(screen.getByText('Furniture'))

        expect(dropdownBtn).toHaveTextContent('Furniture')
    })
})