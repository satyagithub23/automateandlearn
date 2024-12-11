import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import styles from '@/styles/Blogpost.module.css'
import Link from 'next/link'

const blog = (props) => {
    const [blogs, setblogs] = useState(props.blogData)
    const [allBlogs, setallBlogs] = useState(props.allBlogs)
    const router = useRouter()
    function createMarkup(content) {
        return {__html: content}
    }
    // console.log(allBlogs);

    // useEffect(() => {
    //     if (!router.isReady) return;
    //     const { blog } = router.query
    //     fetch(`http://localhost:3000/api/getBlog?lang=${router.query.lang}&slug=${router.query.slug}`).then((a) => {
    //         return a.json()
    //     }).then((parsed) => {
    //         setblogs(parsed)
    //     })
    // }, [router.isReady])

    useEffect(() => {
        setblogs(props.blogData);
    }, [props.blogData]);

    const handlePrevClick = (event, currentBlogIndex) => {
        try {
            let prevBlogIndex = currentBlogIndex - 1
            const prevBlog = allBlogs[prevBlogIndex]
            router.push(`/tutorialpost/blog?lang=${prevBlog.language}&slug=${prevBlog.slug}`);
        } catch (error) {
            const button = event.target
            button.disabled = true
        }
    }
    const handleNextClick = (event, currentBlogIndex) => {
        try {
            let nextBlogIndex = currentBlogIndex + 1
            const nextBlog = allBlogs[nextBlogIndex]
            router.push(`/tutorialpost/blog?lang=${nextBlog.language}&slug=${nextBlog.slug}`);
        } catch (error) {
            const button = event.target
            button.disabled = true
        }
    }

    return (
        <div className={styles.maincontainer}>
            <div className={styles.blogListContainer}>
                {allBlogs.map((blogitem) => {
                    return <div key={blogitem.slug}>
                        <Link href={`/tutorialpost/blog?lang=${blogitem.language}&slug=${blogitem.slug}`}><p>{blogitem.title}</p></Link>
                    </div>
                })}
            </div>

            <div className={styles.blogContainer}>
                <h1>{blogs && blogs.title}</h1>
                { blogs && <p dangerouslySetInnerHTML={createMarkup(blogs.description)}></p>}
                {/* <p>{blogs && blogs.description}</p> */}
                <div className={styles.buttonContainer}>
                    <button className={`${styles.prevbutton} ${styles.button}`} onClick={(e) => handlePrevClick(e, parseInt(`${blogs.index}`))}> &larr;  Prev</button>
                    <button className={`${styles.nextbutton} ${styles.button}`} onClick={(e) => handleNextClick(e, parseInt(`${blogs.index}`))}>Next  &rarr;</button>
                </div>
            </div>

        </div>
    )
}

export async function getServerSideProps(context) {
    // const router = useRouter();
    // if(!context.isReady) return;
    const { blog } = context.query
    let data = await fetch(`http://localhost:3000/api/getBlog?lang=${context.query.lang}&slug=${context.query.slug}`)
    let blogData = await data.json()
    let allBlogData = await fetch(`http://localhost:3000/api/blogs?lang=${context.query.lang}`)
    let allBlogs = await allBlogData.json()
    return {
        props: { blogData, allBlogs }
    }
}

export default blog