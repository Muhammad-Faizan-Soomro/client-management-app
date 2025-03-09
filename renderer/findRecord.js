document.getElementById("main-menu").addEventListener("click", () => {
  window.electronAPI.mainMenu("./renderer/index.html");
});

const queryParams = new URLSearchParams(window.location.search);
const recordId = queryParams.get("id");

const searchForm = document.getElementById("search-form");
const clientDetailsDiv = document.getElementById("client-details");
const clientImage = document.getElementById("client-img");

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

// Function to fetch and display client details
async function searchClient(clientId) {
  const client = await window.electronAPI.getClientById(clientId);

  if (client) {
    let additionalDetailName = "";
    let additionalDetailValue = "";
    client.additionalFields.forEach((field) => {
      additionalDetailName += `<div class="item">${field.fieldName}</div>`;
      additionalDetailValue += `<div class="item">${field.fieldValue}</div>`;
    });

    let clientCnic = client.cnic.split("");
    let finalCnic = "";
    for (let i = 0; i < clientCnic.length; i++) {
      if (i === 5 || i === 12) {
        finalCnic += "-";
      }
      finalCnic += clientCnic[i];
    }

    clientDetailsDiv.innerHTML = `
    <div class="card">
      <div class="card__title">Client Details</div>
      <div class="card__data">
        <div class="card__right">
          <div class="item">CNIC</div>
          <div class="item">Name</div>
          <div class="item">Father Name</div>
          <div class="item">Address</div>
          <div class="item">FIR NO</div>
          <div class="item">Date of arresting</div>
          <div class="item">Name of lawyer</div>
          <div class="item">Date of hearing</div>
          <div class="item">Update of last hearing</div>
          ${additionalDetailName}
        </div>
        <div class="card__left">
          <div class="item">${finalCnic}</div>
          <div class="item">${client.name}</div>
          <div class="item">${client.fatherName}</div>
          <div class="item">${client.address}</div>
          <div class="item">${client.firNo}</div>
          <div class="item">${client.dateOfArresting}</div>
          <div class="item">${client.nameOfLawyer}</div>
          <div class="item">${client.dateOfHearing}</div>
          <div class="item">${client.dateOfLastHearing}</div>
          ${additionalDetailValue}
        </div>
      </div>
    </div>
    `;

    if (client.imagePath) {
      clientImage.src = client.imagePath;
      clientImage.style.display = "block";
    } else {
      clientImage.style.display = "none";
    }
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
