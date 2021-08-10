const urlQuery = window.location.search
const urlParams = new URLSearchParams(urlQuery)
const id = urlParams.get('id')
const requestURL = 'https://spreadsheets.google.com/feeds/list/1bLqN7oA2nNjZID7aGwhjX5z2btnSh3bmt2Y-CAt8PiY/od6/public/full?alt=json'
const request = new XMLHttpRequest()

request.onload = function() {
  if (this.readyState === 4 && this.status === 200) {
    const googleSheetsJSON = JSON.parse(this.responseText)
    handleLoad(googleSheetsJSON)
  }
}

request.open('GET', requestURL, true)
request.send()

function handleLoad(json){
  const jsonShows = json.feed.entry
  const allShows = []
  jsonShows.forEach(show =>{
    const showObject = convertToShowObject(show, 'all')
    allShows.push(showObject)
  })
  console.log(allShows)
  const show = allShows.find(x => x.id === id)
  
  updatePage(show)
}


function convertToShowObject(show, type = 'all'){
  const showObject = {}
  if (type !== 'year') { showObject['year'] = show.gsx$awards.$t }
  showObject['awards'] = show.gsx$awards.$t
  showObject['awards1'] = show.gsx$awards1.$t
  showObject['awards2'] = show.gsx$awards2.$t
  showObject['awards3'] = show.gsx$awards3.$t
  showObject['awards4'] = show.gsx$awards4.$t
  showObject['channel'] = show.gsx$channel.$t
  showObject['imageurl'] = show.gsx$imageurl.$t
  showObject['job'] = show.gsx$job.$t
  showObject['producers1'] = show.gsx$producers1.$t
  showObject['producers2'] = show.gsx$producers2.$t
  showObject['show'] = show.gsx$show.$t
  showObject['starring'] = show.gsx$starring.$t
  showObject['id'] = show.gsx$id.$t
  return showObject
}


function updatePage(show){
  const main = document.getElementById('mainContainer')
  const item = document.createElement('div')
  const img = document.createElement('img')
  item.innerHTML = show.show + '<br>' + show.job + '<br>' + show.channel + '<br>' + show.starring + '<br>' + show.producers1 + '<br>' + show.producers2 + '<br>' + show.awards
  img.src = show.imageurl
  main.appendChild(img)
  main.appendChild(item)


  // // FILL LATEST ARRAY IN DOM
  // for (let i = 30; i < 33; i++){
  //   const show = allShows[i]
  //   const id = show['id']
  //   const item = document.createElement('div')
  //   const overlay = document.createElement('text')
  //   item.className = 'latestItem'
  //   item.onclick = function() { location.href = 'show.html?id=' + id }
  //   overlay.className = 'latestOverlay'
  //   latestItems.appendChild(item)

  //   overlay.appendChild(createDiv(show['show'].toUpperCase(), 'title'))
  //   overlay.appendChild(createDiv(show['channel'], 'channel'))

  //   item.appendChild(overlay)

  //   item.style.backgroundImage = 'url(\'' + show['imageurl'] + '\')'
    
  // }


}

// function createDiv(data, className){
//   const div = document.createElement('div')
//   div.className = 'latest' + className
//   div.innerHTML = data
//   return div
// }
