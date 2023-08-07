document.addEventListener('DOMContentLoaded', function () {
  function downloadRtf(content) {
    const rtfContent = `{{\\rtf1\\ansi\\deff0
{\\colortbl;\\red0\\green0\\blue0;}
${content.replace(/\n/g, '\\par\n')}
}}`

    const blob = new Blob([rtfContent], { type: 'text/rtf' })
    const downloadLink = document.createElement('a')
    downloadLink.href = URL.createObjectURL(blob)
    downloadLink.download = 'modified_text.rtf'

    document.body.appendChild(downloadLink)
    downloadLink.click()

    document.body.removeChild(downloadLink)
  }

  document
    .getElementById('submitButton')
    .addEventListener('click', function () {
      const inputText = document.getElementById('textInput').value

      const regexPattern = /({.*})|(<KEYNOTE - .*>)|((##)(\n|.)*?(##))/g
      const modifiedText = inputText.replace(regexPattern, '')
      const cleanedText = modifiedText.replace(/\n{3,}/g, '\n')

      const boldedRtfContent = cleanedText.replace(/<([^>]*)>/g, '{\\b $1 }')

      // Create a Blob with the cleaned text for TXT file
      const txtBlob = new Blob([cleanedText], { type: 'text/plain' })
      const txtDownloadLink = document.createElement('a')
      txtDownloadLink.href = URL.createObjectURL(txtBlob)
      txtDownloadLink.download = 'modified_text.txt'

      // Append the link to the DOM and trigger a click event to initiate the download
      document.body.appendChild(txtDownloadLink)
      txtDownloadLink.click()

      // Clean up the temporary link
      document.body.removeChild(txtDownloadLink)

      // Download the RTF file
      downloadRtf(boldedRtfContent)

      // Generate and download PDF
      const docDefinition = {
        content: [
          {
            text: cleanedText.replace(/<([^>]*)>/g, (match, group) => ({
              text: group,
              bold: true,
            })),
            margin: [0, 10],
          },
        ],
      }

      const pdfDocGenerator = pdfMake.createPdf(docDefinition)
      pdfDocGenerator.download('modified_text.pdf')
    })
})
