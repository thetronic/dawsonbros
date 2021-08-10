const requestURL = 'https://spreadsheets.google.com/feeds/list/1bLqN7oA2nNjZID7aGwhjX5z2btnSh3bmt2Y-CAt8PiY/od6/public/full?alt=json'
const request = new XMLHttpRequest()
request.open('GET', requestURL, true)
request.send()
var path = window.location.pathname
var page = path.split("/").pop()
const urlQuery = window.location.search
const urlParams = new URLSearchParams(urlQuery)
const id = urlParams.get('id')


function createShowCard(show){
  const id = show['id']

  const showCard = document.createElement('div')

  const showImage = document.createElement('div')
  const showOverlay = document.createElement('div')

  const showTitle = document.createElement('div')
  const showChannel = document.createElement('div')
  const showJob = document.createElement('div')
  const showStarring = document.createElement('div')
  const showProducers = document.createElement('div')
  const showAwards = document.createElement('div')

  showCard.className = 'showCard'

  showImage.className = 'showImage'
  showOverlay.className = 'showOverlay'

  showTitle.className = 'showTitle'
  showChannel.className = 'showChannel'
  showJob.className = 'showJob'
  showStarring.className = 'showStarring'
  showProducers.className = 'showProducers'
  showAwards.className = 'showAwards'

  showCard.onclick = function() { 
    location.href = 'show.html?id=' + id 
  }

  showImage.style.backgroundImage = 'url(\'' + show['imageurl'] + '\')'

  if (show['show'] !== ''){
    showTitle.innerHTML = show['show'].toUpperCase()
    showOverlay.appendChild(showTitle)
  }
  if (show['channel'] !== ''){
    showChannel.innerHTML = show['channel']
    showOverlay.appendChild(showChannel)
  }
  if (show['job'] !== ''){
    showJob.innerHTML = show['job']
    showOverlay.appendChild(showJob)
  }
  if (show['starring'] !== ''){
    showStarring.innerHTML = show['starring']
    showOverlay.appendChild(showStarring)
  }

  if (show['producers'][0] !== ''){
    const producers = show['producers'].filter((a) => a).join('<br>')
    showProducers.innerHTML = producers
    showOverlay.appendChild(showProducers)
  }
  if (show['awards'][0] !== ''){
    console.log(show['awards'])
    const awards = show['awards'].filter((a) => a)
    console.log(awards)
    awards.forEach( award => {
      const singleAward = document.createElement('div')
      singleAward.className = 'showAwards'
      singleAward.innerHTML = '&#127942; ' + award
      showAwards.appendChild(singleAward)
    })
    showOverlay.appendChild(showAwards)
  }

  showCard.appendChild(showImage)
  showCard.appendChild(showOverlay)
  return showCard
}


function convertToShowObject(show){
  const showObject = {}
  showObject['year'] = show.gsx$year.$t 
  showObject['awards'] = [show.gsx$awards.$t, show.gsx$awards1.$t, show.gsx$awards2.$t, show.gsx$awards3.$t, show.gsx$awards4.$t]
  showObject['channel'] = show.gsx$channel.$t
  showObject['imageurl'] = show.gsx$imageurl.$t
  showObject['job'] = show.gsx$job.$t
  showObject['producers'] = [show.gsx$producers1.$t, show.gsx$producers2.$t]
  showObject['show'] = show.gsx$show.$t
  showObject['starring'] = show.gsx$starring.$t
  showObject['id'] = show.gsx$id.$t
  return showObject
}


function getYears(allShows){
  console.log(allShows)
  const yearArray = []
  allShows.forEach(show => {
    const year = show.year
    yearArray.push(year)
  })
  const years = [...new Set(yearArray)]
  const arrayByYear = []

  years.forEach(year => {
    const yearObjectArray = []
    allShows.forEach(show =>{
      if (show.year === year){
        delete show['year']
        yearObjectArray.push(show)
      }
    })
    arrayByYear.push( { 
      year: year, 
      shows: yearObjectArray 
    })
  })
  return arrayByYear
}

function updatePage(jsonShows){
  const allShows = []
  jsonShows.forEach(show => {
    const showObject = convertToShowObject(show)
    allShows.push(showObject)
  })
  // FILL INDEX.HTML WITH LATEST ARRAY IN DOM
  if (page === 'index.html'){
    const latestItems = document.getElementById('latest')
    
    for (let i = 20; i < 23; i++){
      const showCard = createShowCard(allShows[i])
      latestItems.appendChild(showCard)
    }
  }

  if (page === 'shows.html'){
    const mainContainer = document.getElementById('mainContainer')
    const sortedByYears = getYears(allShows)

    console.log(sortedByYears[0])

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
        const id = show['id']
        const item = document.createElement('div')
        const overlay = document.createElement('text')
        item.className = 'latestItem'
        item.onclick = function() { 
          location.href = 'show.html?id=' + id 
        }
        overlay.className = 'latestOverlay'
        showListDiv.appendChild(item)
  
        overlay.appendChild(createDiv(show['show'].toUpperCase(), 'title'))
        overlay.appendChild(createDiv(show['channel'], 'channel'))

        item.appendChild(overlay)
        item.style.backgroundImage = 'url(\'' + show['imageurl'] + '\')'
      })

      titleBoxDiv.appendChild(titleTextDiv)
      showListBoxDiv.appendChild(showListDiv)
      mainContainer.appendChild(titleBoxDiv)
      mainContainer.appendChild(showListBoxDiv)
    })
  }

}


//HANDLERS

function handleLoad(json){
  const jsonShows = json.feed.entry
  updatePage(jsonShows, 'latest')
}


request.onload = function() {
  if (this.readyState === 4 && this.status === 200) {
    var googleSheetsJSON = JSON.parse(this.responseText)
    handleLoad(googleSheetsJSON)
  }
}