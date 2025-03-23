import { GET } from "@/app/api/wishlist/route"
import { connectToDatabase } from "@/utils/connectToDatabase"
import { Connection } from "mysql2/promise"
import { NextRequest } from "next/server"

vi.mock('@/utils/connectToDatabase')

describe("API wishlist", () => {
    describe("GET Request", () => {
        it("should return status 200 on success", async () => {
            vi.mocked(connectToDatabase).mockResolvedValue({ 
                query: vi.fn().mockResolvedValue([[{ wishlist: 'data' }]]),
                end: vi.fn()
            } as unknown as Connection)
            
            const req = new NextRequest('http://localhost/api/wishlist?userId=123', { method: "GET" })  
            const res = await GET(req)

            expect(res.status).toBe(200)
            expect(await res.json()).toEqual({ wishlist: 'data' })
        })

        it("should return status 500 on failed database connection", async () => {
            vi.mocked(connectToDatabase).mockResolvedValue(undefined)
            const req = new NextRequest('http://localhost/api/wishlist?userId=123', { method: "GET" })  
            const res = await GET(req)
    
            expect(res.status).toBe(500)
            expect(await res.json()).toEqual({ message: 'Error connecting to database' })
        })
    })
})