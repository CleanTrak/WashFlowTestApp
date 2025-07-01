import React from "react";

interface CardProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({
  title,
  children,
  className = "",
}) => {
  return (
    <div className={`bg-white rounded-lg shadow p-6 ${className}`}>
      {title && (
        <h3 className="text-lg font-semibold mb-4 text-gray-900">{title}</h3>
      )}
      <div>{children}</div>
    </div>
  );
};

interface JsonViewerProps {
  data: unknown;
  className?: string;
}

export const JsonViewer: React.FC<JsonViewerProps> = ({
  data,
  className = "",
}) => {
  const formattedData = React.useMemo(() => {
    try {
      return typeof data === "string" ? data : JSON.stringify(data, null, 2);
    } catch {
      return "";
    }
  }, [data]);

  if (!formattedData) return null;

  return (
    <pre
      className={`bg-gray-100 rounded p-4 overflow-auto text-sm ${className}`}
    >
      {formattedData}
    </pre>
  );
};
