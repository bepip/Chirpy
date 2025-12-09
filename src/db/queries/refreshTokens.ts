import { config } from "../../config.js";
import { db } from "../index.js";
import { NewRefreshToken, refreshTokens, users } from "../schema.js";
import { makeRefreshToken } from "../../lib/auth.js";
import { eq, sql } from "drizzle-orm";

export async function createRefreshToken(userID: string) {
	const expiresAt = new Date(Date.now() / 1000 + config.jwt.refreshTokenDuration);
	const token = makeRefreshToken();
	const data: NewRefreshToken = {
		token,
		expiresAt,
		userId: userID
	};

	const [result] = await db.insert(refreshTokens).values(data).returning();

	return result;
}

export async function getRefreshTokenData(token: string) {
	const [result] = await db.select().from(refreshTokens).where(eq(refreshTokens.token, token));
	return result;
}

export async function getUserFromRefreshToken(token: string) {
	const [result] = await db.select({
		id: users.id,
		createdAt: users.createdAt,
		updatedAt: users.updatedAt,
		email: users.email,
		hashedPassword: users.hashedPassword
	})
		.from(refreshTokens)
		.innerJoin(users, eq(refreshTokens.userId, users.id))
		.where(eq(refreshTokens.token, token));
	return result;
}

export async function revokeToken(token: string) {
	const [result] = await db.update(refreshTokens)
		.set({ revokedAt: sql`NOW()` })
		.where(eq(refreshTokens.token, token))
		.returning();
	return result;
}
