type Props = {
  children?: React.ReactNode;
};
export const Gradient = ({ children }: Props) => {
  return (
    <span className="bg-gradient-to-b from-primary/60 to-primary text-transparent bg-clip-text">
      {children}
    </span>
  );
};