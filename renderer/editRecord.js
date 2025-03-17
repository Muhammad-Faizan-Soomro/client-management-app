document.getElementById("main-menu").addEventListener("click", () => {
  window.electronAPI.mainMenu("./renderer/index.html");
});

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("client-form");

  // Handle form submission
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    let isValid = true;
    const inputs = form.querySelectorAll(".input-field"); // Re-fetch dynamically added inputs

    inputs.forEach((input) => {
      if (input.name === "firNo") return; // Skip validation for firNo field

      if (!input.checkValidity()) {
        input.classList.add("touched");
        isValid = false;
      }
    });
  });

  // Handle input validation using event delegation (excluding firNo)
  document.addEventListener("input", (e) => {
    if (
      e.target.classList.contains("input-field") &&
      e.target.name !== "firNo"
    ) {
      e.target.classList.add("touched");
      const error = e.target
        .closest(".form-group")
        ?.querySelector(".error-message");
      if (error) {
        error.style.display = e.target.checkValidity() ? "none" : "block";
      }
    }
  });

  // Handle image preview using event delegation
  document.addEventListener("change", (e) => {
    if (e.target.id === "client-image") {
      const preview = document.getElementById("image-preview");
      const div = document.getElementsByClassName("no-records")[0];
      const file = e.target.files[0];
      const removeBtn = document.getElementById("remove-image-btn");

      if (file) {
        preview.style.display = "block";
        div.style.display = "none";
        removeBtn.classList.add("visible");
        preview.src = URL.createObjectURL(file);
      }
    }
  });
  document.addEventListener("click", (e) => {
    if (e.target.id === "remove-image-btn") {
      const preview = document.getElementById("image-preview");
      const fileInput = document.getElementById("client-image");
      const removeBtn = document.getElementById("remove-image-btn");
      const div = document.getElementsByClassName("no-records")[0];

      preview.style.display = "none";
      preview.src = "";
      fileInput.value = "";
      removeBtn.classList.remove("visible");
      div.style.display = "block";
    }
  });
});

document.addEventListener("input", function (e) {
  // Check if the event is triggered by an input with name="firNo"
  if (e.target.matches('[name="firNo"]')) {
    const firInput = e.target;
    const formGroup = firInput.closest(".form-group");
    const errorMessage = formGroup
      ? formGroup.querySelector(".error-message")
      : null;

    // Allow only numbers and '/'
    firInput.value = firInput.value.replace(/[^0-9/]/g, "");

    // Validate pattern
    const pattern = /^\d{1,5}\/\d{4}$/;
    if (errorMessage) {
      if (!pattern.test(firInput.value) && firInput.value.length > 0) {
        errorMessage.style.display = "block"; // Show error message
      } else {
        errorMessage.style.display = "none"; // Hide error message
      }
    }
  }
});

document
  .querySelectorAll('[name="cnic"]')[0]
  .addEventListener("input", function (e) {
    let value = e.target.value.replace(/\D/g, ""); // Remove non-numeric characters
    if (value.length > 5) value = value.slice(0, 5) + "-" + value.slice(5);
    if (value.length > 13) value = value.slice(0, 13) + "-" + value.slice(13);
    e.target.value = value.slice(0, 15); // Max length 15 including hyphens
  });

const queryParams = new URLSearchParams(window.location.search);
const recordId = queryParams.get("id");

const clientDetailsDiv = document.getElementById("client-details");
const clientImage = document.getElementById("client-img");
const clientForm = document.getElementById("client-form");

document
  .getElementById("client-id")
  .addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      // Check if Enter key is pressed
      event.preventDefault(); // Prevent default form submission (if any)
      const inputValue = this.value.trim(); // Get input value
      if (inputValue) {
        searchClient(inputValue);
      }
    }
  });

if (recordId) {
  const clientId = document.getElementById("client-id");
  clientId.value = recordId;
  searchClient(recordId); // Execute search immediately
}

