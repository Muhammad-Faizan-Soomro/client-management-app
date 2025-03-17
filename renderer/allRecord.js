document.getElementById("main-menu").addEventListener("click", () => {
  window.electronAPI.mainMenu("./renderer/index.html");
});

const clientDetailsDiv = document.getElementById("records-list");
const data = await window.electronAPI.allData();

if (data.length == 0) {
  clientDetailsDiv.innerHTML =
    '<div class="no-records">No Records Available</div>';
} else {
  clientDetailsDiv.innerHTML = `
${data
  .map(
    (item, index) =>
      `
            <div class="record-card">
                <div class="record-info">
                    <div class="record-number">[${index + 1}]</div>
                    <div class="record-details">
                        <div>CNIC: ${item.cnic}</div>
                        <div>Name: ${item.name}</div>
                    </div>
                </div>
                <div class="record-actions">
                    <button class="btn btn-view" data-id="${
                      item.cnic
                    }">View Full Record</button>
                    <button class="btn btn-edit" data-id="${
                      item.cnic
                    }">Edit Record</button>
                    <button class="btn btn-delete" data-id="${
                      item.cnic
                    }">Delete Record</button>
                </div>
            </div>`
  )
  .join(" ")}
`;
}

document.querySelectorAll(".btn-view").forEach((button) => {
  button.addEventListener("click", (event) => {
    const recordId = event.target.dataset.id;
    window.electronAPI.findRecord("./renderer/find-record.html", recordId);
  });
});

let delete_id;

document.querySelectorAll(".btn-delete").forEach((button) => {
  button.addEventListener("click", (event) => {
    delete_id = event.target.dataset.id;
    deleteeeClient(delete_id);
  });
});

async function deleteeeClient(cnic) {
  await window.electronAPI.deleteClient(cnic);
  Toastify({
    text: "Client Deleted Successfully",
    duration: 3000,
    gravity: "top", // or "bottom"
    position: "right", // or "left", "center"
    backgroundColor: "green",
  }).showToast();
  window.location.reload();
}

document.querySelectorAll(".btn-edit").forEach((button) => {
  button.addEventListener("click", (event) => {
    const recordId = event.target.dataset.id;
    window.electronAPI.editRecord("./renderer/edit-record.html", recordId);
  });
});
