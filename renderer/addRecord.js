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

document
  .querySelectorAll('[name="firNo"]')[0]
  .addEventListener("input", function (e) {
    e.target.value = e.target.value.replace(/[^0-9/]/g, "");
  });

document
  .querySelectorAll('[name="name"]')[0]
  .addEventListener("input", function (e) {
    e.target.value = e.target.value.replace(/[^A-Za-z '-]/g, ""); // Remove any number or special character
  });

document
  .querySelectorAll('[name="nameOfLawyer"]')[0]
  .addEventListener("input", function (e) {
    e.target.value = e.target.value.replace(/[^A-Za-z '-]/g, ""); // Remove any number or special character
  });

document
  .querySelectorAll('[name="fatherName"]')[0]
  .addEventListener("input", function (e) {
    e.target.value = e.target.value.replace(/[^A-Za-z '-]/g, ""); // Remove any number or special character
  });

document
  .querySelectorAll('[name="address"]')[0]
  .addEventListener("input", function (e) {
    e.target.value = e.target.value.replace(/[^A-Za-z0-9#\-\s\/]/g, "");
  });

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("client-form");
  const inputs = form.querySelectorAll(".input-field");

  // Handle form submission
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    let isValid = true;

    inputs.forEach((input) => {
      if (!input.checkValidity()) {
        input.classList.add("touched");
        isValid = false;
      }
    });
  });

  // Handle input events
  inputs.forEach((input) => {
    input.addEventListener("input", () => {
      input.classList.add("touched");
      const error = input.parentElement.querySelector(".error-message");
      error.style.display = input.checkValidity() ? "none" : "block";
    });
  });

  // Image preview functionality
  document
    .getElementById("client-image")
    .addEventListener("change", function (e) {
      const preview = document.getElementById("image-preview");
      const removeBtn = document.getElementById("remove-image-btn");
      const file = e.target.files[0];
      if (file) {
        preview.style.display = "block";
        removeBtn.classList.add("visible");
        preview.src = URL.createObjectURL(file);
      }
    });

  document
    .getElementById("remove-image-btn")
    .addEventListener("click", function () {
      const preview = document.getElementById("image-preview");
      const fileInput = document.getElementById("client-image");
      const removeBtn = document.getElementById("remove-image-btn");

      preview.style.display = "none";
      preview.src = "";
      fileInput.value = "";
      removeBtn.classList.remove("visible");
    });
});

const form = document.getElementById("client-form");
const additionalFieldsContainer = document.getElementById("additional-fields");
const addFieldButton = document.getElementById("add-field");
const imageInput = document.getElementById("client-image");

// Add dynamic additional fields
addFieldButton.addEventListener("click", () => {
  const fieldDiv = document.createElement("div");
  fieldDiv.innerHTML = `
    <div class="form-group">
      <label class="input-label" for="fieldName">Enter Detail Label</label>
      <input required type="text" name="fieldName" autocomplete="off" class="input-field" placeholder="Date of Birth">
      <div class="error-message">This field is required</div>
    </div>
    <div class="form-group">
      <label class="input-label" for="fieldValue">Enter Actual Detail</label>
      <input required type="text" name="fieldValue" autocomplete="off" class="input-field" placeholder="16/04/1991">
      <div class="error-message">This field is required</div>
    </div>
    <button class="btn-delete">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <path d="M5 20a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8h2V6h-4V4a2 2 0 0 0-2-2H9a2 2 0 0 0-2 2v2H3v2h2zM9 4h6v2H9zM8 8h9v12H7V8z"/>
          <path d="M9 10h2v8H9zm4 0h2v8h-2z"/>
      </svg>
      <span>Delete Field</span>
    </button>
  `;
  additionalFieldsContainer.appendChild(fieldDiv);

  // Add remove functionality
  fieldDiv.querySelector(".btn-delete").addEventListener("click", () => {
    additionalFieldsContainer.removeChild(fieldDiv);
  });
});

// Save client data
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const fixedFields = {};
  const additionalFields = [];

  // Collect fixed fields
  const fixedInputs = form.querySelectorAll(
    'input[name]:not([name="fieldName"]):not([name="fieldValue"])'
  );
  fixedInputs.forEach((input) => {
    if (input.name != "client-image") {
      fixedFields[input.name] = input.value;
    }
  });

  // Collect additional fields
  const fieldNames = form.querySelectorAll('input[name="fieldName"]');
  const fieldValues = form.querySelectorAll('input[name="fieldValue"]');
  fieldNames.forEach((field, index) => {
    additionalFields.push({
      fieldName: field.value,
      fieldValue: fieldValues[index].value,
    });
  });

  // Handle image upload
  let imageName = null;
  if (imageInput.files.length > 0) {
    const file = imageInput.files[0];
    const reader = new FileReader();
    reader.onload = async () => {
      const base64Image = reader.result.split(",")[1]; // Extract base64 data
      imageName = await window.electronAPI.saveClientImage(base64Image);

      // Save client data
      const clientData = {
        ...fixedFields,
        additionalFields,
        imagePath: `${imageName}`,
      };
      const savedClient = await window.electronAPI.saveClient(clientData);

      if (savedClient) {
        alert("Client saved successfully!");
      } else {
        alert("Client/Fir # already exist!");
      }
      form.reset();
      document.getElementById("image-preview").src = "";
      document.getElementById("image-preview").style.display = "none";
    };
    reader.readAsDataURL(file);
  } else {
    // Save without image
    const clientData = { ...fixedFields, additionalFields, imagePath: null };
    const savedClient = await window.electronAPI.saveClient(clientData);

    if (savedClient) {
      alert("Client saved successfully!");
    } else {
      alert("Client/Fir # already exist!");
    }
    form.reset();
  }
  additionalFieldsContainer.innerHTML = "";
  const removeBtn = document.getElementById("remove-image-btn");
  removeBtn.classList.remove("visible");
  // Clear dynamic fields
});
