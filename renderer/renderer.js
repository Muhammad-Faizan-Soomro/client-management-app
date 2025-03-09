document.getElementById("add-new-record").addEventListener("click", () => {
  window.electronAPI.addNewRecord("./renderer/add-record.html");
});

document.getElementById("find-a-record").addEventListener("click", () => {
  window.electronAPI.findRecord("./renderer/find-record.html");
});

document.getElementById("delete-a-record").addEventListener("click", () => {
  window.electronAPI.deleteRecord("./renderer/delete-record.html");
});

document.getElementById("edit-a-record").addEventListener("click", () => {
  window.electronAPI.editRecord("./renderer/edit-record.html");
});

document.getElementById("see-all-records").addEventListener("click", () => {
  window.electronAPI.allRecord("./renderer/all-record.html");
});
