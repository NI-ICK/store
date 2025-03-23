import { POST } from "@/app/api/(auth)/logout/route"

vi.mock("next/headers", () => ({
    cookies: vi.fn(() => ({
      delete: vi.fn()
    })),
  }))

describe("API Logout", () => {
    describe("POST Request", () => {
        it("should return status 200 on success", async () => {
            const res = await POST()

            expect(res.status).toBe(200)
            expect(await res.json()).toEqual({ message: 'Logged out' })
        })
    })
})