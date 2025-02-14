const {
  app,
  BrowserWindow,
  desktopCapturer,
  dialog,
  Menu,
  MenuItem,
  session,
} = require("electron");
const prompt = require("electron-prompt");

let window = null;

function openWindow(port = 8080) {
  if (window === null) {
    window = new BrowserWindow({
      width: 1280,
      height: 720,
      frame: false,
    });
  }
  window.loadURL(`http://localhost:${port}`);
}

app.whenReady().then(() => {
  // Set up menu items.
  const menu = Menu.getApplicationMenu();
  const fileMenu = menu.items.find((item) => item.label === "File");
  if (fileMenu) {
    fileMenu.submenu.insert(
      0,
      new MenuItem({
        label: "New Item",
        accelerator: "Shift+CmdOrCtrl+P",
        click: async () => {
          const port = await prompt({
            title: "Connect to Port",
            label: "Port:",
            value: "8080",
            inputAttrs: {
              type: "text",
            },
            type: "input",
          });
          if (port === null) {
            return;
          }
          openWindow(port);
        },
      }),
    );
  }
  Menu.setApplicationMenu(menu);

  /**
   * Set up the display media request handler.
   * This allows the Electron app to respond to requests for sharing screen:
   * https://www.electronjs.org/docs/latest/api/session#sessetdisplaymediarequesthandlerhandler-opts
   *
   * Required to enable correct behavior of the ScreenCapture object in Presenter.js.
   */
  session.defaultSession.setDisplayMediaRequestHandler(
    (request, callback) => {
      desktopCapturer
        .getSources({ types: ["window", "screen"] })
        .then((sources) => {
          // Grant access to the first source found.
          callback({ video: sources[0] });
        });
    },
    { useSystemPicker: true },
  );

  openWindow();
});
