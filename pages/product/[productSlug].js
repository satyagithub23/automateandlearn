import React from 'react'
import styles from '@/styles/Productpost.module.css'
import Image from 'next/image'
import { useState } from 'react'

const productSlug = (props) => {
  const [product, setproduct] = useState(props.product)
  return (
    <div className={styles.productDetailsContainer}>
      <Image src={product.product_image} width={300} height={300} alt={product.product_name}></Image>
      <div className={styles.productDetails}>
        <h2 className={styles.productName}>{product.product_name}</h2>
        <p className={styles.productDesc}>{product.product_desc}</p>
        <p className={styles.productPrice}>{product.price}</p>
        <button type="submit" className={styles.buybutton}>Buy Now</button>
      </div>
    </div>
  )
}

export async function getServerSideProps(context){
    const { productSlug } = context.query
    let data = await fetch(`http://localhost:3000/api/getProducts?id=${context.query.id}`)
    let product = await data.json()
    return {
      props: { product }
    }
}

export default productSlug