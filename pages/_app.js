import Footer from "@/public/components/footer";
import Navbar from "@/public/components/navbar";
import "@/styles/globals.css";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import LoadingBar from "react-top-loading-bar";


export default function App({ Component, pageProps }) {
  const router = useRouter();
  const [user, setuser] = useState({ value: null })
  const [key, setkey] = useState(0)
  const [progress, setprogress] = useState(0)


  // Define an array of page paths where you want to exclude Navbar and Footer
  const excludeFromPages = ['/codecompiler'];

  // Check if the current page is in the exclude list
  const shouldExcludeNavbarAndFooter = excludeFromPages.includes(router.pathname);

  useEffect(() => {

    router.events.on('routeChangeComplete', () => {
      setprogress(100)
    })

    router.events.on('routeChangeStart', () => {
      setprogress(40)
    })

    const token = localStorage.getItem('token')
    if (token) {
      setuser({ value: token })
      setkey(Math.random())
    }

  }, [router.query])

  const logout = () => {
    localStorage.removeItem('token')
    setuser({ value: null })
    setkey(Math.random())
  }


  return (
    <>
      <LoadingBar color="#9B00FF" progress={progress} height={3} waitingTime={400} onLoaderFinished={() => setprogress(0)} />
      {!shouldExcludeNavbarAndFooter && <Navbar logout={logout} user={user} />}
      <Component {...pageProps} />
      {!shouldExcludeNavbarAndFooter && <Footer />}
    </>
  );
}