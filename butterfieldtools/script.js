document.addEventListener('DOMContentLoaded', function () {
  document
    .getElementById('submitButton')
    .addEventListener('click', function () {
      const inputText = document.getElementById('textInput').value

      const regexPattern = /({.*})|(<.*>)|((##)(\n|.)*?(##))/g
      const modifiedText = inputText.replace(regexPattern, '')
      const cleanedText = modifiedText
        .replace(/\n{3,}/g, '\n\n')
        .replace(/(.)\n(\[|<|\|)/g, '$1\n\n$2')
        .replace(/(\]|>|\|)\n(.)/g, '$1\n\n$2')

      // Create a Blob with the cleaned text for TXT file
      const txtBlob = new Blob([cleanedText], { type: 'text/plain' })
      const txtDownloadLink = document.createElement('a')
      txtDownloadLink.href = URL.createObjectURL(txtBlob)
      txtDownloadLink.download = 'Cue Script.txt'

      // Append the link to the DOM and trigger a click event to initiate the download
      document.body.appendChild(txtDownloadLink)
      txtDownloadLink.click()

      // Clean up the temporary link
      document.body.removeChild(txtDownloadLink)

      // Generate and download PDF
      const pdfContent = []
      const regexPatternPDF = /({.*})|(<KEYNOTE - .*>)|((##)(\n|.)*?(##))/g
      const modifiedTextPDF = inputText.replace(regexPatternPDF, '')
      const cleanedTextPDF = modifiedTextPDF
        .replace(/\n{3,}/g, '\n\n')
        .replace(/(.)\n(\[|<|\|)/g, '$1\n\n$2')
        .replace(/(\]|>|\|)\n(.)/g, '$1\n\n$2')
      let lineNumber = 1
      cleanedTextPDF.split(/<([^>]*)>/).forEach((part, index) => {
        var colour = 'cyan'
        if (part.includes('LIGHTING')) {
          colour = 'yellow'
        }
        if (index % 2 === 0) {
          pdfContent.push(part)
        } else {
          if (pdfContent.length > 0) {
            pdfContent.push('', {
              text: `${lineNumber++}. ${part}`,
              bold: true,
              background: colour,
            })
          } else {
            pdfContent.push({
              text: `${lineNumber++}. ${part}`,
              bold: true,
              background: colour,
            })
          }
        }
      })

      const docDefinition = {
        content: [{ text: pdfContent, margin: [0, 10] }],
      }

      const pdfDocGenerator = pdfMake.createPdf(docDefinition)
      pdfDocGenerator.download('Tech Script.pdf')
    })
})
