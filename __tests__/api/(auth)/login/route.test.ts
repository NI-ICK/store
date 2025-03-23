import { POST } from "@/app/api/(auth)/login/route"
import { connectToDatabase } from "@/utils/connectToDatabase"
import { Connection } from "mysql2/promise"
import { NextRequest } from "next/server"
import bcrypt from 'bcrypt'

vi.mock('@/utils/connectToDatabase')
vi.mock("next/headers", () => ({
    cookies: vi.fn(() => ({
      set: vi.fn()
    })),
  }))
vi.mock("bcrypt")
vi.mock("jose", () => {
    return {
        SignJWT: vi.fn().mockImplementation(() => ({
            sign: vi.fn().mockResolvedValue('mockToken'),
            setExpirationTime: vi.fn().mockReturnThis(),
            setProtectedHeader: vi.fn().mockReturnThis(),
        }))
    }
})

describe("API login", () => {
    describe("POST Request", () => {
        it("should return status 200 on success", async () => {
            vi.mocked(connectToDatabase).mockResolvedValue({ 
                query: vi.fn().mockResolvedValue([[{ id: '123', password: 'password', name: "John Doe", isAdmin: 0 }]]),
                commit: vi.fn(),
                rollback: vi.fn(),
                end: vi.fn(),
                beginTransaction: vi.fn()
            } as unknown as Connection)
            vi.mocked(bcrypt.compare).mockResolvedValue(true as unknown as void)
            const req = new NextRequest('http://localhost/api/login', { method: "POST", body: JSON.stringify({ email: "test@gmail.com", password: "password" }) })
            const res = await POST(req)
        
            expect(await res.json()).toEqual({ message: 'Login successfull' })
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
            vi.mocked(bcrypt.compare).mockResolvedValue(true as unknown as void)
            const req = new NextRequest('http://localhost/api/login', { method: "POST", body: JSON.stringify({ email: "test@gmail.com", password: "password" }) })
            const res = await POST(req)
        
            expect(await res.json()).toEqual({ message: 'User does not exist' })
            expect(res.status).toBe(401)
        })

        it("should return status 500 if database query fails", async () => {
            vi.mocked(connectToDatabase).mockResolvedValue({ 
                query: vi.fn().mockResolvedValue([[{ id: '123', password: 'password', name: "John Doe", isAdmin: 0 }]]),
                commit: vi.fn(),
                rollback: vi.fn(),
                end: vi.fn(),
                beginTransaction: vi.fn()
            } as unknown as Connection)
            vi.mocked(bcrypt.compare).mockResolvedValue(false as unknown as void)
            const req = new NextRequest('http://localhost/api/login', { method: "POST", body: JSON.stringify({ email: "test@gmail.com", password: "password" }) })
            const res = await POST(req)
        
            expect(await res.json()).toEqual({ message: 'Invalid Password' })
            expect(res.status).toBe(401)
        })
        
        it("should return status 500 on failed database connection", async () => {
            vi.mocked(connectToDatabase).mockResolvedValue(undefined)
            const req = new NextRequest('http://localhost/api/login', { method: "POST", body: JSON.stringify({ email: "test@gmail.com", password: "password" }) })
            const res = await POST(req)
    
            expect(res.status).toBe(500)
            expect(await res.json()).toEqual({ message: 'Error connecting to database' })
        })
    })
})