import createShowCard from './functions/createShowCard.js'
import convertToShowObject from './functions/convertToShowObject.js'

const requestURL = 'https://sheets.googleapis.com/v4/spreadsheets/1bLqN7oA2nNjZID7aGwhjX5z2btnSh3bmt2Y-CAt8PiY/values/Sheet1?alt=JSON&key=AIzaSyCFNHPo-SnAqhK1IHB9xZxpQJyb-yfLooQ'
const request = new XMLHttpRequest()
console.log("test")
request.open('GET', requestURL, true)
request.send()
let requestCounter = 10

function updatePage(jsonShows){
  const allShows = []
  const latestItems = document.getElementById('latest')
  latestItems.textContent = ''
  
  jsonShows.forEach(show => {
    const showObject = convertToShowObject(show)
    allShows.push(showObject)
  })
  // FILL INDEX.HTML WITH LATEST ARRAY IN DOM
  const highlightedShows = allShows.filter(show => {
    return show['highlight'] !== ''
  })
  const highlightedShowsLimited = highlightedShows.slice(0, 3);

  highlightedShowsLimited.forEach( show => {
    const showCard = createShowCard(show)
    latestItems.appendChild(showCard)
  })
}

function handleLoad(json){
  console.log(json)
  const jsonShows = json.feed.entry
  updatePage(jsonShows)
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