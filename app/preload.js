const marked = require('marked')
const fs = require('fs')
const iconv = require('iconv-lite')
const chardet = require('chardet')
const {
	contextBridge,
	ipcRenderer,
	dialog
} = require("electron")

contextBridge.exposeInMainWorld(
	"renderer", {
		'renderMarkdownToHtml': (markdown) => {
			return marked(markdown)
		},
		'openDialog': () => {
			ipcRenderer.invoke('openDialog', {
				'properties': ['openFile']
			}).then((result) => {
				if (!result.canceled) {
					let path=result.filePaths[0]
					chardet.detectFile(path, {
							sampleSize: 1024
						})
						.then(encoding => {
							fs.createReadStream(path)
							.pipe(iconv.decodeStream(encoding))
							.on('data',(d)=>console.log(d))
						})
				}
			})
		},
		'openFile': (path) => {

		}
	}
)