async function searchClient(clientId) {
  const client = await window.electronAPI.getClientById(clientId);
  clientForm.innerHTML = null;

  if (client) {
    // clientImage.setAttribute("src", client.imagePath);
    // clientImage.style.display = "block";
    clientForm.innerHTML = `
      <div class="upload-section">
        <input type="file" id="client-image" class="file-input" accept="image/*">
        <label for="client-image" class="file-label">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
            <circle cx="12" cy="13" r="4" />
          </svg>
          <span>Update Client Image</span>
        </label>
      </div>
      <div class="client-image-container">
        ${
          client.imagePath
            ? `
        <img src="${client.imagePath}" class="preview-image" id="image-preview" style="display: block;">`
            : `<img src="" class="preview-image" id="image-preview" style="display: none;">
            <div class="no-records">No Image Found</div>
            `
        }  
        <div class="no-records" style="display: none;">No Image Found</div>      
        <button type="button" class="remove-image-btn visible" id="remove-image-btn" title="Remove image">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
            <path
              d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
          </svg>
        </button>
      </div>

      <hr class="divider">
      <div class="form-section">
          <h2 class="section-title">Client Details</h2>

          <div class="form-group">
              <label class="input-label" for="cnic">CNIC Number</label>
              <input required type="text" name="cnic" autocomplete="off" class="input-field"
                  pattern="^\d{5}-\d{7}-\d{1}$" disabled value="${client.cnic}">
          </div>

          <div class="form-group">
              <label class="input-label" for="name">Full Name</label>
              <input required type="text" name="name" autocomplete="off" class="input-field" maxlength="50"
                  minlength="3" placeholder="Enter full name" value="${
                    client.name
                  }">
              <div class="error-message">Please enter a valid name (min 3 characters)</div>
          </div>

          <div class="form-group">
              <label class="input-label" for="fatherName">Father's Name</label>
              <input required type="text" name="fatherName" autocomplete="off" class="input-field" maxlength="50"
                  minlength="3" placeholder="Enter father name" value="${
                    client.fatherName
                  }">
              <div class="error-message">Please enter father's name (min 3 characters)</div>
          </div>

          <div class="form-group">
              <label class="input-label" for="address">Address</label>
              <input required type="text" name="address" autocomplete="off" class="input-field"
                  pattern="^[A-Za-z0-9#\-\s\/]+$" maxlength="100" placeholder="Enter address" value="${
                    client.address
                  }">
              <div class="error-message">Please enter a valid address</div>
          </div>

          <div class="form-group">
              <label class="input-label" for="firNo">FIR #</label>
              <input required type="text" name="firNo" autocomplete="off" class="input-field"
                  placeholder="Enter FIR Number" inputmode="numeric" value="${
                    client.firNo
                  }">
              <div class="error-message">Invalid fir number format (XXX/YYYY)</div>
              <div class="example-text">Example: 123/2024</div>
          </div>

          <div class="form-group">
              <label class="input-label" for="dateOfArresting">Date of Arresting</label>
              <input required type="date" name="dateOfArresting" autocomplete="off" class="input-field" value="${
                client.dateOfArresting
              }">
          </div>

          <div class="form-group">
              <label class="input-label" for="nameOfLawyer">Lawyer Name</label>
              <input required type="text" name="nameOfLawyer" autocomplete="off" class="input-field"
                  maxlength="50" minlength="3" placeholder="Enter lawyer name" value="${
                    client.nameOfLawyer
                  }">
              <div class="error-message">Please enter a valid lawyer's name (min 3 characters)</div>

          </div>
          <div class="form-group">
              <label class="input-label" for="dateOfHearing">Date of Hearing</label>
              <input required type="date" name="dateOfHearing" autocomplete="off" class="input-field" value="${
                client.dateOfHearing
              }">
          </div>

          <div class="form-group">
              <label class="input-label" for="dateOfLastHearing">Update of Last Hearing</label>
              <input required type="text" name="dateOfLastHearing" autocomplete="off" class="input-field"
                  placeholder="Enter Update of Last Hearing" value="${
                    client.dateOfLastHearing
                  }">
          </div>
      </div>

      <hr class="divider">
      <div class="dynamic-section">
          <h2 class="section-title">Additional Details</h2>

          <div id="additional-fields">
          
          </div>

          <button type="button" class="add-button" id="add-field">
              + Add Additional Detail
          </button>
      </div>    

      <button type="submit" class="save-button">Save Client</button>
    `;

    addFields(client.additionalFields);

    const element = document.getElementById("remove-image-btn");
    element.classList.toggle("visible", !!client.imagePath);

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
  } else {
    clientForm.innerHTML = `
    <div class="error">
        <div class="error__icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" viewBox="0 0 24 24" height="24" fill="none">
              <path fill="#393a37" d="m13 13h-2v-6h2zm0 4h-2v-2h2zm-1-15c-1.3132 0-2.61358.25866-3.82683.7612-1.21326.50255-2.31565 1.23915-3.24424 2.16773-1.87536 1.87537-2.92893 4.41891-2.92893 7.07107 0 2.6522 1.05357 5.1957 2.92893 7.0711.92859.9286 2.03098 1.6651 3.24424 2.1677 1.21325.5025 2.51363.7612 3.82683.7612 2.6522 0 5.1957-1.0536 7.0711-2.9289 1.8753-1.8754 2.9289-4.4189 2.9289-7.0711 0-1.3132-.2587-2.61358-.7612-3.82683-.5026-1.21326-1.2391-2.31565-2.1677-3.24424-.9286-.92858-2.031-1.66518-3.2443-2.16773-1.2132-.50254-2.5136-.7612-3.8268-.7612z"></path>
            </svg>
        </div>
        <div class="error__title">Client Not Found!</div>
    </div>
    `;
    clientImage.style.display = "none";
  }
}

