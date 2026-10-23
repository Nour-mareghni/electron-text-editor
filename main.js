const { app, BrowserWindow, ipcMain, dialog } = require('electron')
const fs = require('fs')
const path = require('path')

let mainWindow

function createWindow() {
    mainWindow = new BrowserWindow({
      width: 800,
      height: 600,
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
        preload: path.join(__dirname, 'preload.js')
      }
    })
  
    mainWindow.loadFile('index.html')
    
    // Open DevTools automatically for debugging
    mainWindow.webContents.openDevTools()

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

// Handle file operations
ipcMain.handle('open-file', async () => {
  const { canceled, filePaths } = await dialog.showOpenDialog({
    properties: ['openFile'],
    filters: [{ name: 'Text Files', extensions: ['txt'] }]
  })
  
  if (!canceled) {
    const content = fs.readFileSync(filePaths[0], 'utf-8')
    return { content, path: filePaths[0] }
  }
  return null
})

ipcMain.handle('save-file', async (event, { content, currentPath }) => {
    let filePath = currentPath
    
    // Only show dialog if we don't have a path (Save As) or if file doesn't exist
    if (!filePath || !fs.existsSync(filePath)) {
      const { canceled, filePath: newPath } = await dialog.showSaveDialog({
        defaultPath: filePath || 'untitled.txt',
        filters: [{ name: 'Text Files', extensions: ['txt'] }]
      })
      
      if (canceled) return null
      filePath = newPath
    }
    
    try {
      fs.writeFileSync(filePath, content)
      return filePath
    } catch (err) {
      console.error('File save error:', err)
      return null
    }
  })

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', () => {
  if (mainWindow === null) createWindow()
})