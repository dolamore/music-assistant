import {app, BrowserWindow} from 'electron';
import path from 'path';
import {fileURLToPath} from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let mainWindow;

app.on('ready', async () => {
    mainWindow = new BrowserWindow({
        width: 1600,
        height: 1100,
        webPreferences: {
            contextIsolation: true,
            nodeIntegration: true,
        },
    });

    // Set the minimum size of the window
    mainWindow.setMinimumSize(1600, 1100);
    // Uncomment the following line to open DevTools
    mainWindow.webContents.openDevTools();

    const indexPath = path.join(__dirname, 'dist', 'index.html');

    await mainWindow.loadFile(indexPath);
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});