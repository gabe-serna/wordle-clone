import { useEffect, useState, useRef } from 'react';
import wordsArray from './config/words-array.tsx';
import generateWord from './config/options.ts';
import LetterRow from './components/LetterRow';
import Popup from './components/Popup.tsx';
import Letter from './components/Letter';
import KeyRow from './components/KeyRow';
import Header from './components/Header';
import Alert from './components/Alert';
import Key from './components/Key';
import React from 'react';

function App() {
  const [mysteryWordArray, setMysteryWordArray] = useState([] as string[]);
  const handleNewWord = () => {
    generateWord(setMysteryWordArray);
  };

  useEffect(() => {
    handleNewWord();
  }, []);

  const handleAlertMessage = (
    message: string,
    shakeRow: boolean = true,
    duration: number = 1.3
  ) => {
    const alert = document.querySelector('.alert') as HTMLElement;
    setAlertMessage(message);
    alert?.classList.add('fade-out');
    alert?.style.setProperty('animation-duration', `${duration}s`);
    alert?.classList.remove('hidden');
    if (shakeRow) {
      const row = rowRefs.current[focus[0]].current;
      row?.classList.add('shake-alert');
    }
  };

  const handlePopup = (condition: 'win' | 'lose') => {
    if (!popupRef.current) return;
    const popup = popupRef.current;
    const button = popup.children[0].children[1] as HTMLButtonElement;

    let pause: number;
    if (condition === 'win') {
      pause = 2500;
    } else {
      pause = 4500;
    }

    setTimeout(() => {
      popup.classList.add('popup-reveal');
    }, pause);
    setTimeout(() => {
      button.classList.add('spin');
    }, pause + 600);
  };

  const handleRestartButton = () => {
    setFocus([0, 0]);
    setGameBoard(
      Array.from({ length: 6 }, () => Array.from({ length: 5 }, () => ''))
    );
    letterRefs.current.forEach(row => {
      row.forEach(letter => {
        if (!letter.current) return;
        letter.current.innerHTML = '';
        letter.current.dataset.color = '';
        letter.current.classList.remove('green', 'yellow', 'grey');
      });
    });
    for (let i = 0; i < alphabet.length; i++) {
      const key = keyRefs[`${alphabet[i]}`];
      if (!key.current) continue;
      key.current?.classList.remove('green', 'yellow', 'grey');
      key.current.dataset.color = '';
    }
    handleNewWord();
    popupRef.current?.classList.add('popup-cover');
  };

  const checkWord = () => {
    // Validate Guess
    const guessArray: string[] = [];
    for (let i = 0; i <= 4; i++) {
      guessArray.push(
        rowRefs.current[focus[0]].current?.children[i].textContent as string
      );
    }
    const guess = guessArray.join('').toLowerCase();
    for (let i = 0; i < wordsArray.length; i++) {
      if (wordsArray[i] == guess) {
        break;
      }
      if (i == wordsArray.length - 1 && wordsArray[i] != guess) {
        handleAlertMessage('Not in word list');
        return 0;
      }
    }

    // Guess is Valid
    let counter = 0;
    for (let i = 0; i <= 4; i++) {
      const element = letterRefs.current[focus[0]][i].current as HTMLDivElement;
      counter = checkGuessLetters(guessArray, i, element, counter);
      element?.style.setProperty('animation-delay', `${i * 300}ms`);
      element?.classList.add('rotate-letter-start');
      const key = keyRefs[guessArray[i]] as React.RefObject<HTMLButtonElement>;
      key.current?.classList.add('animation-timer');
    }

    // If Guess is Correct
    const row = rowRefs.current[focus[0]].current as HTMLDivElement;
    if (counter == 5) {
      row.classList.add('animation-timer');
      setFocus([focus[0], 6]);
      return;
    }
    return 1;
  };

  const checkGuessLetters = (
    guess: string[],
    index: number,
    element: HTMLDivElement,
    counter: number
  ) => {
    const letterKey = keyRefs[
      element.innerHTML
    ] as React.RefObject<HTMLButtonElement>;

    for (let i = 0; i <= 4; i++) {
      if (guess[index] == mysteryWordArray[i]) {
        if (index == i) {
          element.dataset.color = 'green';
          if (letterKey.current != null) {
            letterKey.current.dataset.color = 'green';
            counter++;
            return counter;
          }
        } else {
          element.dataset.color = 'yellow';
          if (letterKey.current != null) {
            letterKey.current.dataset.color = 'yellow';
          }
        }
      }
    }

    if (!element.dataset.color) {
      element.dataset.color = 'grey';
      if (letterKey.current != null) {
        letterKey.current.dataset.color = 'grey';
      }
    }
    return counter;
  };

  const updateFocus = (amt: number) => {
    if (focus[1] == 6) return;
    // Move Focus Forward
    if (amt === 1) {
      const newFocus = [focus[0], focus[1] + 1];
      if (newFocus[1] >= 5) {
        newFocus[1] = 5;
      }
      setFocus(newFocus);
      return;
    }
    // Move Focus Back
    if (amt === -1) {
      const newFocus = [focus[0], focus[1] - 1];
      if (newFocus[1] < 0) {
        newFocus[1] = 0;
      }
      setFocus(newFocus);
      return;
    }
    // Move Focus to Next Row
    if (focus[1] <= 4) {
      handleAlertMessage('Not enough letters');
      return;
    }

    const validated = checkWord();
    if (!validated) {
      return;
    }
    const newFocus = [focus[0] + 1, 0];
    // If last guess is incorrect
    if (newFocus[0] == 6) {
      setTimeout(() => {
        handleAlertMessage(`${mysteryWordArray.join('')}`, false, 2.3);
      }, 2000);
      setFocus([4, 6]);
      handlePopup('lose');
      return;
    }
    setFocus(newFocus);
  };

  const handleLetterInput = (
    event: KeyboardEvent | React.MouseEvent<HTMLButtonElement>
  ) => {
    let key: string = '';
    if (event as React.MouseEvent<HTMLButtonElement>) {
      key = (event.target as HTMLButtonElement).textContent?.toUpperCase() as string;
    }
    if (event instanceof KeyboardEvent) {
      key = event.key.toUpperCase() as string;
    }
    if (!/^[a-zA-Z]$/.test(key)) {
      // Submit Word
      if (key == 'ENTER') {
        updateFocus(0);
        return;
      }

      // Go Back a Letter
      if (key == 'BACKSPACE' || key == '') {
        const newBoard = gameBoard;
        if (focus[1] > 0 && focus[1] < 6) {
          newBoard[focus[0]][focus[1] - 1] = '';
          const letter = letterRefs.current[focus[0]][focus[1] - 1].current;
          letter?.classList.remove('selected');
          setGameBoard(newBoard);
          updateFocus(-1);
        }
      }
      return;
    }

    // Add Letter
    if (focus[1] <= 4) {
      const newBoard = gameBoard;
      newBoard[focus[0]][focus[1]] = key.toUpperCase();
      setGameBoard(newBoard);
      const letter = letterRefs.current[focus[0]][focus[1]].current;
      letter?.classList.add('shake-small');
      letter?.classList.add('selected');
      updateFocus(1);
    }
  };

  const handleAnimationEnd = (event: AnimationEvent) => {
    const element = event.target as HTMLElement;
    element.classList.remove(
      'shake-small',
      'shake-alert',
      'animation-timer',
      'rotate-letter-end'
    );

    if (element.classList.contains('rotate-letter-start')) {
      element.style.setProperty('animation-delay', '0ms');
      element.classList.remove('selected', 'rotate-letter-start');
      element.classList.add(element.dataset.color as string, 'rotate-letter-end');
      return;
    }
    if (element.classList.contains('alert')) {
      element.classList.remove('fade-out');
      element.classList.add('hidden');
    }
    if (element.classList.contains('correct-guess')) {
      element.classList.remove('correct-guess');
      element.style.setProperty('animation-delay', '0ms');
    }
    if (element.classList.contains('popup-cover')) {
      element.classList.remove('popup-cover');
      element.classList.remove('popup-reveal');
      return;
    }
  };

  const handleAnimationStart = (event: AnimationEvent) => {
    const element = event.target as HTMLDivElement;
    if (element.classList.contains('animation-timer')) {
      if (element.classList.contains('key')) {
        element.classList.add(element.dataset.color as string);
        return;
      }

      for (let i = 0; i <= 4; i++) {
        const letter = element.children[i] as HTMLElement;
        letter.classList.add('correct-guess');
        letter.style.setProperty('animation-delay', `${i * 65}ms`);
      }
      let winStatement;
      switch (focus[0]) {
        case 0:
          winStatement = 'Genius';
          break;
        case 1:
          winStatement = 'Magnificent';
          break;
        case 2:
          winStatement = 'Impressive';
          break;
        case 3:
          winStatement = 'Splendid';
          break;
        case 4:
          winStatement = 'Great';
          break;
        case 5:
          winStatement = 'Phew';
      }
      handleAlertMessage(`${winStatement}`, false, 2.3);
      handlePopup('win');
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleLetterInput);
    window.addEventListener('animationend', handleAnimationEnd);
    window.addEventListener('animationstart', handleAnimationStart);

    return () => {
      window.removeEventListener('keydown', handleLetterInput);
      window.removeEventListener('animationend', handleAnimationEnd);
      window.removeEventListener('animationstart', handleAnimationStart);
    };
  });

  //Setting Up Gameboard and Refs
  const [gameBoard, setGameBoard] = useState(
    Array.from({ length: 6 }, () => Array.from({ length: 5 }, () => ''))
  );

  const [focus, setFocus] = useState([0, 0]);
  const [alertMessage, setAlertMessage] = useState('');
  const letterRefs = useRef(
    Array.from({ length: 6 }, () =>
      Array.from({ length: 5 }, () => React.createRef<HTMLDivElement>())
    )
  );
  const rowRefs = useRef(
    Array.from({ length: 6 }, () => React.createRef<HTMLDivElement>())
  );
  const popupRef = React.createRef<HTMLDivElement>();

  const alpha = Array.from(Array(26)).map((_e, i) => i + 65);
  const alphabet = alpha.map(x => String.fromCharCode(x));
  const keyRefs: { [key: string]: React.RefObject<HTMLButtonElement> } = {};
  for (let i = 0; i < alphabet.length; i++) {
    keyRefs[`${alphabet[i]}`] = React.createRef<HTMLButtonElement>();
  }
  const row1 = ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'];
  const row2 = ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'];
  const row3 = ['Z', 'X', 'C', 'V', 'B', 'N', 'M'];

  return (
    <>
      <Header />
      <section id='game-board'>
        {gameBoard.map((row, rowIndex) => (
          <LetterRow key={rowIndex} ref={rowRefs.current[rowIndex]}>
            {row.map((col, colIndex) => (
              <Letter
                key={`${rowIndex}${colIndex}`}
                ref={letterRefs.current[rowIndex][colIndex]}
                data-color
              >
                {col}
              </Letter>
            ))}
          </LetterRow>
        ))}
      </section>
      <Alert>{alertMessage}</Alert>
      <div id='keyboard'>
        <KeyRow>
          {row1.map(key => (
            <Key onClick={handleLetterInput} ref={keyRefs[key]} data-color>
              {key}
            </Key>
          ))}
        </KeyRow>
        <KeyRow>
          {row2.map(key => (
            <Key onClick={handleLetterInput} ref={keyRefs[key]} data-color>
              {key}
            </Key>
          ))}
        </KeyRow>
        <KeyRow>
          <Key onClick={handleLetterInput} utility={true}>
            Enter
          </Key>
          {row3.map(key => (
            <Key onClick={handleLetterInput} ref={keyRefs[key]} data-color>
              {key}
            </Key>
          ))}
          <Key onClick={handleLetterInput} utility={true}>
            <svg
              aria-hidden='true'
              xmlns='http://www.w3.org/2000/svg'
              height='20'
              viewBox='0 0 24 24'
              width='20'
            >
              <path
                fill='var(--white)'
                d='M22 3H7c-.69 0-1.23.35-1.59.88L0 12l5.41 8.11c.36.53.9.89 1.59.89h15c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H7.07L2.4 12l4.66-7H22v14zm-11.59-2L14 13.41 17.59 17 19 15.59 15.41 12 19 8.41 17.59 7 14 10.59 10.41 7 9 8.41 12.59 12 9 15.59z'
              ></path>
            </svg>
          </Key>
        </KeyRow>
      </div>
      <Popup key='popup' ref={popupRef} onButtonClick={handleRestartButton}>
        Would you like to play again?
      </Popup>
    </>
  );
}

export default App;