function addFields(client) {
  const additionalFieldsContainer =
    document.getElementById("additional-fields");

  const addFieldButton = document.getElementById("add-field");

  for (let i = 0; i < client.length; i++) {
    const fieldDiv = document.createElement("div");

    fieldDiv.innerHTML = `
    <div class="form-group">
      <label class="input-label" for="fieldName">Enter Detail Label</label>
      <input required type="text" name="fieldName" autocomplete="off" class="input-field" placeholder="Date of Birth" value="${client[i].fieldName}">
      <div class="error-message">This field is required</div>
    </div>
    <div class="form-group">
      <label class="input-label" for="fieldValue">Enter Actual Detail</label>
      <input required type="text" name="fieldValue" autocomplete="off" class="input-field" placeholder="16/04/1991" value="${client[i].fieldValue}">
      <div class="error-message">This field is required</div>
    </div>
    <button type="button" class="btn-delete">
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
  }

  addFieldButton.addEventListener("click", () => {
    const anotherFieldDiv = document.createElement("div");

    anotherFieldDiv.innerHTML = `
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
    <button type="button" class="btn-delete">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <path d="M5 20a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8h2V6h-4V4a2 2 0 0 0-2-2H9a2 2 0 0 0-2 2v2H3v2h2zM9 4h6v2H9zM8 8h9v12H7V8z"/>
          <path d="M9 10h2v8H9zm4 0h2v8h-2z"/>
      </svg>
      <span>Delete Field</span>
    </button>
        `;
    additionalFieldsContainer.appendChild(anotherFieldDiv);

    // Add remove functionality
    anotherFieldDiv
      .querySelector(".btn-delete")
      .addEventListener("click", () => {
        additionalFieldsContainer.removeChild(anotherFieldDiv);
      });
  });
}

// Save client data
clientForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const additionalFieldsContainer =
    document.getElementById("additional-fields");

  const imageSrc = document.getElementById("client-image").getAttribute("src");
  const imageInput = document.getElementById("client-image");

  const fixedFields = {};
  const additionalFields = [];

  // Collect fixed fields
  const fixedInputs = clientForm.querySelectorAll(
    'input[name]:not([name="fieldName"]):not([name="fieldValue"])'
  );
  fixedInputs.forEach((input) => {
    if (input.name != "client-image") {
      fixedFields[input.name] = input.value;
    }
  });

  // Collect additional fields
  const fieldNames = clientForm.querySelectorAll('input[name="fieldName"]');
  const fieldValues = clientForm.querySelectorAll('input[name="fieldValue"]');
  fieldNames.forEach((field, index) => {
    additionalFields.push({
      fieldName: field.value,
      fieldValue: fieldValues[index].value,
    });
  });

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
      await window.electronAPI.editClient(clientData);

      Toastify({
        text: "Client Edited Successfully.",
        duration: 3000,
        gravity: "top", // or "bottom"
        position: "right", // or "left", "center"
        backgroundColor: "green",
      }).showToast();

      form.reset();
    };
    reader.readAsDataURL(file);
  } else {
    // Save without image
    const clientData = {
      ...fixedFields,
      additionalFields,
      imagePath: imageSrc,
    };
    await window.electronAPI.editClient(clientData);

    Toastify({
      text: "Client Edited Successfully.",
      duration: 3000,
      gravity: "top", // or "bottom"
      position: "right", // or "left", "center"
      backgroundColor: "green",
    }).showToast();
    form.reset();
  }
  additionalFieldsContainer.innerHTML = ""; // Clear dynamic fields
});
