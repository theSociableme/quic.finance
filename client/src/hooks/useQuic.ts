import { useContext } from 'react'
import { Context } from '../contexts/QuicProvider'

const useQuic = () => {
  const { quic } = useContext(Context)
  return quic
}

export default useQuic
