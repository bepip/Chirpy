import * as argon2 from "argon2";
import jwt from "jsonwebtoken";
import type { JwtPayload } from "jsonwebtoken";
import { BadRequestError, UnauthorizedError } from "../api/error.js";
import { Request } from "express";
import { config } from "../config.js";
import crypto from "crypto";

export async function hashPassword(password: string): Promise<string> {
	return argon2.hash(password);
}

export async function checkPasswordHash(password: string, hash: string): Promise<boolean> {
	if (!password) return false;
	try {
		return await argon2.verify(hash, password);
	} catch {
		return false;
	}
}

type payload = Pick<JwtPayload, "iss" | "sub" | "iat" | "exp">;

const TOKEN_ISSUER = "chirpy";

export function makeJWT(userID: string, secret: string = config.jwt.secret): string {
	const issuedAt = Date.now() / 1000;
	const payload: payload = {
		iss: TOKEN_ISSUER,
		sub: userID,
		iat: Math.floor(issuedAt),
		exp: config.jwt.accessTokenDuration + issuedAt,
	};
	return jwt.sign(payload, secret, { algorithm: "HS256" });
}

export function validateJWT(tokenString: string, secret: string): string {
	try {
		const payload: payload = jwt.verify(tokenString, secret) as payload;
		if (!payload.sub || !payload.iss || payload.iss != TOKEN_ISSUER) {
			throw new UnauthorizedError();
		}
		return payload.sub;
	} catch {
		throw new UnauthorizedError();
	}
}

export function getBearerToken(req: Request): string {
	const authHeader = req.get("Authorization");
	if (!authHeader) {
		throw new BadRequestError("No token found");
	}
	const parts = authHeader.split(" ");
	if (parts.length !== 2 || parts[0] !== "Bearer") {
		throw new BadRequestError("Wrong header");
	}
	return parts[1];
}

export function makeRefreshToken() {
	return crypto.randomBytes(32).toString('hex');
}
