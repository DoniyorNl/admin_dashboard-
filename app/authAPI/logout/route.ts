import { clearAuthCookie } from 'lib/auth/auth'
import { NextResponse } from 'next/server'

export async function POST() {
    try {
        await clearAuthCookie() // Cookie'ni o'chiradi
        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Logout error:', error)
        return NextResponse.json({ error: 'An error occurred during logout' }, { status: 500 })
    }
}