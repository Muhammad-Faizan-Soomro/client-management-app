document.getElementById("main-menu").addEventListener("click", () => {
  window.electronAPI.mainMenu("./renderer/index.html");
});

const form = document.getElementById("client-form");
const cnic = document.getElementById("cnic");

// Save client data
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const deleteResult = await window.electronAPI.deleteClient(cnic.value);
  deleteResult ? alert("Client Deleted Successfully.") : alert("Client Doesn't Exist.")
  form.reset();
});
