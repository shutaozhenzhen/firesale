const {
	app,
	BrowserWindow,
	ipcMain,
	dialog
} = require('electron')
const path = require('path')
let windows = new Set()
const createWindows = () => {

	let newWindow = new BrowserWindow({
		show: false,
		webPreferences: {
			preload: path.join(__dirname, "preload.js")
		}
	})


	newWindow.once('ready-to-show', () => {
		newWindow.show()
		newWindow.webContents.openDevTools()
	})
	newWindow.on('close', () => {
		windows.delete(newWindow)
		newWindow = null
	})
	newWindow.loadFile(path.join(__dirname, 'index.html'))
	windows.add(newWindow)


}
app.on('ready', createWindows)


ipcMain.handle('openDialog', (event, args) => {
	return dialog.showOpenDialog(mainWindow, args)
})