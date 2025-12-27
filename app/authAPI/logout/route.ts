// src/app/authAPI/logout/route.ts
import { NextResponse } from 'next/server'

export async function POST() {
	const response = NextResponse.json({ success: true })

	response.cookies.set('token', '', { maxAge: 0, path: '/' })
	response.cookies.set('username', '', { maxAge: 0, path: '/' })

	return response
}
