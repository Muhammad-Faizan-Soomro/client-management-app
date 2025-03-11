document.getElementById("main-menu").addEventListener("click", () => {
  window.electronAPI.mainMenu("./renderer/index.html");
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
      <input required type="text" name="fieldName" autocomplete="off" class="input">
      <label class="user-label">Enter Detail Label e.g. "Date of Birth"</label>
    </div>
    <div class="form-group">
      <input required type="text" name="fieldValue" autocomplete="off" class="input">
      <label class="user-label">Enter Actual Detail e.g. "16/04/1991"</label>
    </div>
    <button class="remove-field">
      <p class="paragraph"> delete </p>
      <span class="icon-wrapper">
        <svg class="icon" width="30px" height="30px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M6 7V18C6 19.1046 6.89543 20 8 20H16C17.1046 20 18 19.1046 18 18V7M6 7H5M6 7H8M18 7H19M18 7H16M10 11V16M14 11V16M8 7V5C8 3.89543 8.89543 3 10 3H14C15.1046 3 16 3.89543 16 5V7M8 7H16" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
        </svg>
      </span>
    </button>
  `;
  additionalFieldsContainer.appendChild(fieldDiv);

  // Add remove functionality
  fieldDiv.querySelector(".remove-field").addEventListener("click", () => {
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
      await window.electronAPI.saveClient(clientData);

      alert("Client saved successfully!");
      form.reset();
    };
    reader.readAsDataURL(file);
  } else {
    // Save without image
    const clientData = { ...fixedFields, additionalFields, imagePath: null };
    await window.electronAPI.saveClient(clientData);

    alert("Client saved successfully!");
    form.reset();
  }
  additionalFieldsContainer.innerHTML = ""; // Clear dynamic fields
});
