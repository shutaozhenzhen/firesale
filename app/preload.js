const marked = require('marked')
const {
	contextBridge
} = require("electron")

contextBridge.exposeInMainWorld(
	"renderer", {
		'renderMarkdownToHtml': (markdown) => {
			return marked(markdown)
		}
	}
)