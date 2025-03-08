const { app, BrowserWindow, Menu, ipcMain } = require("electron/main");
const path = require("node:path");
const fs = require('fs')

const isDev = process.env.NODE_ENV !== "production";
const isMac = process.platform === "darwin";

if (require('electron-squirrel-startup')) app.quit();

function createWindow(file) {
  const win = new BrowserWindow({
    webPreferences: {
      preload: path.join(app.getAppPath(), "./renderer/preload.js"),
      contextIsolation: true,
    },
    autoHideMenuBar: true,
    title: "CaseFile",
    icon: path.join(app.getAppPath(), "./renderer/icon.ico"),
  });

  win.maximize();

  // if (isDev) {
  //   win.webContents.openDevTools();
  // }

  win.loadFile(file);
  return win;
}

app.whenReady().then(() => {
  let mainWindow = createWindow(path.join(app.getAppPath(), "./renderer/index.html"));

  ipcMain.on("add-new-record", (event, url) => {
    const newWindow = createWindow(path.join(app.getAppPath(), url));

    if (mainWindow) {
      mainWindow.close();
      mainWindow = null;
    }

    mainWindow = newWindow;
  });

  ipcMain.on("main-menu", (event, url) => {
    const newWindow = createWindow(path.join(app.getAppPath(), url));

    if (mainWindow) {
      mainWindow.close();
      mainWindow = null;
    }

    mainWindow = newWindow;
  });

  ipcMain.on("find-a-record", (event, url) => {
    const newWindow = createWindow(path.join(app.getAppPath(), url));

    if (mainWindow) {
      mainWindow.close();
      mainWindow = null;
    }

    mainWindow = newWindow;
  });

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

const dataPath = path.join(process.resourcesPath, 'clients.json');
const imagesPath = path.join(process.resourcesPath, 'client_images');

if (!fs.existsSync(dataPath)) {
  fs.writeFileSync(dataPath, JSON.stringify([]));
}
if (!fs.existsSync(imagesPath)) fs.mkdirSync(imagesPath);

ipcMain.handle('save-client', (event, client) => {
  const data = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
  data.push(client);
  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
});


ipcMain.handle('save-client-image', async (event, base64Image) => {
  const imageName = `client_${Date.now()}.png`;
  const imagePath = path.join(imagesPath, imageName);
  console.log(imagePath)

  // Decode base64 and save image
  const imageBuffer = Buffer.from(base64Image, 'base64');
  fs.writeFileSync(imagePath, imageBuffer);

  return imagePath; // Return the saved image name
});

ipcMain.handle('get-client-by-id', (event, id) => {
  const data = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
  return data.find((client) => client.cnic === id) || null;
});

app.on("window-all-closed", () => {
  if (!isMac) {
    app.quit();
  }
});
