interface Props {
  children?: string;
}

const Alert = ({ children }: Props) => {
  return <div className='alert hidden'>{children}</div>;
};

export default Alert;
