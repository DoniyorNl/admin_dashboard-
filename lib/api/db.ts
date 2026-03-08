/**
 * lib/api/db.ts
 * Server-only. Reads/writes backend/db.json directly via fs.
 * Falls back gracefully on Vercel where the filesystem is read-only —
 * reads always work because the file is bundled; writes are best-effort.
 */
import 'server-only'

import fs from 'fs'
import path from 'path'

const DB_PATH = path.join(process.cwd(), 'backend', 'db.json')

export interface DbUser {
	id: string | number
	email: string
	password: string
	name: string
	role?: string
	twoFactorEnabled?: boolean
	twoFactorSecret?: string | null
}

interface Db {
	users: DbUser[]
	[key: string]: unknown[]
}

function readDb(): Db {
	try {
		const raw = fs.readFileSync(DB_PATH, 'utf-8')
		return JSON.parse(raw) as Db
	} catch {
		return { users: [] }
	}
}

function writeDb(db: Db): void {
	try {
		fs.writeFileSync(DB_PATH, JSON.stringify(db, null, '\t'), 'utf-8')
	} catch {
		// Silently ignore on read-only filesystems (e.g. Vercel production).
		// Reads will keep working; writes are a best-effort demo feature.
	}
}

export function getUsers(): DbUser[] {
	return readDb().users || []
}

export function getUserById(id: string | number): DbUser | null {
	return getUsers().find(u => String(u.id) === String(id)) ?? null
}

export function findUserByEmail(email: string): DbUser | null {
	const normalised = email.trim().toLowerCase()
	return getUsers().find(u => u.email.trim().toLowerCase() === normalised) ?? null
}

export function createUser(userData: Omit<DbUser, 'id'>): DbUser {
	const db = readDb()
	const id = String(Date.now()).slice(-8)
	const newUser: DbUser = { id, ...userData }
	db.users = [...(db.users || []), newUser]
	writeDb(db)
	return newUser
}

export function updateUser(id: string | number, patch: Partial<DbUser>): DbUser | null {
	const db = readDb()
	const idx = db.users.findIndex(u => String(u.id) === String(id))
	if (idx === -1) return null
	db.users[idx] = { ...db.users[idx], ...patch }
	writeDb(db)
	return db.users[idx]
}
