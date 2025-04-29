import React, { useEffect } from 'react'
import styles from '@/styles/Forgot.module.css'
import { useRouter } from 'next/router'
import GLOBAL_CONSTANTS from '@/global_constants'

const forget = () => {


  const router = useRouter()

  useEffect(() => {
    if (localStorage.getItem('token')) {
      router.push(`${GLOBAL_CONSTANTS.base_url}`)
    }
  }, [])

  return (
    <div className={styles.maincontainer}>
      <div className={styles.formcontainer}>
        <form action="" method="post">
          <h2>Forgot Password</h2>
          <div className={styles.inputfieldcontainer}>
            <div className={styles.input__group}>
              <input type="email" id='email' className={styles.input__field} placeholder="Your Email" />
              <label for="email" className={styles.input__label}>Your Email</label>
            </div>
            <button type="submit" className={styles.continuebtn}>Continue</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default forget