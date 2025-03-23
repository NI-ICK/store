import { DELETE, GET, PUT } from "@/app/api/(auth)/user/route"
import { connectToDatabase } from "@/utils/connectToDatabase"
import { Connection } from "mysql2/promise"
import { NextRequest } from "next/server"

vi.mock('@/utils/connectToDatabase')
vi.mock('jose', () => ({
    jwtVerify: vi.fn().mockResolvedValue({ payload: { id: '123' } })
}))
vi.mock('next/headers', () => ({ cookies: vi.fn(() => ({ delete: vi.fn() }))}))

describe("API user", () => {
    describe("GET Request", () => {
        it("should return status 200 on success", async () => {
            vi.mocked(connectToDatabase).mockResolvedValue({ 
                query: vi.fn().mockResolvedValue([[{ id: '123' }]]),
                commit: vi.fn(),
                rollback: vi.fn(),
                end: vi.fn(),
                beginTransaction: vi.fn()
            } as unknown as Connection)

            const req = new NextRequest('http://localhost/api/user', { method: "GET", headers: [["Authorization", "test test"]] })
            const res = await GET(req)

            expect(await res.json()).toEqual({ id: '123'})
            expect(res.status).toBe(200)
        })

        it("should return status 401 if user is not authorized", async () => {
            vi.mocked(connectToDatabase).mockResolvedValue({ 
                query: vi.fn().mockResolvedValue([[{ id: '123' }]]),
                commit: vi.fn(),
                rollback: vi.fn(),
                end: vi.fn(),
                beginTransaction: vi.fn()
            } as unknown as Connection)

            const req = new NextRequest('http://localhost/api/user', { method: "GET" })
            const res = await GET(req)

            expect(await res.json()).toEqual({ message: "Unauthorized" })
            expect(res.status).toBe(401)
        })

        it("should return status 404 if user does not exist", async () => {
            vi.mocked(connectToDatabase).mockResolvedValue({ 
                query: vi.fn().mockResolvedValue([[]]),
                commit: vi.fn(),
                rollback: vi.fn(),
                end: vi.fn(),
                beginTransaction: vi.fn()
            } as unknown as Connection)

            const req = new NextRequest('http://localhost/api/user', { method: "GET", headers: [["Authorization", "test test"]] })
            const res = await GET(req)

            expect(await res.json()).toEqual({ message: "User not found" })
            expect(res.status).toBe(404)
        })

        it("should return status 500 on failed database connection", async () => {
            vi.mocked(connectToDatabase).mockResolvedValue(undefined)

            const req = new NextRequest('http://localhost/api/user', { method: "GET", headers: [["Authorization", "test test"]] })
            const res = await GET(req)

            expect(await res.json()).toEqual({ message: "Error connecting to database" })
            expect(res.status).toBe(500)
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

            const req = new NextRequest('http://localhost/api/user', { method: "PUT", body: JSON.stringify({ id: '123', name: "John Doe", email: "test@gmail.com", password: "password" }) })
            const res = await PUT(req)

            expect(await res.json()).toEqual({ message: "User updated succesfully" })
            expect(res.status).toBe(200)
        })

        it("should return status 500 if database query fails", async () => {
            vi.mocked(connectToDatabase).mockResolvedValue({ 
                query: vi.fn().mockResolvedValue([{ affectedRows: 0 }]),
                commit: vi.fn(),
                rollback: vi.fn(),
                end: vi.fn(),
                beginTransaction: vi.fn()
            } as unknown as Connection)

            const req = new NextRequest('http://localhost/api/user', { method: "PUT", body: JSON.stringify({ id: '123', name: "John Doe", email: "test@gmail.com", password: "password" }) })
            const res = await PUT(req)

            expect(await res.json()).toEqual({ message: "Error updating user" })
            expect(res.status).toBe(500)
        })

        it("should return status 500 on failed database connection", async () => {
            vi.mocked(connectToDatabase).mockResolvedValue(undefined)

            const req = new NextRequest('http://localhost/api/user', { method: "PUT", body: JSON.stringify({ id: '123', name: "John Doe", email: "test@gmail.com", password: "password" }) })
            const res = await PUT(req)

            expect(await res.json()).toEqual({ message: "Error connecting to database" })
            expect(res.status).toBe(500)
        })
    })

    describe("DELETE Request", () => {
        it("should return status 200 on success", async () => {
            vi.mocked(connectToDatabase).mockResolvedValue({ 
                query: vi.fn().mockResolvedValue([{ affectedRows: 1 }]),
                commit: vi.fn(),
                rollback: vi.fn(),
                end: vi.fn(),
                beginTransaction: vi.fn()
            } as unknown as Connection)

            const req = new NextRequest('http://localhost/api/user', { method: "DELETE", body: JSON.stringify({ userId: '123' })})
            const res = await DELETE(req)

            expect(await res.json()).toEqual({ message: "User removed succesfully" })
            expect(res.status).toBe(200)
        })

        it("should return status 500 if database query fails", async () => {
            vi.mocked(connectToDatabase).mockResolvedValue({ 
                query: vi.fn().mockResolvedValue([{ affectedRows: 0 }]),
                commit: vi.fn(),
                rollback: vi.fn(),
                end: vi.fn(),
                beginTransaction: vi.fn()
            } as unknown as Connection)

            const req = new NextRequest('http://localhost/api/user', { method: "DELETE", body: JSON.stringify({ userId: '123' })})
            const res = await DELETE(req)

            expect(await res.json()).toEqual({ message: "Error removing user" })
            expect(res.status).toBe(500)
        })
        
        it("should return status 500 on failed database connection", async () => {
            vi.mocked(connectToDatabase).mockResolvedValue(undefined)
            
            const req = new NextRequest('http://localhost/api/user', { method: "DELETE", body: JSON.stringify({ userId: '123' })})
            const res = await DELETE(req)

            expect(await res.json()).toEqual({ message: "Error connecting to database" })
            expect(res.status).toBe(500)
        })
    })
})