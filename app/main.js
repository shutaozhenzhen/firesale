const {
	app,
	BrowserWindow,
	ipcMain,
	dialog
} = require('electron')
const path = require('path')
let mainWindow = null
app.on('ready', () => {
	mainWindow = new BrowserWindow({
		show: false,
		webPreferences: {
			preload: path.join(__dirname, "preload.js")
		}
	})


	mainWindow.once('ready-to-show', () => {
		mainWindow.show()
		mainWindow.webContents.openDevTools()
	})
	mainWindow.on('close', () => {
		mainWindow = null
	})
	mainWindow.loadFile(path.join(__dirname, 'index.html'))

})


ipcMain.handle('openDialog', (event, args) => {
	return dialog.showOpenDialog(mainWindow,args)
})