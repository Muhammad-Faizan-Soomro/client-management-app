document.getElementById("main-menu").addEventListener("click", () => {
  window.electronAPI.mainMenu("./renderer/index.html");
});

document
  .querySelectorAll('[name="cnic"]')[0]
  .addEventListener("input", function (e) {
    let value = e.target.value.replace(/\D/g, ""); // Remove non-numeric characters
    if (value.length > 5) value = value.slice(0, 5) + "-" + value.slice(5);
    if (value.length > 13) value = value.slice(0, 13) + "-" + value.slice(13);
    e.target.value = value.slice(0, 15); // Max length 15 including hyphens
  });

const form = document.getElementById("client-form");
const cnic = document.getElementById("cnic");

// Save client data
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const deleteResult = await window.electronAPI.deleteClient(cnic.value);
  // deleteResult ? alert("Client Deleted Successfully.") : alert("Client Doesn't Exist.")
  Toastify({
    text: deleteResult ? "Client Deleted Successfully." : "Client Doesn't Exist.",
    duration: 3000,
    gravity: "top", // or "bottom"
    position: "right", // or "left", "center"
    backgroundColor: deleteResult ? "green" : "red",
  }).showToast();
  
  form.reset();
});
