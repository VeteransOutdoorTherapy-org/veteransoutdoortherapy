import { neon } from "@neondatabase/serverless";
import fs from "node:fs";
const url = fs.readFileSync(".env.local","utf8").split(/\r?\n/).find(l=>l.startsWith("DATABASE_URL=")).slice(13).replace(/^["']|["']$/g,"");
const sql = neon(url);
const rows = await sql`SELECT slug, title, location, is_over, image FROM events WHERE slug LIKE '%antelope%'`;
console.log("rows matching antelope:", rows.length);
for (const r of rows) console.log(JSON.stringify(r, null, 2));
