import { GET } from "@/app/api/(orders)/order/route"
import { connectToDatabase } from "@/utils/connectToDatabase"
import { Connection } from "mysql2/promise"
import { NextRequest } from "next/server"
import { testOrders } from "../../../testdata"

vi.mock('@/utils/connectToDatabase')

describe("API order", () => {
    describe("GET Request", () =>{
        it("should return status 200 on success", async () => {
            vi.mocked(connectToDatabase).mockResolvedValue({ 
                query: vi.fn().mockResolvedValue([testOrders]),
                end: vi.fn()
            } as unknown as Connection)

            const req = new NextRequest('http://localhost/api/order?orderId=123', { method: "GET" })
            const res = await GET(req)

            expect(res.status).toBe(200)
        })

        it("should return status 500 failed database query", async () => {
            vi.mocked(connectToDatabase).mockResolvedValue({ 
                query: vi.fn().mockResolvedValue([[]]),
                end: vi.fn()
            } as unknown as Connection)
            const req = new NextRequest('http://localhost/api/order?orderId=123', { method: "GET" })  
            const res = await GET(req)
    
            expect(res.status).toBe(500)
            expect(await res.json()).toEqual({ message: 'Error selecting order' })
        })

        it("should return status 500 on failed database connection", async () => {
            vi.mocked(connectToDatabase).mockResolvedValue(undefined)
            const req = new NextRequest('http://localhost/api/order?orderId=123', { method: "GET" })  
            const res = await GET(req)
    
            expect(res.status).toBe(500)
            expect(await res.json()).toEqual({ message: 'Error connecting to database' })
        })
    })
})