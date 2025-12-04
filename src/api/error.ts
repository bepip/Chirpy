import { NextFunction, Request, Response } from "express";

export function middlewareError(
	err: Error,
	req: Request,
	res: Response,
	next: NextFunction
) {
	let statusCode = 500;
	let message = "Something went wrong on our end"
	if (err instanceof HttpError) {
		statusCode = err.statusCode;
		message = err.message;
	} else {
		console.log(err.message);
	}

	res.status(statusCode).json({ error: message });
}

export function errorHandler(
	handler: (req: Request, res: Response) => Promise<void>,
) {
	return async (req: Request, res: Response, next: NextFunction) => {
		try {
			await handler(req, res);
		} catch (err) {
			next(err);
		}
	}
}

export class HttpError extends Error {
	statusCode: number;

	constructor(statusCode: number, message: string) {
		super(message);
		this.statusCode = statusCode;

	}
}
export class BadRequestError extends HttpError {
	constructor(message: string = "Bad Request") {
		super(400, message);
	}
}

export class UnauthorizedError extends HttpError {
	constructor(message: string = "Unauthorized") {
		super(401, message);
	}
}

export class ForbiddenError extends HttpError {
	constructor(message: string = "Forbidden") {
		super(403, message);
	}
}

export class NotFoundError extends HttpError {
	constructor(message: string = "Not Found") {
		super(404, message);
	}
}

export class ConflictError extends HttpError {
	constructor(message: string = "Conflict") {
		super(409, message);
	}
}
