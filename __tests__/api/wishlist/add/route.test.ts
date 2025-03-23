import { POST } from "@/app/api/wishlist/add/route"
import { connectToDatabase } from "@/utils/connectToDatabase"
import { Connection } from "mysql2/promise"
import { NextRequest } from "next/server"

vi.mock('@/utils/connectToDatabase')

describe("API wishlist add", () => {
    describe("POST Request", () => {
        it("should return status 200 on success", async () => {
            vi.mocked(connectToDatabase).mockResolvedValue({ 
                query: vi.fn().mockResolvedValue([{ affectedRows: 1 }]),
                end: vi.fn()
            } as unknown as Connection)
            const req = new NextRequest('http://localhost/api/wishlist/add', { method: "POST", body: JSON.stringify({ productId: '123', userId: '123' })})  
            const res = await POST(req)
    
            expect(res.status).toBe(200)
            expect(await res.json()).toEqual({ message: 'Successfully added item to wishlist' })
        })

        it("should return status 500 if query makes no changes to database", async () => {
            vi.mocked(connectToDatabase).mockResolvedValue({ 
                query: vi.fn().mockResolvedValue([{ affectedRows: 0 }]),
                end: vi.fn()
            } as unknown as Connection)
            const req = new NextRequest('http://localhost/api/wishlist/add', { method: "POST", body: JSON.stringify({ productId: '123', userId: '123' })})  
            const res = await POST(req)
    
            expect(res.status).toBe(500)
            expect(await res.json()).toEqual({ message: 'Error adding item to wishlist' })
        })

        it("should return status 500 on failed database connection", async () => {
            vi.mocked(connectToDatabase).mockResolvedValue(undefined)
            const req = new NextRequest('http://localhost/api/wishlist/add', { method: "POST", body: JSON.stringify({ productId: '123', userId: '123' })})  
            const res = await POST(req)
    
            expect(res.status).toBe(500)
            expect(await res.json()).toEqual({ message: 'Error connecting to database' })
        })

    })
})