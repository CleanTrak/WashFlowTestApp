import React, { useState } from "react";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";
import type { MomentaryRequest } from "../../types";
import type { AxiosError } from "axios";

interface MomentaryProps {
  onSendMomentary: (data: MomentaryRequest) => void;
  isSending: boolean;
  response: string | object | null;
  error: Error | AxiosError | null;
}

export const Momentary: React.FC<MomentaryProps> = ({
  onSendMomentary,
  isSending,
  response,
  error,
}) => {
  const [momentaryNumbers, setMomentaryNumbers] = useState<string>("");

  const handleSubmit = () => {
    const numbers = momentaryNumbers
      .split(",")
      .map((n) => parseInt(n.trim()))
      .filter((n) => !isNaN(n));

    if (numbers.length > 0) {
      onSendMomentary({ momentary_numbers: numbers });
    }
  };

  const inputClass =
    "w-full border border-gray-300 rounded p-2 focus:border-blue-500 focus:outline-none";

  const isValid = momentaryNumbers.trim() !== "";

  return (
    <Card title="Momentary Control">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Momentary Numbers (comma-separated){" "}
            <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={momentaryNumbers}
            onChange={(e) => setMomentaryNumbers(e.target.value)}
            placeholder="12, 15, 18"
            className={inputClass}
            required
          />
          <p className="text-xs text-gray-500 mt-1">
            Enter momentary numbers separated by commas (e.g., 12, 15, 18)
          </p>
        </div>

        <div>
          <Button
            onClick={handleSubmit}
            isLoading={isSending}
            loadingText="Sending..."
            disabled={!isValid}
          >
            Send Momentary
          </Button>
        </div>

        {response && (
          <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded">
            <h4 className="font-medium text-green-800 mb-2">Response:</h4>
            <pre className="text-sm text-green-700 whitespace-pre-wrap">
              {typeof response === "object"
                ? JSON.stringify(response, null, 2)
                : response}
            </pre>
          </div>
        )}

        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded">
            <h4 className="font-medium text-red-800 mb-2">Error:</h4>
            <p className="text-sm text-red-700">{error.message}</p>
            <p className="text-sm text-red-700">
              {((error as AxiosError).response?.data as { error: string })
                .error}
            </p>
          </div>
        )}
      </div>
    </Card>
  );
};
