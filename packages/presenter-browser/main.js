const { app, BrowserWindow } = require("electron");

function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 720,
    frame: false,
  });
  win.loadURL("http://localhost:8080");
}

app.whenReady().then(() => {
  createWindow();
});
