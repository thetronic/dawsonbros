export default function createShowCard(show) {
  // const id = show['id']

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

  // showCard.onclick = function() {
  //   location.href = 'show.html?id=' + id
  // }
  showImage.style.backgroundImage =
    "url('" + show['imageurl'].replace('http:', 'https:') + "')"
  if (show['show'] !== '') {
    showTitle.innerHTML = show['show'].toUpperCase()
    showOverlay.appendChild(showTitle)
  }
  if (show['channel'] !== '') {
    showChannel.innerHTML = show['channel']
    showOverlay.appendChild(showChannel)
  }
  if (show['job'] !== '') {
    showJob.innerHTML = show['job']
    showOverlay.appendChild(showJob)
  }
  if (show['starring'] !== '') {
    showStarring.innerHTML = show['starring']
    showOverlay.appendChild(showStarring)
  }

  if (show['producers'][0] !== '') {
    const producers = show['producers'].filter((a) => a).join('<br>')
    showProducers.innerHTML = producers
    showOverlay.appendChild(showProducers)
  }
  if (show['awards'][0] !== '') {
    const awards = show['awards'].filter((a) => a)
    awards.forEach((award) => {
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
