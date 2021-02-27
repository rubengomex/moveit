import { createContext, useContext, useEffect, useState } from 'react'

import { ChallengesContext } from './ChallengesContext'

export interface CountdownContextData {
  minutes: number
  seconds: number
  hasFinished: boolean
  isActive: boolean
  startCountdown: () => void
  resetCountdown: () => void
}

const INITIAL_COUNT_DOWN_TIME = 2 * 60
let countdownTimeout: NodeJS.Timeout

export const CountdownContext = createContext({} as CountdownContextData)

export const CountdownProvider: React.FC<{}> = ({ children }) => {
  const [time, setTime] = useState(INITIAL_COUNT_DOWN_TIME)
  const [isActive, setIsActive] = useState(false)
  const [hasFinished, setHasFinished] = useState(false)

  const { startNewChallenge } = useContext(ChallengesContext)

  const minutes = Math.floor(time / 60)
  const seconds = time % 60

  useEffect(() => {
    if (isActive) {
      if (time > 0) {
        countdownTimeout = setTimeout(() => setTime(time - 1), 1000)
      } else {
        setHasFinished(true)
        setIsActive(false)
        startNewChallenge()
      }
    }
  }, [isActive, time])

  const startCountdown = () => setIsActive(true)
  const resetCountdown = () => {
    clearTimeout(countdownTimeout)
    setIsActive(false)
    setTime(INITIAL_COUNT_DOWN_TIME)
    setHasFinished(false)
  }

  return (
    <CountdownContext.Provider
      value={{
        minutes,
        seconds,
        hasFinished,
        isActive,
        startCountdown,
        resetCountdown
      }}
    >
      {children}
    </CountdownContext.Provider>
  )
}
