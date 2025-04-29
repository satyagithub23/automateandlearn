import React, { useState, useEffect } from 'react'
import styles from '@/styles/Navbar.module.css'
import Link from 'next/link'
import Image from 'next/image'

const Navbar = ({ logout,  user }) => {
    const [dropdownstate, setdropdownstate] = useState(false)
    const [logoutstate, setlogoutstate] = useState()


    // useEffect(() => {
    //   console.log(logoutstate);
    // }, [logoutstate])
    

    return (
        <div className={styles.maincontainer}>
            <div className={styles.headingcontainer}>
                <h2>.automateandlearn</h2>
            </div>
            <nav>
                <ul className={styles.navlinks}>
                    <li className={styles.hideOnMobile}><Link href="/" scroll={false} className={styles.links}>Home</Link></li>
                    <li className={styles.hideOnMobile}><Link href="/product" scroll={false} className={styles.links}>Products</Link></li>
                    <li className={styles.hideOnMobile}><Link href="/services" scroll={false} className={styles.links}>Services</Link></li>
                    <li className={styles.hideOnMobile}><Link href="/tutorials" scroll={false} className={styles.links}>Tutorials</Link></li>
                    <li className={styles.hideOnMobile}><Link href="/contact" scroll={false} className={styles.links}>Contact Us</Link></li>
                    <li className={styles.hideOnMobile}><Link href="/about" scroll={false} className={styles.links}>About</Link></li>
                    <li className={styles.hideOnMobile}>
                        {user.value && <Link href={''} scroll={false} className={styles.links}>
                            <Image src="/images/user.png" width={60} height={60} alt="" onMouseOver={()=>{setdropdownstate(true)}} onMouseLeave={()=>{setdropdownstate(false)}} /></Link>}
                        {!user.value &&
                            <Link href="/login" scroll={false} className={styles.links}>
                                <button type="submit" className={styles.loginbtn}>Login</button>
                            </Link>}
                        {dropdownstate && <div className={styles.dropdown} onMouseOver={()=>{setdropdownstate(true)}} onMouseLeave={()=>{setdropdownstate(false)}}>
                            <ul>
                                <li><Link href={'/profile'}>My Account</Link></li>
                                <li>Orders</li>
                                <li onClick={logout}>Logout</li>
                            </ul>
                        </div>}
                    </li>
                    <li className={styles.hamburger} onClick={() => showSidebar()}><a href="#"><svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24" fill="black"><path d="M120-240v-80h720v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z" /></svg></a></li>
                </ul>
                <ul className={`${styles.sidebars} ${styles.show} ${styles.hide}`}>
                    <li className={styles.hamburger} onClick={() => hideSidebar()}><a href="#"><svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" /></svg></a></li>
                    <li><Link href="/" scroll={false} onClick={() => hideSidebar()}>Home</Link></li>
                    <li><Link href="/product" scroll={false} onClick={() => hideSidebar()}>Products</Link></li>
                    <li><Link href="/services" scroll={false} onClick={() => hideSidebar()}>Services</Link></li>
                    <li><Link href="/tutorials" scroll={false} onClick={() => hideSidebar()}>Tutorials</Link></li>
                    <li><Link href="/contact" scroll={false} onClick={() => hideSidebar()}>Contact Us</Link></li>
                    <li><Link href="/about" scroll={false} onClick={() => hideSidebar()}>About</Link></li>
                    <li>
                        {user.value && <Link href="/profile" scroll={false} onClick={() => hideSidebar()}>Profile</Link>}
                        {!user.value && <Link href="/login" scroll={false} onClick={() => hideSidebar()}>Login</Link>}
                    </li>
                    {user.value && <li onClick={logout}><Link href={''}>Logout</Link></li>}
                </ul>
            </nav>
        </div>
    )
    function showSidebar() {
        const sideBar = document.querySelector(`.${styles.sidebars}`)
        sideBar.style.display = 'flex'
        sideBar.style.opacity = 1
    }
    function hideSidebar() {
        const sideBar = document.querySelector(`.${styles.sidebars}`)
        sideBar.style.display = 'none'
        sideBar.style.opacity = 0
    }
}

export default Navbar