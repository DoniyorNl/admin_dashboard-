// src/app/api/register/route.ts
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
	const { username, password } = await req.json()

	if (!username || !password) {
		return NextResponse.json({ error: 'Invalid data' }, { status: 400 })
	}

	// Return token in JSON body so client-side code can store a token copy
	const response = NextResponse.json({ success: true, token: 'fake-jwt-token', username })

	response.cookies.set('token', 'fake-jwt-token', {
		httpOnly: true,
		path: '/',
	})

	response.cookies.set('username', username, {
		path: '/',
	})

	return response
}
