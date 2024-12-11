import { useState } from 'react'
import React from 'react'
import styles from '@/styles/Productlist.module.css'
import Image from 'next/image'
import Link from 'next/link'
import Head from 'next/head'

const Product = (props) => {

  const [products, setproduct] = useState(props.allProducts)
  
  return (
    <>
      <Head>
        <title>Products</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={styles.productContainer}>
        {products.map((product) => {
          return <div className={styles.product} key={product.product_id}>
            <Image src={product.product_image} width="100" height="100" alt='image'></Image>
            <div className={styles.productDetails}>
              <Link href={`product/prdct?id=${product.product_id}`}><h3 className={styles.title}>{product.product_name}</h3></Link>
              <p className={styles.description}>{product.product_desc}</p>
              <p className={styles.price}>{product.price}</p>
            </div>
          </div>
        })}
      </div>
    </>
  )
}

export async function getServerSideProps(context) {
  let data = await fetch('http://localhost:3000/api/getAllProducts')
  let allProducts = await data.json()
  return {
    props: { allProducts }
  }
}

export default Product