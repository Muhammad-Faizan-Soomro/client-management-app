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

const queryParams = new URLSearchParams(window.location.search);
const recordId = queryParams.get("id");

const searchForm = document.getElementById("search-form");
const clientDetailsDiv = document.getElementById("client-details");
const clientImage = document.getElementById("client-img");
const clientBasicInfo = document.getElementById("client-basic-info");

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

    // let clientCnic = client.cnic.split("");
    // let finalCnic = "";
    // for (let i = 0; i < clientCnic.length; i++) {
    //   if (i === 5 || i === 12) {
    //     finalCnic += "-";
    //   }
    //   finalCnic += clientCnic[i];
    // }

    clientBasicInfo.innerHTML = `
          <h2 class="client-name">
            <svg class="client-icon" viewBox="0 0 24 24">
              <path
                d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm0 3c1.654 0 3 1.346 3 3s-1.346 3-3 3-3-1.346-3-3 1.346-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" />
            </svg>
            ${client.name}
          </h2>

          <div class="client-meta">
            <svg class="client-icon" viewBox="0 0 24 24">
              <path
                d="M20 4H4c-1.103 0-2 .897-2 2v12c0 1.103.897 2 2 2h16c1.103 0 2-.897 2-2V6c0-1.103-.897-2-2-2zM4 18V6h16l.002 12H4z" />
              <path
                d="M7.5 11h2a2.5 2.5 0 1 0 0-5h-2a2.5 2.5 0 1 0 0 5zm9 5h2a2.5 2.5 0 1 0 0-5h-2a2.5 2.5 0 1 0 0 5zm0-10h2a2.5 2.5 0 1 0 0-5h-2a2.5 2.5 0 1 0 0 5zm-9 5h2a2.5 2.5 0 1 0 0-5h-2a2.5 2.5 0 1 0 0 5z" />
            </svg>
            ${client.cnic}
          </div>
    `;

    clientDetailsDiv.innerHTML = `

  <div class="detail-item">
    <div class="detail-label">
      <svg class="detail-icon" viewBox="0 0 24 24">
        <path
          d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm0 3c1.654 0 3 1.346 3 3s-1.346 3-3 3-3-1.346-3-3 1.346-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" />
      </svg>
      Father Name
    </div>
    <div class="detail-value">${client.fatherName}</div>
  </div>
  
  <div class="detail-item">
    <div class="detail-label">
      <svg class="detail-icon" viewBox="0 0 24 24">
        <path
          d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm0 3c1.654 0 3 1.346 3 3s-1.346 3-3 3-3-1.346-3-3 1.346-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" />
      </svg>
      Address
    </div>
    <div class="detail-value">${client.address}</div>
  </div>
  
  <div class="detail-item">
    <div class="detail-label">
      <svg class="detail-icon" viewBox="0 0 24 24">
        <path
          d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm0 3c1.654 0 3 1.346 3 3s-1.346 3-3 3-3-1.346-3-3 1.346-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" />
      </svg>
      FIR #
    </div>
    <div class="detail-value">${client.firNo}</div>
  </div>
  
  <div class="detail-item">
    <div class="detail-label">
      <svg class="detail-icon" viewBox="0 0 24 24">
        <path
          d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm0 3c1.654 0 3 1.346 3 3s-1.346 3-3 3-3-1.346-3-3 1.346-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" />
      </svg>
      Date of Arresting
    </div>
    <div class="detail-value">${client.dateOfArresting}</div>
  </div>
  
  <div class="detail-item">
    <div class="detail-label">
      <svg class="detail-icon" viewBox="0 0 24 24">
        <path
          d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm0 3c1.654 0 3 1.346 3 3s-1.346 3-3 3-3-1.346-3-3 1.346-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" />
      </svg>
      Lawyer Name
    </div>
    <div class="detail-value">${client.nameOfLawyer}</div>
  </div>
  
  <div class="detail-item">
    <div class="detail-label">
      <svg class="detail-icon" viewBox="0 0 24 24">
        <path
          d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm0 3c1.654 0 3 1.346 3 3s-1.346 3-3 3-3-1.346-3-3 1.346-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" />
      </svg>
      Date of Hearing
    </div>
    <div class="detail-value">${client.dateOfHearing}</div>
  </div>
  
  <div class="detail-item">
    <div class="detail-label">
      <svg class="detail-icon" viewBox="0 0 24 24">
        <path
          d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm0 3c1.654 0 3 1.346 3 3s-1.346 3-3 3-3-1.346-3-3 1.346-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" />
      </svg>
      Update of Last Hearing
    </div>
    <div class="detail-value">${client.dateOfLastHearing}</div>
  </div>

  ${client.additionalFields
    ?.map(
      (data) =>
        `  <div class="detail-item">
    <div class="detail-label">
      <svg class="detail-icon" viewBox="0 0 24 24">
        <path
          d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm0 3c1.654 0 3 1.346 3 3s-1.346 3-3 3-3-1.346-3-3 1.346-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" />
      </svg>
      ${data.fieldName}
    </div>
    <div class="detail-value">${data.fieldValue}</div>
  </div>`
    )
    .join(" ")}
    `;

    if (client.imagePath) {
      clientImage.src = client.imagePath;
      clientImage.style.display = "block";
    } else {
      clientImage.src = "person-dummy.jpg";
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
