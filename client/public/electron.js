const { app, BrowserWindow, Menu } = require('electron'),
    path = require('path'),
    isDev = require('electron-is-dev')

function createMainWindow() {
    const mainWindow = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true
        }
    })

    mainWindow.loadURL(isDev ? 'http://localhost:3000' : `file://${path.join(__dirname, '../build/index.html')}`)

    const mainMenu = Menu.buildFromTemplate(mainMenuTemplate)
    Menu.setApplicationMenu(mainMenu)

    mainWindow.on('closed', () => app.quit())

    const { default: installExtension, REACT_DEVELOPER_TOOLS } = require('electron-devtools-installer')
    installExtension(REACT_DEVELOPER_TOOLS).then((name) => {
        console.log(`Added extension: ${name}`)
    }).catch((err) => console.log(err))
}

app.whenReady().then(createMainWindow)

const mainMenuTemplate = [
    {
        label: 'File',
        submenu: [
            {
                label: 'Quit',
                accelerator: process.platform == 'darwin' ? 'Command+W' : 'Ctrl+W',
                click() { app.quit() }
            }
        ]
    },
    {
        label: 'Developer Tools',
        submenu: [
            {
                label: 'Toggle DevTools',
                accelerator: process.platform == 'darwin' ? 'Command+I' : 'Ctrl+I',
                click(item, focusedWindow) { focusedWindow.toggleDevTools() }
            },
            {
                role: 'reload'
            }
        ]
    }
]

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    if (win === null) {
        createWindow()
    }
})