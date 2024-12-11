import React from 'react'
import styles from '@/styles/Card.module.css'
import CardContents from './cardContents'
import Image from 'next/image'

const Card = () => {
    function createMarkUp(content) {
        return {__html: content}
    }
    return (
        <div className={styles.cardcontainer}>
            {CardContents.map((item) => {
                return <div key={item.id} className={styles.plancontainer}>
                    <h3 className={styles.planname}>{item.planName}</h3>
                    <p className={styles.plandesc}>{item.planDesc}</p>
                    <p className={styles.planprice}>{item.planPrice}</p>
                    <button type="submit" className={styles.planbtn}>Add To Cart</button>
                    <div className={styles.alldesc} dangerouslySetInnerHTML={createMarkUp(item.planAllDesc)}></div>
                </div>
            })}
        </div>
    )
}

export default Card