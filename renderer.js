const editor = document.getElementById('editor')
const openBtn = document.getElementById('open-btn')
const saveBtn = document.getElementById('save-btn')
const saveAsBtn = document.getElementById('save-as-btn')
const filePathElement = document.getElementById('file-path')

let currentFilePath = null

// Open file
openBtn.addEventListener('click', async () => {
  const result = await window.electronAPI.openFile()
  if (result) {
    editor.value = result.content
    currentFilePath = result.path  // Store the current file path
    filePathElement.textContent = result.path
    console.log('Opened file:', currentFilePath)
  }
})

// Save file (use existing path if available)
saveBtn.addEventListener('click', async () => {
  if (!editor.value) return
  
  console.log('Attempting to save to:', currentFilePath)
  
  try {
    const savedPath = await window.electronAPI.saveFile({
      content: editor.value,
      currentPath: currentFilePath  // Pass the existing path
    })
    
    if (savedPath) {
      currentFilePath = savedPath  // Update if this was a "Save As" scenario
      filePathElement.textContent = savedPath
      console.log('Saved to:', savedPath)
    }
  } catch (err) {
    console.error('Save failed:', err)
  }
})

// Save As (always prompt for new location)
saveAsBtn.addEventListener('click', async () => {
  if (!editor.value) return
  
  try {
    const savedPath = await window.electronAPI.saveFile({
      content: editor.value,
      currentPath: null  // Force "Save As" behavior
    })
    
    if (savedPath) {
      currentFilePath = savedPath
      filePathElement.textContent = savedPath
      console.log('Saved new file:', savedPath)
    }
  } catch (err) {
    console.error('Save As failed:', err)
  }
})