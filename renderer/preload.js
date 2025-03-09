const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  addNewRecord: (url) => ipcRenderer.send("add-new-record", url),
  findRecord: (url) => ipcRenderer.send("find-a-record", url),
  deleteRecord: (url) => ipcRenderer.send("delete-a-record", url),
  mainMenu: (url) => ipcRenderer.send("main-menu", url),
  editRecord: (url) => ipcRenderer.send("edit-a-record", url),
  allRecord: (url) => ipcRenderer.send("see-all-records", url),

  // METHODS BELOW : URL ABOVE
  saveClient: (client) => ipcRenderer.invoke("save-client", client),
  getClientById: (id) => ipcRenderer.invoke("get-client-by-id", id),
  saveClientImage: (base64Image) =>
    ipcRenderer.invoke("save-client-image", base64Image),
  deleteClient: (cnic) => ipcRenderer.invoke("delete-client", cnic),
  editClient: (client) => ipcRenderer.invoke("edit-client", client),
});
