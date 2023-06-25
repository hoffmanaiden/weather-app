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
    default:
      break
  }
  return state
}