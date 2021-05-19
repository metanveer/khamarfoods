import bcrypt from "bcryptjs";

const users = [
  {
    name: "Admin User",
    email: "admin@example.com",
    password: bcrypt.hashSync("123456", 10),
    isAdmin: true,
  },
  {
    name: "Tanveer",
    email: "tanveer@example.com",
    password: bcrypt.hashSync("123456", 10),
  },
  {
    name: "Nasif",
    email: "nasif@example.com",
    password: bcrypt.hashSync("123456", 10),
  },
];

export default users;
