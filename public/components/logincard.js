import React, { useState } from 'react'
import Image from 'next/image'
import styles from '@/styles/LoginCard.module.css'
import GLOBAL_CONSTANTS from '@/global_constants'
import Link from 'next/link'
import { ToastContainer, toast, Bounce } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/router'


const Logincard = () => {

  const [visibility, setvisivility] = useState(false)
  const [email, setemail] = useState()
  const [password, setpassword] = useState()
  const router = useRouter()

  const togglePasswordVisibility = () => {
    setvisivility((prevvisibilitystate) => !prevvisibilitystate)
  }

  const handleChange = (e) => {
    if (e.target.name == 'email') {
      setemail(e.target.value)
    } else if (e.target.name == 'password') {
      setpassword(e.target.value)
    }
  }
  const handleSubmit = async (e) => {
    console.log("Button clicked");
    e.preventDefault()
    const data = { email, password }
    let res = await fetch(`${GLOBAL_CONSTANTS.base_url}/api/responsefetch`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })

    let response = await res.json()
    console.log(response);
    setemail('')
    setpassword('')
    if (response.msg.msg == true) {
      localStorage.setItem('token', response.msg.token)
      document.cookie = `token=${response.msg.token}; path=/;`
      toast.success("Success!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: Bounce,
      });
      setTimeout(() => {
        router.push(`${GLOBAL_CONSTANTS.base_url}`)
      }, 300);
    } else {
      toast.error("Invalid Credentials!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
        });
    }
  }
  

  return (
    <div className={styles.logincardmain}>
      <ToastContainer />
      <form className={styles.form} onSubmit={handleSubmit} method="post">
        <h2>Welcome!</h2>
        <span>Please sign-in to your account and start the adventure</span>
        <div className={styles.inputfieldcontainer}>
          <div className={styles.input__group}>
            <input value={email} name='email' onChange={handleChange} type="email" id='email' className={styles.input__field} placeholder="Your Email" />
            <label htmlFor="email" className={styles.input__label}>Your Email</label>
          </div>
          <div className={styles.password__group}>
            <input value={password} name='password' onChange={handleChange} type={visibility ? "text" : "password"} id='password' className={styles.password__field} placeholder="Your Password" />
            <label htmlFor="password" className={styles.password__label}>Your Password</label>
            <button type="button" className={styles.visibilitybutton} onClick={togglePasswordVisibility}>
              {visibility ? (
                <a href='#'><svg xmlns="http://www.w3.org/2000/svg" height="24" fill='#fff' viewBox="0 -960 960 960" width="24"><path d="M480-320q75 0 127.5-52.5T660-500q0-75-52.5-127.5T480-680q-75 0-127.5 52.5T300-500q0 75 52.5 127.5T480-320Zm0-72q-45 0-76.5-31.5T372-500q0-45 31.5-76.5T480-608q45 0 76.5 31.5T588-500q0 45-31.5 76.5T480-392Zm0 192q-146 0-266-81.5T40-500q54-137 174-218.5T480-800q146 0 266 81.5T920-500q-54 137-174 218.5T480-200Zm0-300Zm0 220q113 0 207.5-59.5T832-500q-50-101-144.5-160.5T480-720q-113 0-207.5 59.5T128-500q50 101 144.5 160.5T480-280Z" /></svg></a>
              ) : (
                <a href="#"><svg xmlns="http://www.w3.org/2000/svg" height="24" fill='#fff' viewBox="0 -960 960 960" width="24"><path d="m644-428-58-58q9-47-27-88t-93-32l-58-58q17-8 34.5-12t37.5-4q75 0 127.5 52.5T660-500q0 20-4 37.5T644-428Zm128 126-58-56q38-29 67.5-63.5T832-500q-50-101-143.5-160.5T480-720q-29 0-57 4t-55 12l-62-62q41-17 84-25.5t90-8.5q151 0 269 83.5T920-500q-23 59-60.5 109.5T772-302Zm20 246L624-222q-35 11-70.5 16.5T480-200q-151 0-269-83.5T40-500q21-53 53-98.5t73-81.5L56-792l56-56 736 736-56 56ZM222-624q-29 26-53 57t-41 67q50 101 143.5 160.5T480-280q20 0 39-2.5t39-5.5l-36-38q-11 3-21 4.5t-21 1.5q-75 0-127.5-52.5T300-500q0-11 1.5-21t4.5-21l-84-82Zm319 93Zm-151 75Z" /></svg></a>)}</button>
          </div>
          <div className={styles.optionscontainer}>
            <div className={styles.checkboxcontainer}>
              <input type="checkbox" name="checkbox" id="checkbox" />
              <label htmlFor="checkbox">Remember Me</label>
            </div>
            <span><Link href={`${GLOBAL_CONSTANTS.base_url}/forget`}>Forgot Password?</Link></span>
          </div>
          <button type="submit" onClick={handleSubmit} className={styles.loginbtn}>Log In</button>
          <div className={styles.newaccountpath}>
            <span>Don't Have An Account?&nbsp;<Link className={styles.signuplink} href={`${GLOBAL_CONSTANTS.base_url}/signup`}>Create One!</Link></span>
          </div>
        </div>
      </form>
    </div>
  )
}

export default Logincard