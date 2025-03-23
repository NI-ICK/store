import { GET } from "@/app/api/cart/route"
import { connectToDatabase } from "@/utils/connectToDatabase"
import { Connection } from "mysql2/promise"
import { NextRequest } from "next/server"

vi.mock('@/utils/connectToDatabase')

describe("API cart", () => {
    describe("GET Request", () => {
        it("should return status 200 on success", async () => {
            vi.mocked(connectToDatabase).mockResolvedValue({ 
                query: vi.fn().mockResolvedValue([[{ cart: 'data' }]]),
                end: vi.fn()
            } as unknown as Connection)
            
            const req = new NextRequest('http://localhost/api/cart?userId=123', { method: "GET" })  
            const res = await GET(req)

            expect(res.status).toBe(200)
            expect(await res.json()).toEqual({ cart: 'data' })
        })

        it("should return status 500 on failed database connection", async () => {
            vi.mocked(connectToDatabase).mockResolvedValue(undefined)
            const req = new NextRequest('http://localhost/api/cart?userId=123', { method: "GET" })  
            const res = await GET(req)
    
            expect(res.status).toBe(500)
            expect(await res.json()).toEqual({ message: 'Error connecting to database' })
        })
    })
})