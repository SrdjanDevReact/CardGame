const express = require('express');
const app = express();
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');
const { generateShuffledDeck, getFirstXElements, removeFirstXElements, deleteObjectFromArray, getOtherString } = require('./functionsMy');



app.use(cors());

let shuffledDeck = generateShuffledDeck()
console.log("majmuneee"+shuffledDeck)
let allPlayersIds = []
let currentPlayerId
let twoPlayers = []
let indexForPlayers = 1
let indexForRukaIgraca = 0
let prviIgracRuka = getFirstXElements(shuffledDeck, 4)
removeFirstXElements(shuffledDeck, 4)
let drugiIgracRuka = getFirstXElements(shuffledDeck,4)
removeFirstXElements(shuffledDeck, 4)
let obeRukeIgraca = []
let brojKarataUSpilu = shuffledDeck.length
let cardsOnTheTable = []
let donjaKartaBroj = 0
let brojRukaUrundi = 0
let firstPlayerAllCardsCount = 0
let firstPlayerAliveCardsCount = 0
let secondPlayerAllCardsCount = 0
let secondPlayerAliveCardsCount = 0
let isLastClick = false

obeRukeIgraca.push(prviIgracRuka)
obeRukeIgraca.push(drugiIgracRuka)



const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: 'http://localhost:5173',
        methods: ['GET', 'POST']
    }
});

