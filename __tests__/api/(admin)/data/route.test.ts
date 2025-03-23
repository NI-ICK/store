import { GET } from "@/app/api/(admin)/data/route"
import { connectToDatabase } from "@/utils/connectToDatabase"
import { Connection } from "mysql2/promise"

const statusQuery = [
    { 
        status: 'Pending', statusCount: 2
    },
    {
        status: 'Refunded', statusCount: 1
    }
]
const totalPriceQuery = 12345.12345 
const orderCountQuery = 5 
const userCountQuery = 2 
const adminUserCountQuery = 1 

vi.mock('@/utils/connectToDatabase')

describe("API data", () => {
    describe("GET Request", () => {
        it("should return status 200 on success", async () => {
            const mockQuery = vi.fn()
                .mockImplementationOnce(() => [statusQuery])
                .mockImplementationOnce(() => [[{ totalOrderPrice: totalPriceQuery }]])
                .mockImplementationOnce(() => [[{ orderCount: orderCountQuery }]])
                .mockImplementationOnce(() => [[{ userCount: userCountQuery }]])
                .mockImplementationOnce(() => [[{ adminUserCount: adminUserCountQuery }]])
            vi.mocked(connectToDatabase).mockResolvedValue({ 
                query: mockQuery,
                commit: vi.fn(),
                rollback: vi.fn(),
                end: vi.fn(),
                beginTransaction: vi.fn()
            } as unknown as Connection)

            const res = await GET()

            expect(await res.json()).toEqual({ totalOrderPrice: totalPriceQuery.toFixed(2), orderCount: orderCountQuery, userCount: userCountQuery, adminUserCount: adminUserCountQuery, statusData: statusQuery })
            expect(res.status).toBe(200)
        })

        it("should return status 500 if stauts data query fails", async () => {
            const mockQuery = vi.fn()
                .mockImplementationOnce(() => [[]])
                .mockImplementationOnce(() => [[{ totalOrderPrice: totalPriceQuery }]])
                .mockImplementationOnce(() => [[{ orderCount: orderCountQuery }]])
                .mockImplementationOnce(() => [[{ userCount: userCountQuery }]])
                .mockImplementationOnce(() => [[{ adminUserCount: adminUserCountQuery }]])
            vi.mocked(connectToDatabase).mockResolvedValue({ 
                query: mockQuery,
                commit: vi.fn(),
                rollback: vi.fn(),
                end: vi.fn(),
                beginTransaction: vi.fn()
            } as unknown as Connection)

            const res = await GET()

            expect(await res.json()).toEqual({ message: "Error selecting status data" })
            expect(res.status).toBe(500)
        })

        it("should return status 500 if total order price query fails", async () => {
            const mockQuery = vi.fn()
                .mockImplementationOnce(() => [statusQuery])
                .mockImplementationOnce(() => [[{ totalOrderPrice: null }]])
                .mockImplementationOnce(() => [[{ orderCount: orderCountQuery }]])
                .mockImplementationOnce(() => [[{ userCount: userCountQuery }]])
                .mockImplementationOnce(() => [[{ adminUserCount: adminUserCountQuery }]])
            vi.mocked(connectToDatabase).mockResolvedValue({ 
                query: mockQuery,
                commit: vi.fn(),
                rollback: vi.fn(),
                end: vi.fn(),
                beginTransaction: vi.fn()
            } as unknown as Connection)

            const res = await GET()

            expect(await res.json()).toEqual({ message: "Error selecting total order price" })
            expect(res.status).toBe(500)
        })

        it("should return status 500 if total order count fails", async () => {
            const mockQuery = vi.fn()
                .mockImplementationOnce(() => [statusQuery])
                .mockImplementationOnce(() => [[{ totalOrderPrice: totalPriceQuery }]])
                .mockImplementationOnce(() => [[{ orderCount: null }]])
                .mockImplementationOnce(() => [[{ userCount: userCountQuery }]])
                .mockImplementationOnce(() => [[{ adminUserCount: adminUserCountQuery }]])
            vi.mocked(connectToDatabase).mockResolvedValue({ 
                query: mockQuery,
                commit: vi.fn(),
                rollback: vi.fn(),
                end: vi.fn(),
                beginTransaction: vi.fn()
            } as unknown as Connection)

            const res = await GET()

            expect(await res.json()).toEqual({ message: "Error selecting total order count" })
            expect(res.status).toBe(500)
        })

        it("should return status 500 if total user query fails", async () => {
            const mockQuery = vi.fn()
                .mockImplementationOnce(() => [statusQuery])
                .mockImplementationOnce(() => [[{ totalOrderPrice: totalPriceQuery }]])
                .mockImplementationOnce(() => [[{ orderCount: orderCountQuery }]])
                .mockImplementationOnce(() => [[{ userCount: null }]])
                .mockImplementationOnce(() => [[{ adminUserCount: adminUserCountQuery }]])
            vi.mocked(connectToDatabase).mockResolvedValue({ 
                query: mockQuery,
                commit: vi.fn(),
                rollback: vi.fn(),
                end: vi.fn(),
                beginTransaction: vi.fn()
            } as unknown as Connection)

            const res = await GET()

            expect(await res.json()).toEqual({ message: "Error selecting total user count" })
            expect(res.status).toBe(500)
        })

        it("should return status 500 if admin user count query fails", async () => {
            const mockQuery = vi.fn()
                .mockImplementationOnce(() => [statusQuery])
                .mockImplementationOnce(() => [[{ totalOrderPrice: totalPriceQuery }]])
                .mockImplementationOnce(() => [[{ orderCount: orderCountQuery }]])
                .mockImplementationOnce(() => [[{ userCount: userCountQuery }]])
                .mockImplementationOnce(() => [[{ adminUserCount: null }]])
            vi.mocked(connectToDatabase).mockResolvedValue({ 
                query: mockQuery,
                commit: vi.fn(),
                rollback: vi.fn(),
                end: vi.fn(),
                beginTransaction: vi.fn()
            } as unknown as Connection)

            const res = await GET()

            expect(await res.json()).toEqual({ message: "Error selecting admin user count" })
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