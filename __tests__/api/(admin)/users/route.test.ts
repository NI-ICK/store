import { GET } from "@/app/api/(admin)/users/route"
import { connectToDatabase } from "@/utils/connectToDatabase"
import { Connection } from "mysql2/promise"

vi.mock('@/utils/connectToDatabase')

const userOrdersCountQuery = [
    { 
        userId: '123', userOrders: 2
    },
    {
        userId: '456', userOrders: 7
    }
]

describe("API users", () => {
    describe("GET Request", () => {
        it("should return status 200 on success", async () => {
            const mockQuery = vi.fn()
                .mockImplementationOnce(() => [[{ id: '123', name: 'John Doe' }, { id: '456', name: 'John' }]])
                .mockImplementationOnce(() => [userOrdersCountQuery])
            vi.mocked(connectToDatabase).mockResolvedValue({ 
                query: mockQuery,
                commit: vi.fn(),
                rollback: vi.fn(),
                end: vi.fn(),
                beginTransaction: vi.fn()
            } as unknown as Connection)

            const res = await GET()

            expect(await res.json()).toEqual({ userData: [{ id: '123', userOrders: 2, name: 'John Doe' }, { id: '456', userOrders: 7, name: 'John' }] })
            expect(res.status).toBe(200)
        })

        it("should return status 500 if user select query fails", async () => {
            const mockQuery = vi.fn()
                .mockImplementationOnce(() => [[]])
                .mockImplementationOnce(() => [userOrdersCountQuery])
            vi.mocked(connectToDatabase).mockResolvedValue({ 
                query: mockQuery,
                commit: vi.fn(),
                rollback: vi.fn(),
                end: vi.fn(),
                beginTransaction: vi.fn()
            } as unknown as Connection)

            const res = await GET()

            expect(await res.json()).toEqual({ message: "Error selecting users" })
            expect(res.status).toBe(500)
        })

        it("should return status 500 if user orders count query fails", async () => {
            const mockQuery = vi.fn()
                .mockImplementationOnce(() => [[{ id: '123', name: 'John Doe' }, { id: '456', name: 'John' }]])
                .mockImplementationOnce(() => [[]])
            vi.mocked(connectToDatabase).mockResolvedValue({ 
                query: mockQuery,
                commit: vi.fn(),
                rollback: vi.fn(),
                end: vi.fn(),
                beginTransaction: vi.fn()
            } as unknown as Connection)

            const res = await GET()

            expect(await res.json()).toEqual({ message: "Error selecting user order count" })
            expect(res.status).toBe(500)
        })

        it("should return status 500 on failed database connection", async () => {
            vi.mocked(connectToDatabase).mockResolvedValue(undefined)

            const res = await GET()
    
            expect(await res.json()).toEqual({ message: 'Error connecting to database' })
            expect(res.status).toBe(500)
        })
    })
})