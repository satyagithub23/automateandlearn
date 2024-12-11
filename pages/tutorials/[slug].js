import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import styles from '@/styles/Bloglist.module.css'
import Link from 'next/link'

const slug = (props) => {
  const router = useRouter()
  const [blogs, setblogs] = useState(props.allBlogs)
  // useEffect(() => {
    
  // }, [])
  return (
    <div className={styles.blogContainer}>
      <h1>Top Blogs</h1>
      {blogs.map((blogitem) => {
        return <div className={styles.blogs} key={blogitem.title}>
          <Link href={`/tutorialpost/blog?lang=${blogitem.language}&slug=${blogitem.slug}`}><h4>{blogitem.title}</h4></Link>
          <p>{blogitem.metadesc}</p>
        </div>
      })}
    </div>
  )
}

export async function getServerSideProps(context){
  const { slug } = context.query
  let data = await fetch(`http://localhost:3000/api/blogs?lang=${slug}`)
  let allBlogs = await data.json()
  // console.log(myProps);
  
  // .then((a) => {
  //     return a.json()
  //   }).then((parsed) => {
  //     setblogs(parsed)
  //   })
  return {
    props: {allBlogs}// myProps will be passed to the page component as props
  }
}

export default slug