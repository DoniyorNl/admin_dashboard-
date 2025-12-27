// src/app/authAPI/login/route.ts
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
	const { username, password } = await req.json()

	if (!username || !password) {
		return NextResponse.json({ error: 'Invalid data' }, { status: 400 })
	}

	// Set httpOnly cookie for server-side auth simulation
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
