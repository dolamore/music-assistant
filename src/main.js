import {app, BrowserWindow} from 'electron';
import path from 'path';

let mainWindow;

app.on('ready', async () => {
    mainWindow = new BrowserWindow({
        width: 400,
        height: 500,
        webPreferences: {
            contextIsolation: true,
            nodeIntegration: true,
        },
    });
    mainWindow.webContents.openDevTools();

    await mainWindow.loadFile(path.join(app.getAppPath(), 'src', 'index.html'));
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});