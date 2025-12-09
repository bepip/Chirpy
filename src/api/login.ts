import { Request, Response } from "express";
import { BadRequestError, UnauthorizedError } from "./error.js";
import { checkPasswordHash, getBearerToken, makeJWT } from "../lib/auth.js";
import { getUserByEmail } from "../db/queries/users.js";
import { config } from "../config.js";
import { NewRefreshToken, NewUser, UserResponse } from "../db/schema.js";
import { createRefreshToken, getRefreshTokenData, getUserFromRefreshToken, revokeToken } from "../db/queries/refreshTokens.js";

type LoginResponse = UserResponse & {
	token: string,
	refreshToken: string,
};

export async function handlerLogin(req: Request, res: Response) {
	type parameter = {
		email: string,
		password: string
	}

	const params: parameter = req.body;

	if (!params.email || !params.password) {
		throw new BadRequestError("Missing parameters");
	}
	const user = await getUserByEmail(params.email);

	if (!user) {
		throw new UnauthorizedError("Incorrect email or password");
	}

	if (await checkPasswordHash(params.password, user.hashedPassword)) {
		const token = makeJWT(user.id, config.jwt.secret);
		const refreshToken = await createRefreshToken(user.id);
		res.status(200).json({
			id: user.id,
			createdAt: user.createdAt,
			updatedAt: user.updatedAt,
			email: user.email,
			token,
			refreshToken: refreshToken.token
		} satisfies LoginResponse);
	} else {
		throw new UnauthorizedError("Incorrect email or password");
	}
}

export async function handlerRefresh(req: Request, res: Response) {
	const refreshToken = getBearerToken(req);
	const tokenData: NewRefreshToken = await getRefreshTokenData(refreshToken);

	if (!tokenData || tokenData.revokedAt || tokenData.expiresAt.getTime() > Date.now()) {
		throw new UnauthorizedError();
	}
	const user = await getUserFromRefreshToken(refreshToken);
	if (!user) {
		throw new UnauthorizedError("User not found");
	}

	const accessToken = makeJWT(user.id);
	res.status(200).json({
		token: accessToken,
	});
}

export async function handlerRevoke(req: Request, res: Response) {
	const refreshToken = getBearerToken(req);
	const newRefreshToken = await revokeToken(refreshToken);
	if (!newRefreshToken) {
		throw new Error(`Failed to update db`);
	}
	res.status(204).send();
}
