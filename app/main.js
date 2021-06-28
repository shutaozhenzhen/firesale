const {
	app,
	BrowserWindow,
	ipcMain
} = require('electron')
const path = require('path')
let mainWindow = null
app.on('ready', () => {
	mainWindow = new BrowserWindow({
		webPreferences: {
			preload: path.join(__dirname, "preload.js")
		}
	})
	//mainWindow.webContents.openDevTools()
	mainWindow.webContents.loadFile(path.join(__dirname,'index.html'))
	mainWindow.on('close',()=>{
		mainWindow = null
	})
})