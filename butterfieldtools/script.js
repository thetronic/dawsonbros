function removeExcessNewlines(text) {
  return text.replace(/\n\n+/g, '\n')
}

function createTextAndCues(textArray) {
  const textAndCueArray = []
  let lineCount = 0
  for (let i = 0; i < textArray.length; i++) {
    const line = textArray[i]

    if (!line.includes('<')) {
      textAndCueArray.push({ text: line, cues: [] })
      lineCount++
    } else {
      const output = line.replace('<', '').replace('>', '').trim()
      textAndCueArray[lineCount - 1].cues.push(output)
    }
  }
  return textAndCueArray
}

function addNewPage(doc, lineYPosition, cueIndent, pageHeight, topMargin) {
  doc.addPage('a4', 'p')
  lineYPosition = topMargin
  doc.setDrawColor(100, 100, 100)
  doc.line(cueIndent - 3, 0, cueIndent - 3, pageHeight)
  doc.line(cueIndent - 5, 0, cueIndent - 5, pageHeight)
  doc.setDrawColor(0, 0, 0)
  return lineYPosition
}

function createPDF(textAndCues, width, doc, cueType) {
  // CUE TYPES: 'AV' or 'TECH'
  const splitWidth = width //Calculate this from character width
  const lineHeight = doc.getLineHeight() / doc.internal.scaleFactor // May need "lines.length * doc.getLineHeight() * 96/72" to go from pt to px
  const leftMargin = 20
  const topMargin = 20
  const bottomMargin = 20
  const cueIndent = 130
  const cueLength = 60
  const lineEnd = 135
  let lineIndent = 0
  const pageHeight = 297 //Get from the doc height
  const yLimit = pageHeight - bottomMargin - lineHeight

  let lineYPosition = topMargin

  doc.setDrawColor(100, 100, 100)
  doc.line(cueIndent - 3, 0, cueIndent - 3, pageHeight)
  doc.line(cueIndent - 5, 0, cueIndent - 5, pageHeight)
  doc.setDrawColor(0, 0, 0)

  for (let i = 0; i < textAndCues.length; i++) {
    const line = textAndCues[i].text

    doc.setFontSize(12)
    doc.setFont('Courier', 'bold')

    const splitLines = doc.splitTextToSize(line, splitWidth)
    for (let j = 0; j < splitLines.length; j++) {
      let splitLine = splitLines[j]

      //NEW PAGE ONLY IF SEQ IS NOT THE FIRST THING ON PAGE
      if (!splitLine.includes('SEQ01')) {
        if (splitLine.includes('SEQ')) {
          lineYPosition = addNewPage(
            doc,
            lineYPosition,
            cueIndent,
            pageHeight,
            topMargin,
          )
        }
      }

      if (splitLine.match(/(?<!\|)([^|]+)(?!\|)/)) {
        // |SEQ00| match
        splitLine = splitLine.replaceAll('|', '')
      }
      doc.text(splitLine, leftMargin, lineYPosition)
      lineYPosition += lineHeight
      lineIndent = doc.getTextWidth(splitLine) + leftMargin
    }

    let yPosition = lineYPosition - lineHeight + 1
    let isFirstCue = true

    for (let k = textAndCues[i].cues.length - 1; k >= 0; k--) {
      const cue = textAndCues[i].cues[k]
      let cueRegex = /./
      if (cueType === 'TECH') {
        cueRegex = /^(LX|SQ):/
      }
      if (cueType === 'AV') {
        cueRegex = /^AV:/
      }
      if (cueType === 'ALL') {
        cueRegex = /^(LX|SQ|AV):/
      }
      if (cue.match(cueRegex)) {
        if (isFirstCue) {
          doc.line(lineIndent, yPosition, lineEnd, yPosition)
          isFirstCue = false
        }
        doc.setFontSize(9)
        if (cueType === 'ALL' && cue.match(/^(LX|SQ):/)) {
          doc.setTextColor(0, 0, 255)
        }
        doc.setFont('Helvetica', 'normal')
        const cueSplit = doc.splitTextToSize(cue, cueLength)
        let trimmedCue = cueSplit[0]
        if (cueSplit.length > 1) {
          trimmedCue += '...'
        }
        doc.text(trimmedCue, cueIndent, yPosition - 1)
        yPosition -= lineHeight
        doc.setTextColor(0, 0, 0)
      }
    }
    lineYPosition += lineHeight //Add a space between lines

    if (lineYPosition >= yLimit) {
      lineYPosition = addNewPage(
        doc,
        lineYPosition,
        cueIndent,
        pageHeight,
        topMargin,
      )
    }
  }
  return doc
}

function createCueTextfile(inputText, filename) {
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
  txtDownloadLink.download = filename

  // Append the link to the DOM and trigger a click event to initiate the download
  document.body.appendChild(txtDownloadLink)
  txtDownloadLink.click()

  // Clean up the temporary link
  document.body.removeChild(txtDownloadLink)
}

async function generatePdf(textInput, docType, docName) {
  const documentFormat = {
    orientation: 'p',
    unit: 'mm',
    format: 'a4',
    putOnlyUsedFonts: true,
  }
  var doc = new jsPDF(documentFormat)
  doc.setFontSize(12)

  const textWithSingleNewLines = removeExcessNewlines(textInput)

  // const regexPatternPDF = /({.*})|((##)(\n|.)*?(##))/g
  // const modifiedTextPDF = textWithSingleNewLines.replace(regexPatternPDF, '')
  const modifiedTextPDF = textWithSingleNewLines.replaceAll('##', '').trim()

  const textArray = modifiedTextPDF.split('\n')

  const textAndCues = createTextAndCues(textArray)

  const width = 100

  doc = await createPDF(textAndCues, width, doc, docType)

  // doc.output('dataurlnewwindow')
  doc.save(docName)
}

document.addEventListener('DOMContentLoaded', function () {
  document
    .getElementById('submitButton')
    .addEventListener('click', async () => {
      // const response = await fetch('temp.txt')
      // const fileText = await response.text()
      // document.getElementById('textInput').value = fileText
      const text = document.getElementById('textInput').value
      const tech = document.getElementById('tech').checked
      const av = document.getElementById('av').checked
      const cue = document.getElementById('cue').checked
      const all = document.getElementById('all').checked

      const today = new Date()
      const yy = today.getFullYear().toString().substr(-2)
      let mm = today.getMonth() + 1
      let dd = today.getDate()

      if (dd < 10) dd = '0' + dd
      if (mm < 10) mm = '0' + mm
      const formattedToday = dd + mm + yy

      if (tech) {
        generatePdf(
          text,
          'TECH',
          'Butterfield_Tech_Script_' + formattedToday + '.pdf',
        )
      }
      if (av) {
        generatePdf(
          text,
          'AV',
          'Butterfield_AV_Script_' + formattedToday + '.pdf',
        )
      }
      if (all) {
        generatePdf(
          text,
          'ALL',
          'Butterfield_All_Cues_Script_' + formattedToday + '.pdf',
        )
      }
      if (cue) {
        createCueTextfile(
          text,
          'Butterfield_Cue_Script_' + formattedToday + '.txt',
        )
      }
    })
})
