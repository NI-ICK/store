import { GET } from "@/app/api/(admin)/all-orders/route"
import { connectToDatabase } from "@/utils/connectToDatabase"
import { Connection } from "mysql2/promise"
import { testDatabaseOrders, testOrdersMap } from "../../../testdata"

vi.mock('@/utils/connectToDatabase')

describe("API all-orders", () => {
    describe("GET Request", () => {
        it("should return status 200 on success", async () => {
            vi.mocked(connectToDatabase).mockResolvedValue({ 
                query: vi.fn().mockResolvedValue([testDatabaseOrders]),
                commit: vi.fn(),
                rollback: vi.fn(),
                end: vi.fn(),
                beginTransaction: vi.fn()
            } as unknown as Connection)

            const res = await GET()

            expect(await res.json()).toEqual({ orders: testOrdersMap })
            expect(res.status).toBe(200)
        })

        it("should return status 500 if database query fails", async () => {
            vi.mocked(connectToDatabase).mockResolvedValue({ 
                query: vi.fn().mockResolvedValue([[]]),
                commit: vi.fn(),
                rollback: vi.fn(),
                end: vi.fn(),
                beginTransaction: vi.fn()
            } as unknown as Connection)

            const res = await GET()

            expect(await res.json()).toEqual({ message: "Error selecting orders" })
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