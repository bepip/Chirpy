import { and, asc, eq } from "drizzle-orm";
import { db } from "../index.js";
import { chirps } from "../schema.js";
import type { NewChirp } from "../schema.js";

export async function createChirp(chirp: NewChirp) {
	const [result] = await db.insert(chirps).values(chirp).returning();
	return result;
}

export async function getChirps() {
	const result = await db.select().from(chirps).orderBy(asc(chirps.createdAt));
	return result;
}

export async function getChrip(chirpID: string) {
	const result = await db.select().from(chirps).where(eq(chirps.id, chirpID));
	if (result.length === 0) {
		return;
	}
	return result[0];
}

export async function deleteChirp(chirpID: string, userID: string) {
	const results = await db.delete(chirps)
		.where(eq(chirps.id, chirpID))
		.returning();
	return results.length > 0;
}
