const {
	app,
	BrowserWindow,
	ipcMain,
	dialog
} = require('electron')
const path = require('path')
let windows = new Set()
const createWindows = () => {
	const cur = BrowserWindow.getFocusedWindow()
	let options = {
		'show': false,
		'webPreferences': {
			'preload': path.join(__dirname, "preload.js")
		}
	}
	if (cur) {
		let [x, y] = cur.getPosition()
		options['x'] = x + 10
		options['y'] = y + 10
	}
	newWindow = new BrowserWindow(options)
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
	return dialog.showOpenDialog(BrowserWindow.fromWebContents(event.sender), args)
})
ipcMain.on('newFile', () => {
	createWindows()
})