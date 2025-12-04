import { defineConfig } from "drizzle-kit";
import { config } from "./src/config"

const dbURL = config.db.url;

export default defineConfig({
	schema: "./src/db/schema.ts",
	out: "./src/db/migrations",
	dialect: "postgresql",
	dbCredentials: {
		url: dbURL,
	},
});
