document.getElementById("main-menu").addEventListener("click", () => {
  window.electronAPI.mainMenu("./renderer/index.html");
});

const queryParams = new URLSearchParams(window.location.search);
const recordId = queryParams.get("id");

const searchForm = document.getElementById("search-form");
const clientDetailsDiv = document.getElementById("client-details");
const clientImage = document.getElementById("client-img");
const clientForm = document.getElementById("client-form");


// Add dynamic additional fields

if (recordId) {
  const clientId = document.getElementById("client-id");
  clientId.value = recordId;
  searchClient(recordId); // Execute search immediately
}

searchForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const clientId = document.getElementById("client-id").value;
  searchClient(clientId);
});

async function searchClient(clientId) {
  const client = await window.electronAPI.getClientById(clientId);
  clientForm.innerHTML = null;

  if (client) {
    clientImage.setAttribute("src", client.imagePath);
    clientImage.style.display = "block";
    clientForm.innerHTML = `
      <div class="form-group">
        <input required type="text" name="cnic" autocomplete="off" class="input" value="CNIC: ${client.cnic}" disabled>
      </div>
      <h2>Upload Client Image</h2>
      <input type="file" name="client-image" accept="image/*" id="client-image">
      <div class="form-group">
        <input required type="text" name="name" autocomplete="off" class="input" value=${client.name}>
        <label class="user-label">Name</label>
      </div>
      <div class="form-group">
        <input required type="text" name="fatherName" autocomplete="off" class="input" value=${client.fatherName}>
        <label class="user-label">Father Name</label>
      </div>
      <div class="form-group">
        <input required type="text" name="address" autocomplete="off" class="input" value=${client.address}>
        <label class="user-label">Address</label>
      </div>
      <div class="form-group">
        <input required type="text" name="firNo" autocomplete="off" class="input" value=${client.firNo}>
        <label class="user-label">FIR NO</label>
      </div>
      <div class="form-group">
        <input required type="text" name="dateOfArresting" autocomplete="off" class="input" value=${client.dateOfArresting}>
        <label class="user-label">Date of Arrest</label>
      </div>
      <div class="form-group">
        <input required type="text" name="nameOfLawyer" autocomplete="off" class="input" value=${client.nameOfLawyer}>
        <label class="user-label">Name of Lawyer</label>
      </div>
      <div class="form-group">
        <input required type="text" name="dateOfHearing" autocomplete="off" class="input" value=${client.dateOfHearing}>
        <label class="user-label">Date of Hearing</label>
      </div>
      <div class="form-group">
        <input required type="text" name="dateOfLastHearing" autocomplete="off" class="input" value=${client.dateOfLastHearing}>
        <label class="user-label">Update of Last Hearing</label>
      </div>
      <h2>Additional Details</h2>
      <div id="additional-fields" class="additional-fields"></div>
      <button type="button" id="add-field" class="secondary-button">Add Additional Detail</button>
      <br />
      </div>
      <button type="submit" class="primary-btn">
        <div class="svg-wrapper-1">
          <div class="svg-wrapper">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="30"
              height="30"
              class="icon"
            >
              <path
                d="M22,15.04C22,17.23 20.24,19 18.07,19H5.93C3.76,19 2,17.23 2,15.04C2,13.07 3.43,11.44 5.31,11.14C5.28,11 5.27,10.86 5.27,10.71C5.27,9.33 6.38,8.2 7.76,8.2C8.37,8.2 8.94,8.43 9.37,8.8C10.14,7.05 11.13,5.44 13.91,5.44C17.28,5.44 18.87,8.06 18.87,10.83C18.87,10.94 18.87,11.06 18.86,11.17C20.65,11.54 22,13.13 22,15.04Z"
              ></path>
            </svg>
          </div>
        </div>
        <span>Update Client</span>
      </button>
    `;
    addFields(client.additionalFields);
  } else {
    clientDetailsDiv.innerHTML = `
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

  const fieldDiv = document.createElement("div");

  fieldDiv.innerHTML = `
      ${client.map(
        (field) =>
          `    <div class="form-group">
        <input required type="text" name="${field.fieldName}" autocomplete="off" class="input" value="${field.fieldName}">
        <label class="user-label">Enter Detail Label e.g. "Date of Birth"</label>
      </div>
      <div class="form-group">
        <input required type="text" name="${field.fieldValue}" autocomplete="off" class="input" value="${field.fieldValue}">
        <label class="user-label">Enter Actual Detail e.g. "16/04/1991"</label>
      </div>
      <button type="button" class="remove-field">
        <p class="paragraph"> delete </p>
        <span class="icon-wrapper">
          <svg class="icon" width="30px" height="30px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6 7V18C6 19.1046 6.89543 20 8 20H16C17.1046 20 18 19.1046 18 18V7M6 7H5M6 7H8M18 7H19M18 7H16M10 11V16M14 11V16M8 7V5C8 3.89543 8.89543 3 10 3H14C15.1046 3 16 3.89543 16 5V7M8 7H16" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
          </svg>
        </span>
      </button>`
      )}`;
  additionalFieldsContainer.appendChild(fieldDiv);

  // Add remove functionality
  fieldDiv.querySelector(".remove-field").addEventListener("click", () => {
    additionalFieldsContainer.removeChild(fieldDiv);
  });

  addFieldButton.addEventListener("click", () => {
    const anotherFieldDiv = document.createElement("div");

    anotherFieldDiv.innerHTML = `
          <div class="form-group">
            <input required type="text" name="fieldName" autocomplete="off" class="input">
            <label class="user-label">Enter Detail Label e.g. "Date of Birth"</label>
          </div>
          <div class="form-group">
            <input required type="text" name="fieldValue" autocomplete="off" class="input">
            <label class="user-label">Enter Actual Detail e.g. "16/04/1991"</label>
          </div>
          <button type="button" class="remove-field">
            <p class="paragraph"> delete </p>
            <span class="icon-wrapper">
              <svg class="icon" width="30px" height="30px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6 7V18C6 19.1046 6.89543 20 8 20H16C17.1046 20 18 19.1046 18 18V7M6 7H5M6 7H8M18 7H19M18 7H16M10 11V16M14 11V16M8 7V5C8 3.89543 8.89543 3 10 3H14C15.1046 3 16 3.89543 16 5V7M8 7H16" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
              </svg>
            </span>
          </button>
        `;
    additionalFieldsContainer.appendChild(anotherFieldDiv);

    // Add remove functionality
    anotherFieldDiv
      .querySelector(".remove-field")
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

  const imageSrc = clientImage.getAttribute("src");
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

      alert("Client saved successfully!");
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

    alert("Client saved successfully!");
    form.reset();
  }
  additionalFieldsContainer.innerHTML = ""; // Clear dynamic fields
});
