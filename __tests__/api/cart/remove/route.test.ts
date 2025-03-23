import { POST } from "@/app/api/cart/remove/route"
import { connectToDatabase } from "@/utils/connectToDatabase"
import { Connection } from "mysql2/promise"
import { NextRequest } from "next/server"

vi.mock('@/utils/connectToDatabase')

describe("API cart remove", () => {
    describe("POST Request", () => {
        it("should return status 200 on success", async () => {
            const mockQuery = vi.fn()
                .mockImplementationOnce(() => [[{ quantity: 2 }]])
                .mockImplementationOnce(() => [{ affectedRows: 1 }])
            vi.mocked(connectToDatabase).mockResolvedValue({ 
                query: mockQuery,
                end: vi.fn()
            } as unknown as Connection)
            const req = new NextRequest('http://localhost/api/cart/remove', { method: "POST", body: JSON.stringify({ productId: '123', userId: '123' })})  
            const res = await POST(req)
    
            expect(res.status).toBe(200)
            expect(await res.json()).toEqual({ message: 'Successfully removed item from cart' })
        })

        it("should return status 500 if query makes no changes to database", async () => {
            const mockQuery = vi.fn()
                .mockImplementationOnce(() => [[{ quantity: 1 }]])
                .mockImplementationOnce(() => [{ affectedRows: 0 }])
            vi.mocked(connectToDatabase).mockResolvedValue({ 
                query: mockQuery,
                end: vi.fn()
            } as unknown as Connection)
            const req = new NextRequest('http://localhost/api/cart/remove', { method: "POST", body: JSON.stringify({ productId: '123', userId: '123' })})  
            const res = await POST(req)
    
            expect(res.status).toBe(500)
            expect(await res.json()).toEqual({ message: 'Error removing item from cart' })
        })

        it("should return status 500 quantity query fails", async () => {
            const mockQuery = vi.fn()
                .mockImplementationOnce(() => [[{ quantity: 0 }]])
                .mockImplementationOnce(() => [{ affectedRows: 0 }])
            vi.mocked(connectToDatabase).mockResolvedValue({ 
                query: mockQuery,
                end: vi.fn()
            } as unknown as Connection)
            const req = new NextRequest('http://localhost/api/cart/remove', { method: "POST", body: JSON.stringify({ productId: '123', userId: '123' })})  
            const res = await POST(req)
    
            expect(res.status).toBe(500)
            expect(await res.json()).toEqual({ message: 'Error selecting quantity' })
        })

        it("should return status 500 on failed database connection", async () => {
            vi.mocked(connectToDatabase).mockResolvedValue(undefined)
            const req = new NextRequest('http://localhost/api/cart/remove', { method: "POST", body: JSON.stringify({ productId: '123', userId: '123' })})  
            const res = await POST(req)
    
            expect(res.status).toBe(500)
            expect(await res.json()).toEqual({ message: 'Error connecting to database' })
        })

    })
})