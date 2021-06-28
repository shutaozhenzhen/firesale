const {
	app,
	BrowserWindow,
	ipcMain
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
	//mainWindow.webContents.openDevTools()

	mainWindow.once('ready-to-show', () => {
		mainWindow.show()
	})
	mainWindow.on('close', () => {
		mainWindow = null
	})
	mainWindow.loadFile(path.join(__dirname, 'index.html'))

})