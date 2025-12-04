import { MigrationConfig } from "drizzle-orm/migrator";

type APIConfig = {
	fileserverHits: number;
	port: number;
	platform: string;
};

type Config = {
	api: APIConfig,
	db: DBConfig,
}

type DBConfig = {
	url: string,
	migrationConfig: MigrationConfig
}

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
	},
};
