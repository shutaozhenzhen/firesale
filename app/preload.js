const marked = require('marked')
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
			ipcRenderer.invoke('openDialog',{
				'properties': ['openFile']
			}).then((result) => {
				console.log(result)
			})
		}
	}
)
