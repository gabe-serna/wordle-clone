# React Wordle Recreation

This project is a recreation of Wordle using React and Typescript.

## Getting Started

To run locally, clone the repository and perform the following command line actions:

```bash
npm init
npm run build
npm run preview
```

If you want to test this app in a development environment, configure the `handleNewWord` function like this:

```js
// Located at Line 15 in App.tsx
const handleNewWord = () => {
  generateWord(setMysteryWordArray, `seed`, `isOutputLogged`);
};
```

- Replace `seed` with any string to generate the same word every time.
- Replace `isOutputLogged` with a boolean value if you want the generated word to be logged in the console.

  _(both of these parameters are optional)_

Once you have finished configuring the word generation, run the following command line action:

```bash
npm run dev
```

## Usage

This app works identically to the game Wordle created by The New York Times. The goal of the game is to guess a randomly selected 5-letter word within 6 attempts. You may type letters either through your keyboard or clicking on the letters shown on-screen.

Once you have wrote out a guess, press `Enter` to submit the guess. If the guess is not a valid word you will be met with an error as shown below:

![example image of an invalid guess](https://cdn.discordapp.com/attachments/749955411456557056/1260381956147908608/Screenshot_13.png?ex=668f1dab&is=668dcc2b&hm=a34dcefdde8fba64ca7f24db970c5cbaf718e634447d5da7235461c4384a7b10&)

> _Figure 1- Example image of an invalid guess_

If your guess is a valid word, the letters in your guess will reveal whether they are contained in the mystery word or not.

- If the letter is **green** the letter is located in the word at that exact position.
- If the letter is **yellow**, the letter is located in the word but not at that position.
- If the letter is **grey**, the letter is not located in the word.

![example image of a full game](https://cdn.discordapp.com/attachments/749955411456557056/1260389226378166322/Screenshot_15.png?ex=668f2470&is=668dd2f0&hm=69cfa9b085595431aff084aec495980c78dd8e1da478dd8fc9986ce532e3d378&)

> _Figure 2- Example image of a full game_

Continue guessing words using the hints you are given until you either successfully guess the word or run out of guesses. If you run out of guesses, the word will be revealed to you in an alert.

Once the game is over, a popup will appear asking if you want to play another game. If you click on the restart button in the middle of the popup, the game board will be reset and another word will be randomly selected for you to guess.

![example image of the restart screen](https://cdn.discordapp.com/attachments/749955411456557056/1260390033261854830/Screenshot_16.png?ex=668f2530&is=668dd3b0&hm=747657fabe7d9d2d328a03341277ae14fb3dba7e8cfef56004538a6ceae13983&)

> _Figure 3- Example image of the restart screen_
#   w o r d l e  
 