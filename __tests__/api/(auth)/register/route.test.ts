import { POST } from "@/app/api/(auth)/register/route"
import { connectToDatabase } from "@/utils/connectToDatabase"
import { Connection } from "mysql2/promise"
import { NextRequest } from "next/server"

vi.mock('@/utils/connectToDatabase')
vi.mock('bcrypt', () => {
    return {
        default: {
            hash: vi.fn().mockResolvedValue('password')
        }
    }
})

describe("API register", () => {
    describe("POST Request", () => {
        it("should return status 200 on success", async () => {
            const mockQuery = vi.fn()
                .mockImplementationOnce(() => [[]])
                .mockImplementationOnce(() => [{ affectedRows: 1 }])
            vi.mocked(connectToDatabase).mockResolvedValue({ 
                query: mockQuery,
                commit: vi.fn(),
                rollback: vi.fn(),
                end: vi.fn(),
                beginTransaction: vi.fn()
            } as unknown as Connection)

            const req = new NextRequest('http://localhost/api/register', { method: "POST", body: JSON.stringify({ email: 'test@gmail.com', password: 'password', name: "John Doe" }) })
            const res = await POST(req)

            expect(await res.json()).toEqual({ message: 'Registered successfully'})
            expect(res.status).toBe(200)
        })

        it("should return status 409 if user already exists", async () => {
            const mockQuery = vi.fn()
                .mockImplementationOnce(() => [[{ email: 'test@gmail.com' }]])
                .mockImplementationOnce(() => [{ affectedRows: 1 }])
            vi.mocked(connectToDatabase).mockResolvedValue({ 
                query: mockQuery,
                commit: vi.fn(),
                rollback: vi.fn(),
                end: vi.fn(),
                beginTransaction: vi.fn()
            } as unknown as Connection)

            const req = new NextRequest('http://localhost/api/register', { method: "POST", body: JSON.stringify({ email: 'test@gmail.com', password: 'password', name: "John Doe" }) })
            const res = await POST(req)

            expect(await res.json()).toEqual({ message: 'User with that email already exists'})
            expect(res.status).toBe(409)
        })

        it("should return status 500 if database query fails", async () => {
            const mockQuery = vi.fn()
                .mockImplementationOnce(() => [[]])
                .mockImplementationOnce(() => [{ affectedRows: 0 }])
            vi.mocked(connectToDatabase).mockResolvedValue({ 
                query: mockQuery,
                commit: vi.fn(),
                rollback: vi.fn(),
                end: vi.fn(),
                beginTransaction: vi.fn()
            } as unknown as Connection)

            const req = new NextRequest('http://localhost/api/register', { method: "POST", body: JSON.stringify({ email: 'test@gmail.com', password: 'password', name: "John Doe" }) })
            const res = await POST(req)

            expect(await res.json()).toEqual({ message: 'Error registering'})
            expect(res.status).toBe(500)
        })
        
        it("should return status 500 on failed database connection", async () => {
            vi.mocked(connectToDatabase).mockResolvedValue(undefined)
            const req = new NextRequest('http://localhost/api/register', { method: "POST", body: JSON.stringify({ email: 'test@gmail.com', password: 'password', name: "John Doe" }) })
            const res = await POST(req)
    
            expect(await res.json()).toEqual({ message: 'Error connecting to database' })
            expect(res.status).toBe(500)
        })
    })
})