import { POST } from "@/app/api/(orders)/webhook/route"
import { connectToDatabase } from "@/utils/connectToDatabase"
import { stripe } from "@/utils/stripe"
import { Connection } from "mysql2/promise"
import { NextRequest } from "next/server"
import Stripe from "stripe"

const objWithMetadata = {
    type: 'checkout.session.completed',
    data: {
        object: {
            amount_total: 1000,
            payment_intent: '123', 
            metadata: { userId: '123', product_1_id: '123', product_1_quantity: 1 },
        }
    }
}
const obj = {
    type: 'checkout.session.completed',
    data: {
        object: {
            amount_total: 1000,
            payment_intent: '123',
        }
    }
}
vi.mock('stripe', () => {
    return {
        default: class {
            webhooks = { constructEvent: vi.fn(() => objWithMetadata)}
        }   
    }
})
vi.mock('@/utils/connectToDatabase')

describe("API webhook", () => {
    describe("POST Request", () => {
        it("should return status 200 on success", async () => {
            const mockQuery = vi.fn()
                .mockImplementationOnce(() => [{ affectedRows: 1 }])
                .mockImplementationOnce(() => [{ affectedRows: 1 }])
            vi.mocked(connectToDatabase).mockResolvedValue({ 
                query: mockQuery,
                commit: vi.fn(),
                rollback: vi.fn(),
                end: vi.fn(),
                beginTransaction: vi.fn()
            } as unknown as Connection)
            const req = new NextRequest('http://localhost/api/webhook', { method: "POST" })
            const res = await POST(req)
        
            expect(res.status).toBe(200)
            expect(await res.json()).toEqual({ message: 'Order successfull' })
        })

        it("should return status 500 on failed database connection", async () => {
            vi.mocked(connectToDatabase).mockResolvedValue(undefined)
            const req = new NextRequest('http://localhost/api/webhook', { method: "POST" })
            const res = await POST(req)

            expect(await res.json()).toEqual({ message: 'Error connecting to database' })
            expect(res.status).toBe(500)
        })

        it("should return status 500 if order query fails", async () => {
            const mockQuery = vi.fn()
            .mockImplementationOnce(() => [{ affectedRows: 0 }])
            .mockImplementationOnce(() => [{ affectedRows: 1 }])
            vi.mocked(connectToDatabase).mockResolvedValue({ 
                query: mockQuery,
                commit: vi.fn(),
                rollback: vi.fn(),
                end: vi.fn(),
                beginTransaction: vi.fn()
            } as unknown as Connection)
            const req = new NextRequest('http://localhost/api/webhook', { method: "POST" })
            const res = await POST(req)

            expect(await res.json()).toEqual({ message: 'Error adding order to database' })
            expect(res.status).toBe(500)
        })

        it("should return status 500 if loop query fails", async () => {
            const mockQuery = vi.fn()
            .mockImplementationOnce(() => [{ affectedRows: 1 }])
            .mockImplementationOnce(() => [{ affectedRows: 0 }])
            vi.mocked(connectToDatabase).mockResolvedValue({ 
                query: mockQuery,
                commit: vi.fn(),
                rollback: vi.fn(),
                end: vi.fn(),
                beginTransaction: vi.fn()
            } as unknown as Connection)
            const req = new NextRequest('http://localhost/api/webhook', { method: "POST" })
            const res = await POST(req)

            expect(await res.json()).toEqual({ message: 'Error adding orderItem to database' })
            expect(res.status).toBe(500)
        })

        it("should return status 500 if no metadata was received", async () => {
            vi.spyOn(stripe.webhooks, 'constructEvent').mockReturnValue(obj as unknown as Stripe.Event)
    
            const mockQuery = vi.fn()
                .mockImplementationOnce(() => [{ affectedRows: 1 }])
                .mockImplementationOnce(() => [{ affectedRows: 1 }])
            vi.mocked(connectToDatabase).mockResolvedValue({ 
                query: mockQuery,
                commit: vi.fn(),
                rollback: vi.fn(),
                end: vi.fn(),
                beginTransaction: vi.fn()
            } as unknown as Connection)
            const req = new NextRequest('http://localhost/api/webhook', { method: "POST" })
            const res = await POST(req)
        
            expect(await res.json()).toEqual({ message: 'No metadata provided' })
            expect(res.status).toBe(500)
        })
    })
})