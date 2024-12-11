import Head from "next/head";
import Image from "next/image";
import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.css";
import Carousel from "@/public/components/carousel";
import Footer from "@/public/components/footer";
import Link from "next/link";
import Navbar from "@/public/components/navbar";
import { useState } from "react";

const inter = Inter({ subsets: ["latin"] });

const Home = (props) => {
  const [blog, setblog] = useState(props.allBlogs)
  return (
    <>
      <Head>
        <title>AUTOMATEANDLEARN</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>


      <div className={styles.body}>
        <p className={styles.mainheader}>AUTOMATEANDLEARN</p>
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Consequatur, eveniet illo autem consectetur, cupiditate, corrupti nemo beatae vitae eos repudiandae quibusdam perferendis. Quos consectetur laborum autem commodi, blanditiis voluptatem accusantium reiciendis tempora et sed voluptas in voluptatibus asperiores, nobis rem quam nisi natus assumenda alias?</p>
      </div>
      <div className={styles.servicecontainer} id="services">
        <div className={styles.header}>Services</div>
        <div className={styles.carouselcontainer}>
          <Carousel />
        </div>
      </div>
      <div className={styles.blogscontainer} id="blogs">
        <div className={styles.header}>Blogs</div>

        {blog.map((blogitem) => {
          return <div className={styles.blogs}>
            <div key={blogitem.index}>
              <h3>{blogitem.title}</h3>
              <p>{blogitem.metadesc}</p>
            </div>
          </div>
        })}
      </div>
    </>
  );
}
export async function getServerSideProps() {
  let data = await fetch(`http://localhost:3000/api/getAllBlogs`)
  let allBlogs = await data.json()
  return {
    props: { allBlogs }
  }
}

export default Home
