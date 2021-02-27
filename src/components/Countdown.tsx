import { useContext, useEffect, useState } from 'react'

import { CountdownContext } from '../contexts/CountdownContext'

import styles from '../styles/components/Countdown.module.css'

const Countdown = () => {
  const { minutes, seconds, isActive, hasFinished, startCountdown, resetCountdown } = useContext(CountdownContext)
  const [minuteLeft, minuteRight] = `${minutes}`.padStart(2, '0').split('')
  const [secondLeft, secondRight] = `${seconds}`.padStart(2, '0').split('')

  return (
    <>
      <div className={styles.countdownContainer}>
        <div>
          <span>{minuteLeft}</span>
          <span>{minuteRight}</span>
        </div>
        <span>:</span>
        <div>
          <span>{secondLeft}</span>
          <span>{secondRight}</span>
        </div>
      </div>

      {hasFinished ? (
        <button disabled className={styles.countdownButton}>
          Ended cycle
        </button>
      ) : (
        <>
          {isActive ? (
            <button
              type="button"
              className={`${styles.countdownButton} ${styles.countdownButtonActive}`}
              onClick={resetCountdown}
            >
              Leave cycle
            </button>
          ) : (
            <button type="button" className={styles.countdownButton} onClick={startCountdown}>
              Start cycle
            </button>
          )}
        </>
      )}
    </>
  )
}

export default Countdown
