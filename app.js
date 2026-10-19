import { auth, db } from "./firebase-config.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { 
  collection, 
  addDoc, 
  getDocs, 
  deleteDoc, 
  doc, 
  updateDoc, 
  query, 
  where 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const taskForm = document.getElementById("task-form");
const taskTitle = document.getElementById("task-title");
const taskDesc = document.getElementById("task-desc");
const tasksContainer = document.getElementById("tasks-container");
const saveTaskBtn = document.getElementById("save-task-btn");
const logoutBtn = document.getElementById("logout-btn");

let activeUser = null;
let selectedTaskId = null;

onAuthStateChanged(auth, (usr) => {
  if (usr) {
    activeUser = usr;
    fetchTasks();
  } else {
    window.location.href = "index.html";
  }
});

logoutBtn.addEventListener("click", () => {
  signOut(auth).then(() => {
    window.location.href = "index.html";
  });
});

async function fetchTasks() {
  tasksContainer.innerHTML = "<p>Loading tasks...</p>";
  
  try {
    const q = query(collection(db, "tasks"), where("userId", "==", activeUser.uid));
    const querySnap = await getDocs(q);
    
    tasksContainer.innerHTML = "";

    if (querySnap.empty) {
      tasksContainer.innerHTML = "<p>No tasks yet.</p>";
      return;
    }

    querySnap.forEach((docItem) => {
      const task = docItem.data();
      const id = docItem.id;

      const card = document.createElement("div");
      card.className = "task-card";
      card.innerHTML = `
        <h4>${task.title}</h4>
        <p>${task.description || "No details"}</p>
        <div class="task-actions">
          <button class="btn-edit" data-id="${id}" data-title="${task.title}" data-desc="${task.description || ''}">Edit</button>
          <button class="btn-delete" data-id="${id}">Delete</button>
        </div>
      `;

      tasksContainer.appendChild(card);
    });

    bindCardEvents();
  } catch (err) {
    tasksContainer.innerHTML = "<p>Error loading tasks.</p>";
  }
}

taskForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const title = taskTitle.value.trim();
  const description = taskDesc.value.trim();

  if (!title) return;

  try {
    if (selectedTaskId) {
      const taskRef = doc(db, "tasks", selectedTaskId);
      await updateDoc(taskRef, { title, description });
      selectedTaskId = null;
      saveTaskBtn.textContent = "Add Task";
    } else {
      await addDoc(collection(db, "tasks"), {
        title: title,
        description: description,
        userId: activeUser.uid,
        createdAt: new Date()
      });
    }

    taskForm.reset();
    fetchTasks();
  } catch (err) {
    alert(err.message);
  }
});

function bindCardEvents() {
  document.querySelectorAll(".btn-delete").forEach((btn) => {
    btn.addEventListener("click", async (e) => {
      const id = e.target.getAttribute("data-id");
      if (confirm("Delete this task?")) {
        await deleteDoc(doc(db, "tasks", id));
        fetchTasks();
      }
    });
  });

  document.querySelectorAll(".btn-edit").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const id = e.target.getAttribute("data-id");
      const title = e.target.getAttribute("data-title");
      const desc = e.target.getAttribute("data-desc");

      taskTitle.value = title;
      taskDesc.value = desc;
      selectedTaskId = id;
      saveTaskBtn.textContent = "Update Task";
    });
  });
}
