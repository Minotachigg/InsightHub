
function parseContent(contentData, files = []) {
    const content = []
    let fileIndex = 0
  
    for (const item of contentData) {
      if (item.type === 'text') {
        content.push({ content_text: item.value })
      } else if (item.type === 'file' && files[fileIndex]) {
        content.push({ files_url: `public/uploads/${files[fileIndex].filename}` })
        fileIndex++
      }
    }
  
    return content
  }
  
  module.exports = parseContent
  