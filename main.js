import "./style.css";
import { Client, Databases } from "appwrite";

const client = new Client();

const tasksList = document.querySelector("#tasks-list");

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

  response.documents.forEach((task) => renderTasks(task));
};

getTasks();

const renderTasks = async function (task) {
  const renderTasks = `
  <div class="task-wrapper" id="task-${task.$id}">
    <p class="complete-${task.completed}">${task.body}</p>
    <strong class="delete">x</strong>
  </div>
  `;
  // console.log(task);
  tasksList.insertAdjacentHTML("afterbegin", renderTasks);
};
