import "./style.css";
import { Client, Databases } from "appwrite";

const client = new Client();

client
  .setEndpoint(import.meta.env.VITE_APPWRITE_URL)
  .setProject(import.meta.env.VITE_APPWRITE_ACCOUNT);

const db = new Databases(client);

const getTasks = async function () {
  const response = await db.listDocuments(
    import.meta.env.VITE_DATABASE_ID,
    import.meta.env.VITE_COLLECTION_ID
  );

  console.log(response);
};

getTasks();
