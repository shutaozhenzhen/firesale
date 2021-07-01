const marked = require('marked')
const fs = require('fs')
const iconv = require('iconv-lite')
const chardet = require('chardet')
const {
	contextBridge,
	ipcRenderer
} = require("electron")

contextBridge.exposeInMainWorld(
	"renderer", {
		'renderMarkdownToHtml': (markdown) => {
			return marked(markdown)
		},
		'openDialog': (markdownView) => {
			ipcRenderer.invoke('openDialog', {
				'properties': ['openFile'],
				'filters': [{
					'name': 'Text Files',
					'extensions': ['txt']
				}, {
					'name': 'Markdown Files',
					'extensions': ['md', 'markdown']
				}, {
					'name': 'All',
					'extensions': ['*']
				}]
			}).then((result) => {
				if (!result.canceled) {
					let path = result.filePaths[0]
					chardet.detectFile(path, {
							sampleSize: 1024
						})
						.then(encoding => {
							fs.readFile(path, (err, data) => {
								if (err) throw err;
								markdownView.value=iconv.decode(data,encoding)
								markdownView.dispatchEvent(new Event('keyup'))
							  })

						})
				}
			})
		}
	}
)