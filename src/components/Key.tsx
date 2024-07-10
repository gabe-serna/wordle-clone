import { ForwardedRef, forwardRef, ReactNode } from 'react';

interface Props {
  children?: string | ReactNode;
  utility?: boolean;
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

const Key = forwardRef(
  ({ children, utility, onClick }: Props, ref: ForwardedRef<HTMLButtonElement>) => {
    return (
      <button
        tabIndex={-1}
        ref={ref}
        className={utility ? 'key utility' : 'key'}
        onClick={onClick}
        type='button'
        title='button'
      >
        {children}
      </button>
    );
  }
);

export default Key;
