const {
	app,
	BrowserWindow,
	ipcMain,
	dialog
} = require('electron')
const path = require('path')
let windows = new Set()
const createWindows = (curWindows=null) => {
	let options = {
		'show': false,
		'webPreferences': {
			'preload': path.join(__dirname, "preload.js")
		}
	}
	if (curWindows) {
		let [x, y] = curWindows.getPosition()
		options['x'] = x + 10
		options['y'] = y + 10
	}
	let newWindow = new BrowserWindow(options)
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
app.on('ready', () => {
	createWindows()
})
app.on('window-all-closed', () => {
	if (process.platform === 'darwin') {
		return false
	} else {
		app.quit()
	}
})
app.on('activate', (event, hasVisibleWindows) => {
	if (!hasVisibleWindows) {
		createWindows()
	}
})
ipcMain.handle('openDialog', (event, args) => {
	return dialog.showOpenDialog(BrowserWindow.fromWebContents(event.sender), args)
})
ipcMain.on('newFile', (event, args) => {
	createWindows(BrowserWindow.fromWebContents(event.sender))
})
ipcMain.on('renameTitle', (event, filePath) => {
	const title = 'Fire Sale'
	BrowserWindow.fromWebContents(event.sender).setTitle(`${path.basename(filePath)} - ${title}`)
})