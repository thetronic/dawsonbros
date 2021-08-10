export default function getYears(allShows){
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