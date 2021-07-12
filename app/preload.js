const marked = require('marked')
const fs = require('fs')
const iconv = require('iconv-lite')
const chardet = require('chardet')
const {
	contextBridge,
	ipcRenderer
} = require("electron")
let fileInfo={
	'path':null,
	'encoding':null,
	'content':null//todo 自动检测大小，大于一定大小转为保存到磁盘
}
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
					fileInfo['path'] = result.filePaths[0]
					chardet.detectFile(fileInfo['path'], {
							sampleSize: 1024
						})
						.then(encoding => {
							fileInfo['encoding']=encoding
							
							fs.readFile(fileInfo['path'], (err, data) => {
								if (err) throw err;
								fileInfo['content']=iconv.decode(data, fileInfo['encoding'])
								markdownView.value = fileInfo['content']
								markdownView.dispatchEvent(new Event('keyup'))
								console.log(fileInfo)
							})

						})
				}
			})
		},
		'newFile':()=>{
			ipcRenderer.send('newFile')
		}
	}
)