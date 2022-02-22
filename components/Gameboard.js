import React, { useState, useEffect, useCallback } from 'react';
import { Text, View, Pressable } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Col, Row, Grid } from "react-native-easy-grid";
import styles from '../style/style';

let dicesBoard = [];

let numberBoard = [];
const NBR_OF_DICES = 5;
const NBR_OF_THROWS = 3;
const BONUS_POINTS = 63;

export default function Gameboard() {
    const [nbrOfThrowsLeft, setNbrOfThrowsLeft] = useState(NBR_OF_THROWS);
    const [status, setStatus] = useState('');
    const [totalPoints, setTotalPoints] = useState(0);
    const [turns, setTurns] = useState(0);

    const [pointsNumber, setPointsNumber] =
        useState(new Array(6).fill(0));
    const [selectedDices, setSelectedDices] =
        useState(new Array(NBR_OF_DICES).fill(false));
    const [selectedNumbers, setSelectedNumbers] =
        useState(new Array(6).fill(false));

    const rowDices = [];
    for (let i = 0; i < NBR_OF_DICES; i++) {
        rowDices.push(
            <Pressable
                key={"rowDices" + i}
                onPress={() => selectDice(i)}>
                <MaterialCommunityIcons
                    name={dicesBoard[i]}
                    key={"rowDices" + i}
                    size={50}
                    color={getDiceColor(i)}>
                </MaterialCommunityIcons>
            </Pressable>
        )
    }

    const rowNumbers = [];
    for (let i = 1; i <= 6; i++) {
        numberBoard[i] = 'numeric-' + i + '-circle';
        rowNumbers.push(
            <Pressable
                key={"rowNumbers" + i}
                onPress={() => selectNumber(i)}
            >
                <MaterialCommunityIcons
                    name={numberBoard[i]}
                    key={"rowNumbers" + i}
                    size={50}
                    color={getNumberColor(i)}
                >
                </MaterialCommunityIcons>
            </Pressable>
        )
    }

    useEffect(() => {
        //checkWinner();
        if (turns < 6) {
        if (nbrOfThrowsLeft === NBR_OF_THROWS) {
            setStatus('Throw dices.');
            setSelectedDices([]);
        } else if (nbrOfThrowsLeft < NBR_OF_THROWS && nbrOfThrowsLeft > 0) {
            setStatus("Select and throw dices again.")
        } else if (nbrOfThrowsLeft < 0) {
            setNbrOfThrowsLeft(NBR_OF_THROWS);
        } else {
            setStatus("Select your points.")
        }
    } else {
        setStatus("Game over. All points selected.");
        setSelectedDices([]);
    }
    }, [nbrOfThrowsLeft, turns]);

    function getDiceColor(i) {
        return selectedDices[i] ? "black" : "steelblue";
    }
    function getNumberColor(i) {
        return selectedNumbers[i] ? "black" : "steelblue";
    }

    function selectDice(i) {
        if (nbrOfThrowsLeft === NBR_OF_THROWS) {
            setStatus("You have to throw the dices first.");
        } else if (nbrOfThrowsLeft === 0 && turns === 6) {
            setStatus("Please restart the game first.");
        }else {
            let dices = [...selectedDices];
            dices[i] = selectedDices[i] ? false : true;
            setSelectedDices(dices);
            console.log(nbrOfThrowsLeft);   
        } 
    }

    function selectNumber(i) {
        let number = [...selectedNumbers];
        number[i] = selectedNumbers[i] ? false : true;
        
        if (number[i] === false) {
            setStatus("You already selected points for " + `${i}`);
        }
        else if (nbrOfThrowsLeft > 0) {
            setStatus("Throw 3 times before setting points");
        } 
        else {
            
            setSelectedNumbers(number);
            let currentSelection = 'dice-' + i;
        
            let numberOfPoints = 0;
            for (let x = 0; x < NBR_OF_DICES; x++) {
                if (currentSelection === dicesBoard[x]){
                 numberOfPoints = numberOfPoints + i;
            
        }           
        pointsNumber[i-1] = numberOfPoints;
        setTotalPoints(totalPoints + numberOfPoints);
        if (turns < 5) {
            setNbrOfThrowsLeft(NBR_OF_THROWS);  
        } 
        setTurns(turns + 1);
        console.log(turns); 
        }
        } 
}

    function throwDices() {
        if(nbrOfThrowsLeft === 0 && turns < 6){
            setStatus("Select your points before next throw");
        } else {
        for (let i = 0; i < NBR_OF_DICES; i++) {
            if (!selectedDices[i]) {
                let randomNumber = Math.floor(Math.random() * 6 + 1);
                dicesBoard[i] = 'dice-' + randomNumber;
            }
        }    
        setNbrOfThrowsLeft(nbrOfThrowsLeft - 1);    
    }
}

    function startNewGame () {
        setTurns(0);
        setNbrOfThrowsLeft(3);
        setSelectedNumbers(new Array(6).fill(false));
        setPointsNumber(new Array(6).fill(0));
        setSelectedDices(new Array(NBR_OF_DICES).fill(false));
        setTotalPoints(0);
        dicesBoard = [];
    }

    function renderButton() {
        if(turns != 6) {
            return (
                <Pressable
                style={styles.button}
                onPress={() => throwDices()}>
                <Text style={styles.buttonText}>Throw dices</Text>
            </Pressable>
            )
        } else {
            return (
            <Pressable
                style={styles.button}
                onPress={() => startNewGame()}>
                <Text style={styles.buttonText}>Restart game</Text>
            </Pressable>
            )
        }
    }

    

   
    return (
        <View style={styles.gameboard}>
            <View style={styles.flex}>{rowDices}</View>
            <Text style={styles.gameinfo}>Throws left: {nbrOfThrowsLeft}</Text>
            <Text style={styles.gameinfo}>{status}</Text>
            <View>{renderButton()}</View>
            <Text style={styles.total}>Total: {totalPoints}</Text>
            {(BONUS_POINTS - totalPoints) <= 0}
            <Text style={styles.gameinfo}>
                {(BONUS_POINTS-totalPoints) <= 0 ? "You got the bonus!" : `You are ${BONUS_POINTS -totalPoints} points away from bonus`}
            </Text>
            <Grid>
                <Row>
                    <Col style={styles.pointsForEachNumber}>{pointsNumber[0]}{rowNumbers[0]}</Col>
                    <Col style={styles.pointsForEachNumber}>{pointsNumber[1]}{rowNumbers[1]}</Col>
                    <Col style={styles.pointsForEachNumber}>{pointsNumber[2]}{rowNumbers[2]}</Col>
                    <Col style={styles.pointsForEachNumber}>{pointsNumber[3]}{rowNumbers[3]}</Col>
                    <Col style={styles.pointsForEachNumber}>{pointsNumber[4]}{rowNumbers[4]}</Col>
                    <Col style={styles.pointsForEachNumber}>{pointsNumber[5]}{rowNumbers[5]}</Col>
                </Row>                
            </Grid>
            
        </View>
    )
}