document.getElementById("add-new-record").addEventListener("click", () => {
  window.electronAPI.addNewRecord("./renderer/add-record.html");
});

document.getElementById("find-a-record").addEventListener("click", () => {
  window.electronAPI.findRecord("./renderer/find-record.html");
});