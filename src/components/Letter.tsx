import { ForwardedRef, forwardRef } from 'react';

interface Props {
  children?: string;
}

const Letter = forwardRef(
  ({ children }: Props, ref: ForwardedRef<HTMLDivElement>) => {
    return (
      <div ref={ref} className='letter'>
        {children}
      </div>
    );
  }
);

export default Letter;
