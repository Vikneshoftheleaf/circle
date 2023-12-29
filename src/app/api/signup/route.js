import { NextResponse } from "next/server"

export function POST(Request)
{
    const {email, password} = JSON.parse(Request.body)
    return NextResponse.json({email, password})
}