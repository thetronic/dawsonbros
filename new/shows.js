import createShowCard from './functions/createShowCard.js'
import convertToShowObject from './functions/convertToShowObject.js'
import getYears from './functions/getYears.js'


const requestURL = 'https://sheets.googleapis.com/v4/spreadsheets/1bLqN7oA2nNjZID7aGwhjX5z2btnSh3bmt2Y-CAt8PiY/values/Sheet1?alt=JSON&key=AIzaSyCFNHPo-SnAqhK1IHB9xZxpQJyb-yfLooQ'
const request = new XMLHttpRequest()
request.open('GET', requestURL, true)
request.send()
let requestCounter = 10

function updatePage(jsonShows){
  const allShows = []
  
  jsonShows.forEach(show => {
    const showObject = convertToShowObject(show)
    allShows.push(showObject)
  })
  const mainContainer = document.getElementById('mainContainer')
  const sortedByYears = getYears(allShows)
  mainContainer.textContent = ''

  sortedByYears.forEach( yearObj => {
    //TITLE TEXT
    const titleTextDiv = document.createElement('div')
    titleTextDiv.className = 'titleText'
    
    //TITLE BOX
    const titleBoxDiv = document.createElement('div')
    titleTextDiv.innerHTML = yearObj.year
    titleBoxDiv.className = 'titleBox'

    //SHOW ARRANGEMENT BOX
    const showListBoxDiv = document.createElement('div')
    showListBoxDiv.className = 'showListBox'

    // SHOWS
    const showListDiv = document.createElement('div')
    showListDiv.className = 'showList'

    //SHOWS
    yearObj['shows'].forEach( show => {
      const showCard = createShowCard(show)
      showListDiv.appendChild(showCard)
    })

    titleBoxDiv.appendChild(titleTextDiv)
    showListBoxDiv.appendChild(showListDiv)

    mainContainer.appendChild(titleBoxDiv)
    mainContainer.appendChild(showListBoxDiv)
  })

}

function handleLoad(json){
  const jsonShows = json.feed.entry
  updatePage(json.values)
}

request.onload = function() {
  if (this.readyState === 4 && this.status === 200) {
    var googleSheetsJSON = JSON.parse(this.responseText)
    handleLoad(googleSheetsJSON)
  } else {
    requestCounter = requestCounter - 1
    console.log('Failed To Connect: ' + requestCounter)
    if (requestCounter >= 0){
      request.open('GET', requestURL, true)
      request.send()
    } else {
      console.log('Connection Failed')
    }
  }
}