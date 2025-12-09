import { users } from "../schema.js";
import type { NewUser } from "../schema.js";
import { db } from "../index.js";
import { eq } from "drizzle-orm";

export async function createUser(user: NewUser) {
	const [result] = await db.insert(users).
		values(user)
		.onConflictDoNothing()
		.returning();
	return result;
}

export async function resetUsers() {
	await db.delete(users);
}

export async function getUserByEmail(email: string) {
	const [result] = await db.select().from(users).where(eq(users.email, email));
	return result;
}

export async function getUserById(userID: string) {
	const [result] = await db.select().from(users).where(eq(users.id, userID));
	return result;
}
