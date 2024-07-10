import { generate } from 'random-words';

const generateWord = (
  setState: React.Dispatch<React.SetStateAction<string[]>>,
  seed: string = '',
  isOutputLogged: boolean = false
) => {
  const options: {
    exactly: number;
    minLength: number;
    maxLength: number;
    seed: string;
  } = { exactly: 1, minLength: 5, maxLength: 5, seed: `${seed}` };

  const generatedWord = generate(options);
  setState(generatedWord[0].toUpperCase().split(''));

  if (isOutputLogged) console.log(generatedWord[0].toUpperCase());
};
export default generateWord;
