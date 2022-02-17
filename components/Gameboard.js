import React, { useState, useEffect, useCallback } from 'react';
import { Text, View, Pressable } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import styles from '../style/style';

let dicesBoard = [];
let numberBoard = [];
const NBR_OF_DICES = 5;
const NBR_OF_THROWS = 3;
const BONUS_POINTS = 63;

export default function Gameboard() {
    const [nbrOfThrowsLeft, setNbrOfThrowsLeft] = useState(NBR_OF_THROWS);
    const [status, setStatus] = useState('');
    const [pointsNumber1, setPointsNumber1] = useState(0);
    const [pointsNumber2, setPointsNumber2] = useState(0);
    const [pointsNumber3, setPointsNumber3] = useState(0);
    const [pointsNumber4, setPointsNumber4] = useState(0);
    const [pointsNumber5, setPointsNumber5] = useState(0);
    const [pointsNumber6, setPointsNumber6] = useState(0);
    const [totalPoints, setTotalPoints] = useState(0);
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
        if (nbrOfThrowsLeft === NBR_OF_THROWS) {
            setStatus('Game has not started yet.');
        } else if (nbrOfThrowsLeft < 0) {
            setNbrOfThrowsLeft(NBR_OF_THROWS - 1);
        }
    }, [nbrOfThrowsLeft]);

    function getDiceColor(i) {
        return selectedDices[i] ? "black" : "steelblue";
    }
    function getNumberColor(i) {
        return selectedNumbers[i] ? "black" : "steelblue";
    }

    function selectDice(i) {
        let dices = [...selectedDices];
        dices[i] = selectedDices[i] ? false : true;
        setSelectedDices(dices);
    }

    function selectNumber(i) {
        let number = [...selectedNumbers];
        number[i] = selectedNumbers[i] ? false : true;
        setSelectedNumbers(number);
    }

    function throwDices() {
        for (let i = 0; i < NBR_OF_DICES; i++) {
            if (!selectedDices[i]) {
                let randomNumber = Math.floor(Math.random() * 6 + 1);
                dicesBoard[i] = 'dice-' + randomNumber;
            }
        }
        setNbrOfThrowsLeft(nbrOfThrowsLeft - 1);
    }



    return (
        <View style={styles.gameboard}>
            <View style={styles.flex}>{rowDices}</View>
            <Text style={styles.gameinfo}>Throws left: {nbrOfThrowsLeft}</Text>
            <Text style={styles.gameinfo}>{status}</Text>
            <Pressable
                style={styles.button}
                onPress={() => throwDices()}>
                <Text style={styles.buttonText}>Throw dices</Text>
            </Pressable>
            <View style={styles.flex}>{rowNumbers}</View>
        </View>
    )
}