const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  openFile: () => ipcRenderer.invoke('open-file'),
  saveFile: (content, path) => ipcRenderer.invoke('save-file', { content, path })
})

// Add this to verify the API is exposed
console.log('API exposed:', window.electronAPI)