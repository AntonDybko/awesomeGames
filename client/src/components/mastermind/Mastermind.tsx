import React, { useState, useEffect } from 'react';
import './Mastermind.scss';


const Mastermind: React.FC = () => {
  const [selectedColor, setSelectedColor] = useState<string>(''); 
  const [previousGuesses, setPreviousGuesses] = useState<string[][]>(Array.from({ length: 10 }, () => Array(4).fill('')));
  const [guess, setGuess] = useState<string[]>(Array(4).fill(''));
  const [remainingAttempts, setRemainingAttempts] = useState<number>(9);
  const [secretCode, setSecretCode] = useState<string[]>(Array(4).fill(''));
  const [scores, setScores] = useState<number[][]>(Array.from({ length: 10 }, () => Array(2).fill('')));
  const [gameResult, setGameResult] = useState<string>('');
  const [buttonDisable, setButtonDisable] = useState<boolean>(false);

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
      setButtonDisable(true);
    }

    setRemainingAttempts(remainingAttempts - 1);

    if (remainingAttempts === 0) {
      setGameResult('lose');
      setButtonDisable(true);
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
      <div className="mastermind">
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
          <h3>Scores</h3>

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
      </div>
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
