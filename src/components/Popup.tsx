import { ForwardedRef, forwardRef } from 'react';

interface Props {
  children: string;
  onButtonClick: () => void;
}

const Popup = forwardRef(
  ({ children, onButtonClick }: Props, ref: ForwardedRef<HTMLDivElement>) => {
    return (
      <div ref={ref} className='popup'>
        <div className='popup-center'>
          <p>{children}</p>
          <button type='button' onClick={onButtonClick}>
            <span>↻</span>
          </button>
        </div>
      </div>
    );
  }
);

export default Popup;
