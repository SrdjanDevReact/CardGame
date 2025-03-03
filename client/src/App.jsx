import React, { useEffect, useState } from 'react'
import io from 'socket.io-client'
import Card from './components/Card'
import "./App.css"
import CardBack from './components/CardBack'
import ClipLoader from "react-spinners/ClipLoader";



const socket = io.connect("http://localhost:3001")




const App = () => {

    const divStyle = {
        backgroundImage: 'url("./images/green-table.png")',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        minHeight: '100vh',
        maxHeight: '100vh', // Ensures the background covers the entire viewport height
    };



    const [spilKarata, setSpilKarata ] = useState([])
    const [currentPlayerId , setCurrentPlayerId] = useState(0)
    const [ oponentsCardNumber , setOponentsCardNumber ] = useState(4)
    const [ currentCardOnTable, setCurrentCardOnTable ] = useState(null)
    const [ myCardsInHand, setMyCardsInHand ] = useState([])
    const [ brojKarataUSpilu, setBrojKarataUSpilu ] = useState(32)
    const [firstPlayerAllCardsCount, setFirstPlayerAllCardsCount ] = useState(0)
    const [ firstAlive, setFirstAlive ] = useState(0)
    const [ secondAlive, setSecondAlive ] = useState(0)
    const [secondPlayerAllCardsCount, setSecondPlayerAllCardsCount ] = useState(0)



    const onClickDelete = ( index ) => {
        socket.emit("remove_this_card", {index: index})
        console.log("izbrisi bbree currentId: " + currentPlayerId + "  thisPlayerId: " + socket.id)
        socket.emit("next_player_turn")
    }

    const onClickPlayCard = ( index ) => {
        socket.emit("player_just_played_card", myCardsInHand[index])
        socket.emit("throw_card_from_my_hand",myCardsInHand[index])
        const updatedItems = myCardsInHand.filter((item, index1) => index1 !== index)
        setMyCardsInHand(updatedItems)
        setCurrentCardOnTable(myCardsInHand[index])
        socket.emit("next_player_turn")
    }

    const onClickNextTurnButton = () => {
        socket.emit("next_turn_from_hand_winner")
    }

    const getDeck = ()=>{
        socket.emit("get_deck")
    }

    useEffect(()=>{
        socket.on("last_connected_player_on_turn", (data)=>{
            setCurrentPlayerId(data)
        })
        socket.on("player_finished_turn", (data, oponCardNum )=>{
            setCurrentCardOnTable(data)
            setOponentsCardNumber(oponCardNum)
        })
        socket.on("first_hand_on_enter", (data, brojKarataUSpilu) =>{
            setMyCardsInHand(data)
            setOponentsCardNumber(4)
            setBrojKarataUSpilu(brojKarataUSpilu)
        })

        socket.on("receive_message",( data )=>{
            setMessagesReceived(data.message)
        })
        socket.on("receive_deck", (data)=>{
            setSpilKarata(data)
        })
        socket.on("start_of_turn", (data1, data2, brojKarataUSpilu, onTurnPlayer, first, second, firstAlive, secondAlive) => {
            setCurrentCardOnTable(null)
            setFirstAlive(firstAlive);
            setSecondAlive(secondAlive);
            setFirstPlayerAllCardsCount(first)
            setSecondPlayerAllCardsCount(second)
            setCurrentPlayerId(onTurnPlayer)
            setBrojKarataUSpilu(brojKarataUSpilu)
            for(let i=0; i<data1.length; i++){
                for(let j=0; j<data2.length; j++){
                    console.log("doublePetlja:"+data1[i].cardNumber)

                }
                for (let j = 0; j < data2.length; j++) {

                    console.log("doublePetlja2:" + data2[j].cardNumber)
                }
            }
            if(currentPlayerId === socket.id){
                setMyCardsInHand(data2)
                setOponentsCardNumber(data1.length)
            }
            else{
                setMyCardsInHand(data1)
                setOponentsCardNumber(data2.length)
            }
        })
        socket.on("next_player_turn", data => {
            setCurrentPlayerId(data)
        })
    }, [socket])

    const karteZaRender = myCardsInHand.map( (kartaObj,index) =>{
        console.log( "currentPlayerId: " + currentPlayerId + " thisPlayerId: " + socket.id)
        return <Card key={index} cardNumber={kartaObj.cardNumber} cardSign={kartaObj.cardSign} onClickDelete={() => socket.id === currentPlayerId ? onClickPlayCard(index):()=>{}}/>
    })

    const karteZaProvjeru = karteZaRender.slice(0,4)
    let protivnikoveKarte = []
    for ( let i =0 ; i< oponentsCardNumber;i++){
        protivnikoveKarte.push(<CardBack/>)
    }   
    let kartaNaTabli
    if( currentCardOnTable != null){
        kartaNaTabli = <Card cardNumber={currentCardOnTable.cardNumber} cardSign={currentCardOnTable.cardSign} />
    }
  return (
      <div style={divStyle}>
        <div className='glavniFlexDiv'>
            <div className='gornjiDiv'>
                  {oponentsCardNumber>0&&protivnikoveKarte}
            </div>
            <div className='srednjiDiv'>
                <div className='divZaSpil'>
                      <img className="spilSlika" src='./images/spil-karataReal.png'/>
                      <p className='brojKarataTxt'>br{ brojKarataUSpilu }</p>
                </div>
                  <div className='divZaKartuNaStolu'>
                    {/*<img  className="ramZaSliku" src='./images/ramZaKartu.png' />*/}
                      {kartaNaTabli}
                </div>
                <div className='divZaDugme'>
                      <h2 style={{display:'flex', alignItems:'center', color:'white'}}>All:<p className='brojUkupnihKarataTxt'>{firstPlayerAllCardsCount}</p></h2>
                      <h2 style={{ display: 'flex', alignItems: 'center', color: 'white' }}>Count:<p className='brojKarataTxt1'>{firstAlive}</p></h2>                    
                      <button className="dugmeDajKarte" onClick={onClickNextTurnButton} disabled={currentPlayerId===socket.id?false:true}><p className='dajKarteTxt'>Next!</p></button>
                      <h2 style={{ display: 'flex', alignItems: 'center', color: 'white' }}>Count:<p className='brojKarataTxt1'>{secondAlive}</p></h2>
                      <h2 style={{ display: 'flex', alignItems: 'center', color: 'white' }}>All:<p className='brojUkupnihKarataTxt'>{secondPlayerAllCardsCount}</p></h2>
                </div>           
            </div>
              {!(currentPlayerId===socket.id)&&<ClipLoader
                  loading={true}
                  color='orange'
                  size={20}
                  aria-label="Loading Spinner"
                  data-testid="loader"
              />}
            <div className='donjiDiv'>
                  {karteZaProvjeru}
            </div>
        </div>
    </div>
  )
}

export default App