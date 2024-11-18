type NoContentMessageProps = {
  message: string;
};

export const NoContentMessage = ({ message }: NoContentMessageProps) => {
  return (
    <div className="flex h-full items-center justify-center">
      <p className="text-gray-500">{message}</p>
    </div>
  );
};
