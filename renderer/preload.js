const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  addNewRecord: (url) => ipcRenderer.send("add-new-record", url),
  findRecord: (url) => ipcRenderer.send("find-a-record", url),
  mainMenu: (url) => ipcRenderer.send("main-menu", url),
  saveClient: (client) => ipcRenderer.invoke('save-client', client),
  getClientById: (id) => ipcRenderer.invoke('get-client-by-id', id),
  saveClientImage: (base64Image) => ipcRenderer.invoke('save-client-image', base64Image),
});
