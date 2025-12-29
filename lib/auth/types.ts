export interface User {
	id: number
	email: string
	name: string
	role: string
}

export type AuthMeResponse =
	| { success: true; user: User }
	| { success: false; error?: string; message?: string }
