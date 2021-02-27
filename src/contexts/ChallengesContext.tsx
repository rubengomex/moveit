import { createContext, useEffect, useState } from 'react'
import Cookies from 'js-cookie'

import challenges from '../../challenges.json'

import LevelUpModal from '../components/LevelUpModal'

export interface Challenge {
  type: 'body' | 'eye'
  description: string
  amount: number
}

export interface ChallengesContextData {
  level: number
  currentExperience: number
  experienceToNextLevel: number
  challengesCompleted: number
  activeChallenge: Challenge
  levelUp: () => void
  startNewChallenge: () => void
  resetChallenge: () => void
  completeChallenge: () => void
  closeLevelUpModal: () => void
}

interface ChallengesProviderProps {
  level: number
  currentExperience: number
  challengesCompleted: number
}

export const ChallengesContext = createContext({} as ChallengesContextData)

export const ChallengesProvider: React.FC<ChallengesProviderProps> = ({ children, ...props }) => {
  const [level, setLevel] = useState(props.level ?? 1)
  const [currentExperience, setCurrentExperience] = useState(props.currentExperience ?? 0)
  const [challengesCompleted, setChallengesCompleted] = useState(props.challengesCompleted ?? 0)
  const [activeChallenge, setActiveChallenge] = useState(null)
  const [isLevelUpModalOpen, setIsLevelUpModalOpen] = useState(false)

  const experienceToNextLevel = Math.pow((level + 1) * 4, 2)

  useEffect(() => {
    Notification.requestPermission()
  }, [])

  useEffect(() => {
    Cookies.set('level', `${level}`)
    Cookies.set('currentExperience', `${currentExperience}`)
    Cookies.set('challengesCompleted', `${challengesCompleted}`)
  }, [level, currentExperience, challengesCompleted])

  const levelUp = () => {
    setLevel(level + 1)
    setIsLevelUpModalOpen(true)
  }

  const closeLevelUpModal = () => setIsLevelUpModalOpen(false)

  const startNewChallenge = () => {
    const challengeIndex = Math.floor(Math.random() * challenges.length)
    const challenge = challenges[challengeIndex]
    setActiveChallenge(challenge)

    new Audio('/notification.mp3').play()

    if (Notification.permission === 'granted') {
      const notification = new Notification('New challenge 🎉', {
        body: `Earn ${challenge.amount}xp!`
      })
    }
  }

  const resetChallenge = () => setActiveChallenge(null)
  const completeChallenge = () => {
    if (!activeChallenge) return

    const { amount } = activeChallenge
    let finalExperience = currentExperience + amount

    if (finalExperience >= experienceToNextLevel) {
      finalExperience -= experienceToNextLevel
      levelUp()
    }

    setCurrentExperience(finalExperience)
    setActiveChallenge(null)
    setChallengesCompleted(challengesCompleted + 1)
  }

  return (
    <ChallengesContext.Provider
      value={{
        level,
        currentExperience,
        experienceToNextLevel,
        challengesCompleted,
        levelUp,
        startNewChallenge,
        activeChallenge,
        resetChallenge,
        completeChallenge,
        closeLevelUpModal
      }}
    >
      {children}
      {isLevelUpModalOpen && <LevelUpModal />}
    </ChallengesContext.Provider>
  )
}
