import { MigrationConfig } from "drizzle-orm/migrator";

type Config = {
	api: APIConfig,
	db: DBConfig,
	jwt: JWTConfig,
}

type DBConfig = {
	url: string,
	migrationConfig: MigrationConfig
}

type APIConfig = {
	fileserverHits: number;
	port: number;
	platform: string;
	polkaKey: string;
};

type JWTConfig = {
	accessTokenDuration: number;
	refreshTokenDuration: number;
	secret: string;
	issuer: string;
};

process.loadEnvFile();

export function envOrThrow(key: string) {
	const value = process.env[key];
	if (!value) {
		throw new Error(`${key} missing in env`);
	}
	return value;
}

export const config: Config = {
	db: {
		url: envOrThrow("DB_URL"),
		migrationConfig: {
			migrationsFolder: "./src/db/migrations"
		}
	},
	api: {
		fileserverHits: 0,
		port: Number(envOrThrow("PORT")),
		platform: envOrThrow("PLATFORM"),
		polkaKey: envOrThrow("POLKA_KEY"),
	},
	jwt: {
		accessTokenDuration: 60 * 60,
		refreshTokenDuration: 60 * 60 * 24 * 60,
		secret: envOrThrow("JWTSECRET"),
		issuer: "chirpy",
	},
};
