import {app, BrowserWindow} from 'electron';
import path from 'path';

let mainWindow;

app.on('ready', async () => {
    mainWindow = new BrowserWindow({
        width: 600,
        height: 800,
        webPreferences: {
            contextIsolation: true,
            nodeIntegration: true,
        },
    });

    // Set the minimum size of the window
    mainWindow.setMinimumSize(600, 800);
    // Uncomment the following line to open DevTools
//    mainWindow.webContents.openDevTools();

    await mainWindow.loadFile(path.join(app.getAppPath(), 'src', 'index.html'));
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});