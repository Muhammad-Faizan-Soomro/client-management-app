const { app, BrowserWindow, Menu, ipcMain } = require("electron/main");
const path = require("node:path");
const fs = require("fs");
const mainUrl = require("url");

const isDev = process.env.NODE_ENV !== "production";
const isMac = process.platform === "darwin";

if (require("electron-squirrel-startup")) app.quit();

function createWindow(file) {
  const win = new BrowserWindow({
    webPreferences: {
      preload: path.join(app.getAppPath(), "./renderer/preload.js"),
      webSecurity: true, // Try disabling it only if necessary
      contextIsolation: true,
      nodeIntegration: true,
    },
    autoHideMenuBar: true,
    title: "CaseFile",
    icon: path.join(app.getAppPath(), "./renderer/icon.ico"),
  });

  win.maximize();

  // if (isDev) {
  //   win.webContents.openDevTools();
  // }

  // win.loadFile(file);
  win.loadURL(file);
  return win;
}

app.whenReady().then(() => {
  const viewUrl = mainUrl.format({
    pathname: path.join(app.getAppPath(), "./renderer/index.html"),
    protocol: "file:",
    slashes: true,
  });
  // const newWindow = createWindow(path.join(app.getAppPath(), url));
  let mainWindow = createWindow(viewUrl);

  ipcMain.on("add-new-record", (event, url) => {
    const viewUrl = mainUrl.format({
      pathname: path.join(app.getAppPath(), url),
      protocol: "file:",
      slashes: true,
    });
    // const newWindow = createWindow(path.join(app.getAppPath(), url));
    const newWindow = createWindow(viewUrl);

    if (mainWindow) {
      mainWindow.close();
      mainWindow = null;
    }

    mainWindow = newWindow;
  });

  ipcMain.on("main-menu", (event, url) => {
    const viewUrl = mainUrl.format({
      pathname: path.join(app.getAppPath(), url),
      protocol: "file:",
      slashes: true,
    });
    // const newWindow = createWindow(path.join(app.getAppPath(), url));
    const newWindow = createWindow(viewUrl);

    if (mainWindow) {
      mainWindow.close();
      mainWindow = null;
    }

    mainWindow = newWindow;
  });

  ipcMain.on("find-a-record", (event, url, cnic = "") => {
    const viewUrl = mainUrl.format({
      pathname: path.join(app.getAppPath(), url),
      protocol: "file:",
      slashes: true,
      query: { id: cnic },
    });
    // const newWindow = createWindow(path.join(app.getAppPath(), url));
    const newWindow = createWindow(viewUrl);

    if (mainWindow) {
      mainWindow.close();
      mainWindow = null;
    }

    mainWindow = newWindow;
  });

  ipcMain.on("delete-a-record", (event, url) => {
    const viewUrl = mainUrl.format({
      pathname: path.join(app.getAppPath(), url),
      protocol: "file:",
      slashes: true,
    });
    // const newWindow = createWindow(path.join(app.getAppPath(), url));
    const newWindow = createWindow(viewUrl);

    if (mainWindow) {
      mainWindow.close();
      mainWindow = null;
    }

    mainWindow = newWindow;
  });

  ipcMain.on("edit-a-record", (event, url, cnic = "") => {
    const viewUrl = mainUrl.format({
      pathname: path.join(app.getAppPath(), url),
      protocol: "file:",
      slashes: true,
      query: { id: cnic },
    });
    // const newWindow = createWindow(path.join(app.getAppPath(), url));
    const newWindow = createWindow(viewUrl);

    if (mainWindow) {
      mainWindow.close();
      mainWindow = null;
    }

    mainWindow = newWindow;
  });

  ipcMain.on("see-all-records", (event, url) => {
    const viewUrl = mainUrl.format({
      pathname: path.join(app.getAppPath(), url),
      protocol: "file:",
      slashes: true,
    });
    // const newWindow = createWindow(path.join(app.getAppPath(), url));
    const newWindow = createWindow(viewUrl);

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

const dataPath = path.join(process.resourcesPath, "clients.json");
const imagesPath = path.join(process.resourcesPath, "client_images");

if (!fs.existsSync(dataPath)) {
  fs.writeFileSync(dataPath, JSON.stringify([]));
}
if (!fs.existsSync(imagesPath)) fs.mkdirSync(imagesPath);

ipcMain.handle("save-client", (event, client) => {
  const data = JSON.parse(fs.readFileSync(dataPath, "utf-8"));
  data.push(client);
  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
});

ipcMain.handle("delete-client", (event, cnic) => {
  let data = JSON.parse(fs.readFileSync(dataPath, "utf-8"));
  const initalLength = data.length;
  data = data.filter((client) => client.cnic != cnic);
  if (initalLength !== data.length) {
    fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
    return 1;
  }
  return 0;
});

ipcMain.handle("edit-client", (event, client) => {
  const { cnic } = client;
  console.log(client);
  const data = JSON.parse(fs.readFileSync(dataPath, "utf-8"));
  const cnicExtract = cnic.split(" ")[1];
  const clientIndex = data.findIndex((client) => client.cnic === cnicExtract);
  if (clientIndex === -1) {
    alert("no client found");
  }
  data[clientIndex].name = client.name;
  data[clientIndex].fatherName = client.fatherName;
  data[clientIndex].address = client.address;
  data[clientIndex].firNo = client.firNo;
  data[clientIndex].dateOfArresting = client.dateOfArresting;
  data[clientIndex].nameOfLawyer = client.nameOfLawyer;
  data[clientIndex].dateOfHearing = client.dateOfHearing;
  data[clientIndex].dateOfLastHearing = client.dateOfLastHearing;
  data[clientIndex].additionalFields = client.additionalFields;
  data[clientIndex].imagePath = client.imagePath;


  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
});

ipcMain.handle("save-client-image", async (event, base64Image) => {
  const imageName = `client_${Date.now()}.png`;
  const imagePath = path.join(imagesPath, imageName);

  // Decode base64 and save image
  const imageBuffer = Buffer.from(base64Image, "base64");
  fs.writeFileSync(imagePath, imageBuffer);

  return imagePath; // Return the saved image name
});

ipcMain.handle("get-client-by-id", (event, id) => {
  const data = JSON.parse(fs.readFileSync(dataPath, "utf-8"));
  return data.find((client) => client.cnic === id) || null;
});

ipcMain.handle("all-data", (event) => {
  const data = JSON.parse(fs.readFileSync(dataPath, "utf-8"));
  return data || null;
});

app.on("window-all-closed", () => {
  if (!isMac) {
    app.quit();
  }
});
