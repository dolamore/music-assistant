import {app, BrowserWindow} from 'electron';
import path from 'path';

let mainWindow;

app.on('ready', async () => {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 1000,
        webPreferences: {
            contextIsolation: true,
            nodeIntegration: true,
        },
    });

    // Set the minimum size of the window
    mainWindow.setMinimumSize(800, 1000);
    // Uncomment the following line to open DevTools
    mainWindow.webContents.openDevTools();

    await mainWindow.loadFile(path.join(app.getAppPath(), 'src', 'index.html'));
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});