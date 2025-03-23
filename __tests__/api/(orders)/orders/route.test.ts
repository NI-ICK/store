import { GET, PUT } from "@/app/api/(orders)/orders/route"
import { connectToDatabase } from "@/utils/connectToDatabase"
import { Connection } from "mysql2/promise"
import { NextRequest } from "next/server"
import { testOrders } from "../../../testdata"
import { stripe } from "@/utils/stripe"
import Stripe from "stripe"

type StripeType = Stripe.Refund & { lastResponse: { headers: { [key: string]: string; }; requestId: string; statusCode: number; apiVersion?: string | undefined; idempotencyKey?: string | undefined; stripeAccount?: string | undefined; }; }

vi.mock('stripe', () => {
    return {
        default: class {
            paymentIntents = { retrieve: vi.fn().mockResolvedValue({ latest_charge: 'charge' }) }
            refunds = { create: vi.fn().mockResolvedValue({}) }
        }
    }
})
vi.mock('@/utils/connectToDatabase')

describe("API orders", () => {
    describe("GET Request", () => {
        it("should return status 200 on success", async () => {
            vi.mocked(connectToDatabase).mockResolvedValue({ 
                query: vi.fn().mockResolvedValue([testOrders]),
                end: vi.fn()
            } as unknown as Connection)

            const req = new NextRequest('http://localhost/api/order?userId=123', { method: "GET" })
            const res = await GET(req)

            expect(res.status).toBe(200)
        })

        it("should return status 500 failed database query", async () => {
            vi.mocked(connectToDatabase).mockResolvedValue({ 
                query: vi.fn().mockResolvedValue([[]]),
                end: vi.fn()
            } as unknown as Connection)
            const req = new NextRequest('http://localhost/api/order?userId=123', { method: "GET" })  
            const res = await GET(req)
    
            expect(res.status).toBe(500)
            expect(await res.json()).toEqual({ message: 'Error selecting orders' })
        })

        it("should return status 500 on failed database connection", async () => {
            vi.mocked(connectToDatabase).mockResolvedValue(undefined)
            const req = new NextRequest('http://localhost/api/order?userId=123', { method: "GET" })  
            const res = await GET(req)
    
            expect(res.status).toBe(500)
            expect(await res.json()).toEqual({ message: 'Error connecting to database' })
        })
    })

    describe("PUT Request", () => {
        it("should return status 200 on success", async () => {
            vi.mocked(connectToDatabase).mockResolvedValue({ 
                query: vi.fn().mockResolvedValue([{ affectedRows: 1 }]),
                commit: vi.fn(),
                rollback: vi.fn(),
                end: vi.fn(),
                beginTransaction: vi.fn()
            } as unknown as Connection)
            const req = new NextRequest('http://localhost/api/order', { method: "PUT", body: JSON.stringify({ orderId: '123', paymentIntentId: '123' }) })
            const res = await PUT(req)

            expect(res.status).toBe(200)
        })

        it("should return status 500 on failed database query", async () => {
            vi.mocked(connectToDatabase).mockResolvedValue({ 
                query: vi.fn().mockResolvedValue([{ affectedRows: 0 }]),
                commit: vi.fn(),
                rollback: vi.fn(),
                end: vi.fn(),
                beginTransaction: vi.fn()
            } as unknown as Connection)
            const req = new NextRequest('http://localhost/api/order', { method: "PUT", body: JSON.stringify({ orderId: '123', paymentIntentId: '123' }) })
            const res = await PUT(req)

            expect(res.status).toBe(500)
            expect(await res.json()).toEqual({ message: 'Error updating order status' })
        })

        it("should return status 500 on refund fail", async () => {
            const rollback = vi.fn()
            vi.mocked(stripe.refunds.create).mockResolvedValue(undefined as unknown as StripeType) 
            vi.mocked(connectToDatabase).mockResolvedValue({ 
                query: vi.fn().mockResolvedValue([{ affectedRows: 1 }]),
                commit: vi.fn(),
                rollback: rollback,
                end: vi.fn(),
                beginTransaction: vi.fn()
            } as unknown as Connection)
            const req = new NextRequest('http://localhost/api/order', { method: "PUT", body: JSON.stringify({ orderId: '123', paymentIntentId: '123' }) })
            const res = await PUT(req)

            expect(res.status).toBe(500)
            expect(rollback).toHaveBeenCalledTimes(1)
            expect(await res.json()).toEqual({ message: 'Refund failed' })
        })

        it("should return status 500 on failed database connection", async () => {
            vi.mocked(connectToDatabase).mockResolvedValue(undefined)
            const req = new NextRequest('http://localhost/api/order', { method: "PUT", body: JSON.stringify({ orderId: '123', paymentIntentId: '123' }) })
            const res = await PUT(req)

            expect(res.status).toBe(500)
            expect(await res.json()).toEqual({ message: 'Error connecting to database' })
        })
    })
})