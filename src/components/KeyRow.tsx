import { ForwardedRef, ReactNode, forwardRef } from 'react';

interface Props {
  children?: ReactNode;
}

const KeyRow = forwardRef(
  ({ children }: Props, ref: ForwardedRef<HTMLDivElement>) => {
    return (
      <div ref={ref} className='key-row'>
        {children}
      </div>
    );
  }
);

export default KeyRow;
