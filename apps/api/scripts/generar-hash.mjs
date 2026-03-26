import argon2 from "argon2";

const password = process.argv[2];

if (!password) {
  console.log("Uso: node apps/api/scripts/generar-hash-admin.mjs <password>");
  process.exit(1);
}

const hash = await argon2.hash(password, {
  type: argon2.argon2id,
  timeCost: 3,
  memoryCost: 19456, // ~19MB
  parallelism: 1,
});

console.log(hash);