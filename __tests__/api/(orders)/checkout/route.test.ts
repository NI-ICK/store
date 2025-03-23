import { POST } from "@/app/api/(orders)/checkout/route"
import { NextRequest } from "next/server"
import Stripe from "stripe"
import { testProducts } from "../../../testdata"

type Data = Stripe.Checkout.Session & { lastResponse: { headers: { [key: string]: string; }; requestId: string; statusCode: number; apiVersion?: string | undefined; idempotencyKey?: string | undefined; stripeAccount?: string | undefined; }; }

vi.mock('stripe', () => {
    return {
      default: class {
        checkout = {
          sessions: {
            create: vi.fn().mockResolvedValue({
              id: 'session_id',
              url: 'https://checkout.stripe.com/pay/session_id',
              payment_status: 'unpaid',
              lastResponse: {
                headers: {},
                requestId: 'req_123',
                statusCode: 200,
              },
            } as Data),
          },
        };
      },
    }
})

describe("API checkout", () => {
    describe("POST Request", () => {
        it("should return status 200 on success", async () => {
            const req = new NextRequest('http://localhost/api/checkout', { 
                method: "POST", 
                body: JSON.stringify({ cartItems: [{ ...testProducts[0], quantity: 1 }, { ...testProducts[1], quantity: 1 }], userId: '123' }) })  
            const res = await POST(req)

            expect(res.status).toBe(200)
        })

        it("should return status 400 if no cartItems are provided", async () => {
            const req = new NextRequest('http://localhost/api/checkout', { 
                method: "POST", 
                body: JSON.stringify({ userId: '123' }) })  
            const res = await POST(req)

            expect(res.status).toBe(400)
        })
    })
})  