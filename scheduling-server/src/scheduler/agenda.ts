import Agenda from "agenda";
import dotenv from "dotenv";
dotenv.config();

const mongoUri = process.env.MONGODB_URI!;
if (!mongoUri) {
  throw new Error("MONGODB_URI must be defined in your .env");
}

const agenda = new Agenda({
  db: {
    address: mongoUri,
    collection: "agendaJobs",
  },
  defaultLockLifetime: 10_000,
});

export default agenda;
