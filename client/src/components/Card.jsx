import React from 'react'
import { numberToLetter } from '../functions';

const Card = ( props ) => {

  // Map cardSign to corresponding image URL
  const cardSignToImage = {
    heart: './images/clipart1004895.png',
    spade: './images/kisspng-playing-card-suit-ace-of-spades-card-game-black-5ac5d88973dd84.2391802215229154654746.png',
    diamond: './images/kisspng-red-diamonds-computer-icons-clip-art-diamond-shape-5ad01fd88a8d21.0129154915235890805675.png',
    club: './images/kisspng-playing-card-card-game-clip-art-5ae6daf4422434.5502384115250787722709.png',
  };


  // Get the image URL based on props.cardSign
  const imageUrl = cardSignToImage[props.cardSign];
  console.log(imageUrl);

  const numorchar = numberToLetter(props.cardNumber)

  return (
      <div className='cardDiv' onClick={props.onClickDelete}>
        <h2>{numorchar}</h2>
        <img className="signImg" src={imageUrl} />
    </div>
  )
}

export default Card