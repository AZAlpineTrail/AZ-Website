import fs from "node:fs";

function parseEnv(path) {
  return Object.fromEntries(
    fs.readFileSync(path, "utf8")
      .split(/\r?\n/)
      .filter((line) => /^[A-Z][A-Z0-9_]*=/.test(line))
      .map((line) => {
        const separator = line.indexOf("=");
        return [line.slice(0, separator), line.slice(separator + 1).replace(/^"|"$/g, "")];
      }),
  );
}

function parseCsv(source) {
  const rows = [];
  let row = [];
  let value = "";
  let quoted = false;

  for (let index = 0; index < source.length; index += 1) {
    const character = source[index];
    if (quoted) {
      if (character === '"') {
        if (source[index + 1] === '"') {
          value += '"';
          index += 1;
        } else {
          quoted = false;
        }
      } else {
        value += character;
      }
    } else if (character === '"') {
      quoted = true;
    } else if (character === ",") {
      row.push(value);
      value = "";
    } else if (character === "\n") {
      row.push(value.replace(/\r$/, ""));
      rows.push(row);
      row = [];
      value = "";
    } else {
      value += character;
    }
  }

  if (value || row.length) {
    row.push(value);
    rows.push(row);
  }
  return rows;
}

function valueAt(row, headers, name) {
  return (row[headers.indexOf(name)] ?? "").trim();
}

async function listUsers(url, key) {
  const users = [];
  for (let page = 1; ; page += 1) {
    const response = await fetch(`${url}/auth/v1/admin/users?page=${page}&per_page=1000`, {
      headers: { apikey: key, Authorization: `Bearer ${key}` },
    });
    if (!response.ok) throw new Error(`Supabase user listing failed (${response.status}).`);
    const result = await response.json();
    const batch = result.users ?? result;
    users.push(...batch);
    if (batch.length < 1000) return users;
  }
}

async function createUser(url, key, user) {
  const response = await fetch(`${url}/auth/v1/admin/users`, {
    method: "POST",
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: user.email,
      email_confirm: true,
      user_metadata: {
        first_name: user.firstName,
        last_name: user.lastName,
        full_name: `${user.firstName} ${user.lastName}`.trim(),
        zip_code: user.zipCode || null,
        migrated_from: "wordpress",
      },
    }),
  });
  if (!response.ok) throw new Error(`Supabase user creation failed (${response.status}).`);
}

const csvPath = process.argv[2];
const shouldImport = process.argv.includes("--import");
if (!csvPath) throw new Error("Usage: node scripts/migrate-wordpress-users.mjs <csv> [--import]");

const env = parseEnv(".env.local");
const url = env.NEXT_PUBLIC_SUPABASE_URL;
const key = env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) throw new Error("Supabase URL or service-role key is missing from .env.local.");

const [headers, ...rows] = parseCsv(fs.readFileSync(csvPath, "utf8"));
const candidates = rows
  .filter((row) => valueAt(row, headers, "Role").toLowerCase() === "subscriber")
  .map((row) => ({
    email: valueAt(row, headers, "Email").toLowerCase(),
    firstName: valueAt(row, headers, "First Name"),
    lastName: valueAt(row, headers, "Last Name"),
    zipCode: valueAt(row, headers, "Zip"),
  }));

const existingUsers = await listUsers(url, key);
const existingEmails = new Set(existingUsers.map((user) => user.email?.toLowerCase()).filter(Boolean));
const newUsers = candidates.filter((user) => !existingEmails.has(user.email));

console.log(JSON.stringify({
  mode: shouldImport ? "import" : "dry-run",
  wordpressSubscribers: candidates.length,
  existingSupabaseUsers: existingUsers.length,
  alreadyInSupabase: candidates.length - newUsers.length,
  wouldCreate: newUsers.length,
  missingZipCode: newUsers.filter((user) => !user.zipCode).length,
}, null, 2));

if (shouldImport) {
  let created = 0;
  for (const user of newUsers) {
    await createUser(url, key, user);
    created += 1;
  }
  console.log(`Created ${created} Supabase users.`);
}
