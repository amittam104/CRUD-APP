import "./style.css";
import { Client, Databases, ID } from "appwrite";

const client = new Client();

client
  .setEndpoint(import.meta.env.VITE_APPWRITE_URL)
  .setProject(import.meta.env.VITE_APPWRITE_ACCOUNT);

const db = new Databases(client);
const tasksList = document.querySelector("#tasks-list");
const form = document.querySelector("#form");

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
    <strong class="delete" id="delete-${task.$id}">x</strong>
  </div>
  `;
  // console.log(task);
  tasksList.insertAdjacentHTML("afterbegin", renderTasks);

  // Delete Task
  const deleteBtn = document.getElementById(`delete-${task.$id}`);
  const wrapper = document.getElementById(`task-${task.$id}`);

  deleteBtn.addEventListener("click", function () {
    db.deleteDocument(
      import.meta.env.VITE_DATABASE_ID,
      import.meta.env.VITE_COLLECTION_ID,
      task.$id
    );

    wrapper.remove();
  });

  wrapper.firstElementChild.addEventListener("click", async function (e) {
    task.completed = !task.completed;

    e.target.className = `complete-${task.completed}`;

    db.updateDocument(
      import.meta.env.VITE_DATABASE_ID,
      import.meta.env.VITE_COLLECTION_ID,
      task.$id,
      { completed: task.completed }
    );
  });
};

const addTask = async function (e) {
  e.preventDefault();

  const inputTask = e.target.body.value;

  const formError = `<p class="form-error">Please fill the form before submitting</p>`;

  if (!inputTask) {
    e.target.insertAdjacentHTML("beforeend", formError);
    return;
  }

  const response = await db.createDocument(
    import.meta.env.VITE_DATABASE_ID,
    import.meta.env.VITE_COLLECTION_ID,
    ID.unique(),
    { body: inputTask }
  );

  renderTasks(response);

  form.reset();
};

form.addEventListener("submit", addTask);