io.on("connection", (socket)=>{


    socket.emit("first_hand_on_enter", obeRukeIgraca[indexForRukaIgraca], brojKarataUSpilu)
    if(indexForRukaIgraca===0){
        indexForRukaIgraca=1
    }
    else{
        indexForRukaIgraca=0
    }

    console.log(`User connected: ${socket.id}`);
    allPlayersIds.push(socket.id)
    twoPlayers[0]=allPlayersIds[allPlayersIds.length-2]
    twoPlayers[1]=allPlayersIds[allPlayersIds.length-1]
    currentPlayerId = twoPlayers[1]


    socket.broadcast.emit("last_connected_player_on_turn",socket.id)
    socket.emit("last_connected_player_on_turn",socket.id)

    socket.on("send_message", (data)=>{
        socket.broadcast.emit("receive_message", data );
    });

    socket.on("throw_card_from_my_hand", data =>{
        //console.log(data);
    })

    socket.on("get_deck",(data)=>{
        socket.emit("receive_deck", shuffledDeck, currentPlayerId)

    })
    socket.on("remove_card_from_top", ()=>{
        shuffledDeck=shuffledDeck.slice(1)
        socket.broadcast.emit("receive_deck", shuffledDeck, currentPlayerId)
        socket.emit("receive_deck", shuffledDeck, currentPlayerId)
    })
    socket.on("remove_this_card", (data) => {
        //console.log(data.index)
        shuffledDeck = [...shuffledDeck.slice(0, data.index), ...shuffledDeck.slice(data.index + 1)]
        socket.broadcast.emit("receive_deck", shuffledDeck, currentPlayerId);
        socket.emit("receive_deck", shuffledDeck, currentPlayerId)
    });



    socket.on("next_turn_from_hand_winner", ()=>{
        //console.log("NAKON NEXT BUTTONA DUZINA RUKU JE:"+ obeRukeIgraca[0].length + " i " + obeRukeIgraca[1].length)
        let hasWinRound
        if(cardsOnTheTable[cardsOnTheTable.length-1]===donjaKartaBroj || cardsOnTheTable[cardsOnTheTable.length-1]===7){
            hasWinRound=false
        }
        else{
            hasWinRound=true
        }
        if(shuffledDeck.length>0){
            for (let j = 0; j < 2; j++) {
                if (shuffledDeck.length < ((4 - obeRukeIgraca[0].length) + (4 - obeRukeIgraca[1].length))) {
                    let poPola = Math.round(brojKarataUSpilu / 2)
                    console.log("JEBENI PO POLA ----- : "+ poPola)
                    for (let i = 0; i < poPola; i++) {
                        //console.log("IZ FORA SHDOD0 :" + shuffledDeck[0].cardNumber)
                        console.log("AJ MI SE NAPUSI KURCA MATORI : " + shuffledDeck[0].cardNumber)
                        console.log("A OVO JE JOT:    "+ j)
                        obeRukeIgraca[j].push(shuffledDeck[0])
                        console.log("AJ MI SE NAPUSI KURCA MATORI IZ OBERUKEIGRACA: " + obeRukeIgraca[j].cardNumber)
                        shuffledDeck.shift()
                    }
                } else {
                    for (let i = obeRukeIgraca[j].length; i < 4; i++) {
                        //console.log("IZ FORA SHDOD0 :" + shuffledDeck[0].cardNumber)
                        obeRukeIgraca[j].push(shuffledDeck[0])
                        shuffledDeck.shift()
                    }
                }

                /*for (let i = obeRukeIgraca[j].length; i < 4; i++) {
                    //console.log("IZ FORA SHDOD0 :" + shuffledDeck[0].cardNumber)
                    obeRukeIgraca[j].push(shuffledDeck[0])
                    shuffledDeck.shift()
                }*/



                console.log("Duzina pri izlazu iz fora od " + j + " ruke:" + obeRukeIgraca[j].length)
            }
        }
        
        brojKarataUSpilu=shuffledDeck.length
        let onTurnPlayer
        if(hasWinRound){
            onTurnPlayer=currentPlayerId
            if(currentPlayerId===twoPlayers[0]){
                firstPlayerAllCardsCount=firstPlayerAllCardsCount+cardsOnTheTable.length
            }
            else{
                secondPlayerAllCardsCount = secondPlayerAllCardsCount+cardsOnTheTable.length
            }
        }else{
            onTurnPlayer=getOtherString(currentPlayerId,twoPlayers)
            if(currentPlayerId===twoPlayers[0]){
                secondPlayerAllCardsCount = secondPlayerAllCardsCount + cardsOnTheTable.length
            } else if(currentPlayerId===twoPlayers[1]){
                firstPlayerAllCardsCount = firstPlayerAllCardsCount + cardsOnTheTable.length 
            }
        }
        let zivihKarataNaPolju=0
        for (let i=0; i<cardsOnTheTable.length; i++){
            if(cardsOnTheTable[i]===1 || cardsOnTheTable[i]===10){
                zivihKarataNaPolju=zivihKarataNaPolju+1
            }
        }
        
        if(shuffledDeck.length===0&&obeRukeIgraca[0].length===0){
            isLastClick= true
            console.log("ZADNJI KLIK JE PRITISNUT!!!!!!!!!!!!!!!!!")
        }
        currentPlayerId=onTurnPlayer
        if (currentPlayerId === twoPlayers[0]) {
            firstPlayerAliveCardsCount = firstPlayerAliveCardsCount + zivihKarataNaPolju;
            if(isLastClick){
                firstPlayerAliveCardsCount=firstPlayerAliveCardsCount + 1
            }
            
        }
        else if (currentPlayerId === twoPlayers[1]) {
            secondPlayerAliveCardsCount = secondPlayerAliveCardsCount + zivihKarataNaPolju;
            if (isLastClick) {
                secondPlayerAliveCardsCount = secondPlayerAliveCardsCount + 1
            }
        }
        cardsOnTheTable = []
        donjaKartaBroj = 0
        //console.log("IZ NEXT TURN : " + obeRukeIgraca[0].length + " DRUGA RUKA:" + obeRukeIgraca[1].length)
        socket.broadcast.emit("start_of_turn", obeRukeIgraca[0], obeRukeIgraca[1], brojKarataUSpilu, onTurnPlayer, firstPlayerAllCardsCount, secondPlayerAllCardsCount, firstPlayerAliveCardsCount, secondPlayerAliveCardsCount );
        socket.emit("start_of_turn", obeRukeIgraca[1], obeRukeIgraca[0], brojKarataUSpilu,onTurnPlayer, firstPlayerAllCardsCount,secondPlayerAllCardsCount, firstPlayerAliveCardsCount, secondPlayerAliveCardsCount);
        

    })

    socket.on("player_just_played_card", data => {
        //console.log("ovo je data prva:"+data.cardNumber);
        cardsOnTheTable.push(data.cardNumber)
        if(donjaKartaBroj===0){
            donjaKartaBroj=data.cardNumber
        }

       // console.log("INICIJALNA DUZINA PRVE RUKE:"+obeRukeIgraca[0].length)
        //console.log("INICIJALNA DUZINA DRUGE RUKE:"+obeRukeIgraca[1].length)
        obeRukeIgraca = deleteObjectFromArray(obeRukeIgraca, data)
        //console.log("br karata 1 igrac: "+ obeRukeIgraca[0].length);
        //console.log("br karata 2 igrac: "+ obeRukeIgraca[1].length)
        socket.broadcast.emit("player_finished_turn",data, obeRukeIgraca[1].length);
    })

    socket.on("next_player_turn", (data)=>{
        console.log("1st ID: "+twoPlayers[0])
        console.log("2nd ID: "+twoPlayers[1])
        let nextPlayerId = getOtherString(currentPlayerId, twoPlayers)
        console.log("CURRENTrd ID: "+currentPlayerId)
        console.log("NEXT ID: "+nextPlayerId)
        currentPlayerId = nextPlayerId
        socket.emit("next_player_turn", nextPlayerId)
        socket.broadcast.emit("next_player_turn", nextPlayerId)

    })

})


server.listen(3001, () => {
    console.log('Server running on port 3001');
})