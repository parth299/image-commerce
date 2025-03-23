import { connectToDb } from "@/lib/db";
import Product from "@/models/Product";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
    reuest: NextRequest,
    props: {params: Promise<{id: string}>}
) {
    try {
        const {id} = await props.params;
        await connectToDb();

        const product = await Product.findById(id).lean();

        if(!product) {
            return NextResponse.json({error: "No product found"}, {status: 404})
        }

        return NextResponse.json({product}, {status: 200});
    } catch (error) {
        return NextResponse.json(
            {error: "failed to fetch the product"},
            {status: 500}
        );
    }
}