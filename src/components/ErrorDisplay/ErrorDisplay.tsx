interface ErrorDisplayProps {
  error: string;
  onClose?: () => void;
}

export const ErrorDisplay = ({ error, onClose }: ErrorDisplayProps) => {
  if (!error) return null;

  return (
    <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg flex justify-between items-start">
      <p className="flex-1">{error}</p>
      {onClose && (
        <button
          onClick={onClose}
          className="ml-4 text-red-700 hover:text-red-900 font-bold text-lg leading-none"
          aria-label="Close error message"
        >
          ×
        </button>
      )}
    </div>
  );
};
