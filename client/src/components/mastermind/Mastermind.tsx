import React, { useState, useEffect } from 'react';
import axios from 'axios-config/axios';
import './Mastermind.scss';
import useAuth from "hooks/useAuth";

const apiUrl = "http://localhost:5000";

const Mastermind: React.FC = () => {
  const { auth } = useAuth();
  const [start, setStart] = useState<number>(0);
  const [end, setEnd] = useState<number>(0);
  const [consent, setConsent] = useState<Boolean>(false);
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [previousGuesses, setPreviousGuesses] = useState<string[][]>(Array.from({ length: 10 }, () => Array(4).fill('')));
  const [guess, setGuess] = useState<string[]>(Array(4).fill(''));
  const [remainingAttempts, setRemainingAttempts] = useState<number>(9);
  const [secretCode, setSecretCode] = useState<string[]>(Array(4).fill(''));
  const [scores, setScores] = useState<number[][]>(Array.from({ length: 10 }, () => Array(2).fill('')));
  const [maxBlack, setMaxBlack] = useState<number>(0);
  const [maxWhite, setMaxWhite] = useState<number>(0);
  const [gameResult, setGameResult] = useState<string>('');
  const [buttonDisable, setButtonDisable] = useState<boolean>(false);

  const startGame = () => {
    setStart(Date.now());
    setConsent(true);
  }

  const calculateScore = () => {
    const winMultiplier = 100000000;
    const blackMultiplier = 10000000;
    const whiteMultiplier = 1000000;
    const time = end - start;

    if (gameResult === 'win') {
      return (8 + remainingAttempts) * winMultiplier / time;
    } else {
      return (maxBlack * blackMultiplier + maxWhite * whiteMultiplier) / time;
    }
  }

  const checkScoreAndUpdateMax = (score: number[]) => {
    if (score[0] > maxBlack) {
      setMaxBlack(score[0]);
    }
    if (score[1] > maxWhite) {
      setMaxWhite(score[1]);
    }
  }

  const save = async () => {
    try {
      const data = {
        gamename: "mastermind",
        score: calculateScore(),
      }
      const config = {
        headers: {
          Authorization: `Bearer ${auth.token}`,
          'Content-Type': 'application/json',
        },
      };
      await axios.post(`${apiUrl}/users/profile/${auth.username}/scores`, data, config);

    } catch (error) {
      console.error('Cannot save score due to the following error occurence:', error);
    }
  }

  const endGame = () => {
    setEnd(Date.now);
    setButtonDisable(true);
  }

  useEffect(() => {
    if (end > 0) {
      save();
    }
  }, [end]);

  const colors = ['gold', 'red', 'springgreen', 'limegreen', 'skyblue', 'royalblue', 'fuchsia', 'mediumpurple',];

  const handleColorSelect = (color: string) => {
    setSelectedColor(color);
  };

  const handleAlterGuess = (col: number) => {
    const updatedGuess = [...guess];
    updatedGuess[col] = selectedColor;
    setGuess(updatedGuess);
  };

  // dodaje ruch do historii ruchów
  const handleAddGuess = (guess: string[], i: number) => {
    setPreviousGuesses((prevState) => {
      return prevState.map((row, index) => {
        if (index === i) {
          return guess;
        }
        return row;
      })
    })
  };

  // dodaje wynik do histori wynikow
  const handleAddScore = (score: number[], i: number) => {
    checkScoreAndUpdateMax(score);

    setScores((prevState) => {
      return prevState.map((row, index) => {
        if (index === i) {
          return score;
        }
        return row;
      })
    });
  };

  const handleNewGuess = () => {
    handleAddGuess(guess, remainingAttempts);

    const result = checkGuess();
    handleAddScore(result, remainingAttempts);

    setGuess(Array(4).fill(''));

    if (result[0] === 4) {
      setGameResult('win');
      endGame();
    }

    setRemainingAttempts(remainingAttempts - 1);

    if (remainingAttempts === 0) {
      setGameResult('lose');
      endGame();
    }
  }

  // zwraca tablice z dwiema wartościami: liczba odgadniętych kolorów i liczba kolorów na złej pozycji 
  const checkGuess = (): number[] => {
    let tmpGuess = [...guess];
    let tmpSecret = [...secretCode];
    let correct = 0;
    let misplaced = 0;

    for (let i = 0; i < tmpSecret.length; i++) {
      if (tmpSecret[i] === tmpGuess[i]) {
        correct++;
        tmpSecret[i] = "";
        tmpGuess[i] = "";
      }
    }

    for (let i = 0; i < tmpSecret.length; i++) {
      if (tmpGuess[i] === "") continue;

      const indexInSecretCode = tmpSecret.indexOf(guess[i]);

      if (indexInSecretCode !== -1) {
        misplaced++;
        tmpSecret[indexInSecretCode] = ""
      }
    }
    return [correct, misplaced];
  };

  // resetuje wszystkie dane
  const newGame = () => {
    setConsent(false);
    setSelectedColor('');
    setPreviousGuesses(Array.from({ length: 10 }, () => Array(4).fill('')));
    setGuess(Array(4).fill(''));
    setRemainingAttempts(9);
    setSecretCode(generateSecretCode());
    setScores(Array.from({ length: 10 }, () => Array(2).fill('')));
    setGameResult('');
    setButtonDisable(false);
  }

  // dla testów. pokazuje rozwiązanie
  const test = () => {
    // console.log('Auth:', auth);
    console.log(secretCode);
  }

  const generateSecretCode = (): string[] => {
    const secretCode = [];
    for (let i = 0; i < 4; i++) {
      const randomIndex = Math.floor(Math.random() * colors.length);
      secretCode.push(colors[randomIndex]);
    }
    return secretCode;
  };

  useEffect(() => {
    setSecretCode(generateSecretCode());
  }, []);

  return (
    <div>
      {consent === false && <div>
        <span>Ready?</span>
        <span>Set...</span>
        <button onClick={startGame}>Go!</button>
      </div>}
      {consent === true && <div className="mastermind">
        <div className="color-picker">
          <h3>Color Picker</h3>
          <div className="color-column">
            {colors.map((color, index) => (
              <div
                key={index}
                className={`color-option ${selectedColor === color ? 'selected' : ''}`}
                style={{ backgroundColor: color }}
                onClick={() => handleColorSelect(color)}
              ></div>
            ))}
          </div>
        </div>

        <div className="mm-main">
          <h3>Previous Guesses</h3>
          <div>
            <h3>Scores</h3>
            <div className="mm-sub-header">
              <p>Black</p>
              <p>White</p>
            </div>
          </div>

          <table className="mm-table">
            <tbody>
              {previousGuesses.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {row.map((cell, colIndex) => (
                    <td
                      key={colIndex}
                      style={{ backgroundColor: cell }}
                    ></td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          <table className="mm-table">
            <tbody>
              {scores.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {row.map((cell, colIndex) => (
                    <td
                      key={colIndex}
                    >{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>

          <table className="mm-table">
            <tbody>
              <tr>
                {guess.map((cell, colIndex) => (
                  <td
                    key={colIndex}
                    style={{ backgroundColor: cell }}
                    onClick={() => handleAlterGuess(colIndex)}
                  ></td>
                ))}
              </tr>
            </tbody>
          </table>
          <div>
            <button disabled={buttonDisable} onClick={handleNewGuess}>Submit</button>
            <button onClick={newGame}>New Game</button>
          </div>
          <button onClick={test}>Test</button>
        </div>
      </div>}
      {gameResult === 'win' &&
        <h2>Yay! You guessed the secret code!</h2>
      }
      {gameResult === 'lose' &&
        <h2>Game over! You have run out of attempts. Better luck next time!</h2>
      }
    </div>
  );
};

export default Mastermind;
