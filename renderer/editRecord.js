document.getElementById("main-menu").addEventListener("click", () => {
  window.electronAPI.mainMenu("./renderer/index.html");
});

const queryParams = new URLSearchParams(window.location.search);
const recordId = queryParams.get("id");

const searchForm = document.getElementById("search-form");
const clientDetailsDiv = document.getElementById("client-details");
const clientImage = document.getElementById("client-img");
const clientForm = document.getElementById("client-form");

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

  if (client) {

    clientForm.innerHTML = `
    <div class="form-group">
        <input required type="text" name="cnic" autocomplete="off" class="input" value=${client.cnic} disabled>
        <label class="user-label">CNIC</label>
      </div>
      <div class="form-group">
        <input required type="text" name="name" autocomplete="off" class="input" value=${client.name}>
        <label class="user-label">Name</label>
      </div>
      <div class="form-group">
        <input required type="text" name="fatherName" autocomplete="off" class="input" value=${client.fatherName}>
        <label class="user-label">Father Name</label>
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

// Save client data
clientForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const fixedFields = {};
  const additionalFields = [];

  // Collect fixed fields
  const fixedInputs = clientForm.querySelectorAll(
    'input[name]:not([name="fieldName"]):not([name="fieldValue"])'
  );
  fixedInputs.forEach((input) => {
    fixedFields[input.name] = input.value;
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

  //   // Handle image upload
  //   let imageName = null;
  //   if (imageInput.files.length > 0) {
  //     const file = imageInput.files[0];
  //     const reader = new FileReader();
  //     reader.onload = async () => {
  //       const base64Image = reader.result.split(",")[1]; // Extract base64 data
  //       imageName = await window.electronAPI.saveClientImage(base64Image);

  //       // Save client data
  //       const clientData = {
  //         ...fixedFields,
  //         additionalFields,
  //         imagePath: `${imageName}`,
  //       };
  //       await window.electronAPI.saveClient(clientData);

  //       alert("Client saved successfully!");
  //       clientForm.reset();
  //     };
  //     reader.readAsDataURL(file);
  //   } else {
  // Save without image
  const clientData = { ...fixedFields, additionalFields, imagePath: null };
  await window.electronAPI.editClient(clientData);

  alert("Client edit successfully!");
  clientForm.reset();
  additionalFieldsContainer.innerHTML = ""; // Clear dynamic fields
});
