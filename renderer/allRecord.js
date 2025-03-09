document.getElementById("main-menu").addEventListener("click", () => {
  window.electronAPI.mainMenu("./renderer/index.html");
});

const clientDetailsDiv = document.getElementById("client-details");
const data = await window.electronAPI.allData();
let generatedHtml = "";
data.forEach((item) => {
  generatedHtml += `
            <div class="card__data>

              <div class="card__right">
                  <div class="item">${item.cnic}</div>
              </div>
              <div class="card__left">
                  <div class="item">${item.name}</div>
              </div>
            </div>
            <button class="view-btn" data-id="${item.cnic}">View Full Record</button>
            <button class="dlt-btn" data-id="${item.cnic}">Delete Record</button>
            <button class="edit-btn" data-id="${item.cnic}">Edit Record</button>
          `;
});

clientDetailsDiv.innerHTML = generatedHtml;

// const { ipcRenderer } = require('electron');

document.querySelectorAll(".view-btn").forEach((button) => {
  button.addEventListener("click", (event) => {
    const recordId = event.target.dataset.id;
    window.electronAPI.findRecord("./renderer/find-record.html", recordId);
  });
});

let delete_id;

document.querySelectorAll(".dlt-btn").forEach((button) => {
  button.addEventListener("click", (event) => {
    delete_id = event.target.dataset.id;
    deleteeeClient(delete_id);
  });
});

async function deleteeeClient(cnic) {
  await window.electronAPI.deleteClient(cnic);
  alert("client deleted");
  window.location.reload();
}

document.querySelectorAll(".edit-btn").forEach((button) => {
  button.addEventListener("click", (event) => {
    const recordId = event.target.dataset.id;
    window.electronAPI.editRecord("./renderer/edit-record.html", recordId);
  });
});
