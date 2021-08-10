import createShowCard from './functions/createShowCard.js'
import convertToShowObject from './functions/convertToShowObject.js'

const requestURL = 'https://spreadsheets.google.com/feeds/list/1bLqN7oA2nNjZID7aGwhjX5z2btnSh3bmt2Y-CAt8PiY/od6/public/full?alt=json'
const request = new XMLHttpRequest()
request.open('GET', requestURL, true)
request.send()

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
  const jsonShows = json.feed.entry
  updatePage(jsonShows)
}

request.onload = function() {
  if (this.readyState === 4 && this.status === 200) {
    var googleSheetsJSON = JSON.parse(this.responseText)
    handleLoad(googleSheetsJSON)
  }
}