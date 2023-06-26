export default function reducer(state, action){
  switch(action.type){
    case 'setData':
      return {
        ...state,
        data: action.value
      }
    case 'clearData':
      return {
        ...state,
        data: []
      }
    case 'tempSetData':
      return {
        ...state,
        todaysTemps: action.value.tempByHour,
        todaysRain: action.value.rainByHour,
        todaysWind: action.value.windByHour
      }
    default:
      break
  }
  return state
}