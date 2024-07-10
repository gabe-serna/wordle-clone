import { ForwardedRef, ReactNode, forwardRef } from 'react';

interface Props {
  children?: ReactNode;
}

const LetterRow = forwardRef(
  ({ children }: Props, ref: ForwardedRef<HTMLDivElement>) => {
    return (
      <div ref={ref} className='letter-row'>
        {children}
      </div>
    );
  }
);

export default LetterRow;
