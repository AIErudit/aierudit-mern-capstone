import bcrypt from "bcryptjs";

// Seed users for the capstone. john@learner.aierudit.io is the canonical
// non-admin test user referenced by the AIErudit course module instructions.
// admin@aierudit.io exists so learners can sign in as an admin to confirm
// the CAPSTONE-BUG-3 fix once they've made it.
export const seedUsers = [
  {
    name: "Admin",
    email: "admin@aierudit.io",
    password: "AdminPassword!2026",
    isAdmin: true,
  },
  {
    name: "John Learner",
    email: "john@learner.aierudit.io",
    password: "123456",
    isAdmin: false,
  },
];

export async function buildUserDocs() {
  const docs = [];
  for (const u of seedUsers) {
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(u.password, salt);
    docs.push({
      name: u.name,
      email: u.email,
      passwordHash,
      isAdmin: u.isAdmin,
    });
  }
  return docs;
}
