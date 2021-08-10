export default function convertToShowObject(show){
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
  showObject['highlight'] = show.gsx$highlight.$t
  return showObject
}