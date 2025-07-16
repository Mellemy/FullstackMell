import { useState, useEffect } from 'react'
const useCountry= (type) => {

  const [value, setValue] = useState('')

  const onChange = (event) => {
    setValue(event.target.value)
  }
  const reset = () => setValue('')
  
  return {
     inputProps: {
      type,
      value,
      onChange
    },
    reset

  }
}

export { useCountry}