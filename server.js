import "dotenv/config";
import app from "./app.js";
import { verifyCloudinaryConnection } from "./config/cloudinary.js";
import ConnectDB from "./config/db.js";
import { verifyMailerConnection } from "./config/mailer.js";

const reportConnection = async (service, verify) => {
  try {
    await verify();
    console.log(`${service} connected`);
  } catch (error) {
    console.error(`${service} not connected: ${error.message}`);
  }
};

for (const key of ["Mongo_URL", "JWT_SECRET"]) {
  if (!process.env[key]) {
    console.log(`${key} is missing. Add it to the .env file.`);
    process.exit(1);
  }
}

await ConnectDB();
await Promise.all([
  reportConnection("Cloudinary", verifyCloudinaryConnection),
  reportConnection("Nodemailer", verifyMailerConnection),
]);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`server is running on http://localhost:${PORT}`);
});