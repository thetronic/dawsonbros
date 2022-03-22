export default function convertToShowObject(show){
  const showObject = {}
  showObject['year'] = show[2] 
  showObject['awards'] = [show[10], show[11], show[12], show[13], show[14]]
  showObject['channel'] = show[4]
  showObject['imageurl'] = show[9]
  showObject['job'] = show[5]
  showObject['producers'] = [show[7], show[8]]
  showObject['show'] = show[3]
  showObject['starring'] = show[6]
  showObject['id'] = show[0]
  showObject['highlight'] = show[1]
  return showObject
}