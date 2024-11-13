import { stripe } from "@/utils/stripe"
import { NextRequest, NextResponse } from "next/server"

type Item = Product & {
    quantity: number
}

export async function POST(req: NextRequest) {
    try {
        const { cartItems, userId } = await req.json() 
        if(!cartItems) return NextResponse.json({ message: "No products provided" }, { status: 400 })

        const metadata = cartItems.reduce((acc: Record<string, string>, product: Item, index: number) => {
            acc[`product_${index}_id`] = product.id.toString()
            acc[`product_${index}_quantity`] = product.quantity.toString()
            return acc
        }, {})

        const session = await stripe.checkout.sessions.create({
            ui_mode: 'embedded',
            payment_method_types: ['card'],
            line_items: cartItems.map((product: Item) => ({
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: product.title,
                        images: [product.thumbnail],
                    },
                    unit_amount: Math.ceil(((product.price * (1 - product.discountPercentage / 100)) * 100))
                },
                quantity: product.quantity,
            })),
            metadata: { ...metadata, userId },
            mode: 'payment',
            locale: 'en',
            return_url: `${process.env.WEBSITE_URL}/orders`
        })

        return NextResponse.json({ session }, { status: 200 })
    } catch(error) {
        console.log(error)
        let message = "Unknown error"
        if(error instanceof Error) message = error.message
        return NextResponse.json({ message }, { status: 500 })
    }
} 