const { app, BrowserWindow } = require("electron");

let mainWindow;

app.whenReady().then(() => {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true, // 백엔드와 연결
    },
  });

  mainWindow.loadURL("http://localhost:3000"); // React UI 연결
});
