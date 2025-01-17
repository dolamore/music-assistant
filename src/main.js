import {app, BrowserWindow} from 'electron';
import path from 'path';

let mainWindow;

app.on('ready', async () => {
    mainWindow = new BrowserWindow({
        width: 600,
        height: 600,
        webPreferences: {
            contextIsolation: true,
            nodeIntegration: true,
        },
    });

    // Uncomment the following line to open DevTools
//    mainWindow.webContents.openDevTools();

    await mainWindow.loadFile(path.join(app.getAppPath(), 'src', 'index.html'));
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});