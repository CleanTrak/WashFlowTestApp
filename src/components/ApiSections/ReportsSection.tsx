import React, { useState } from "react";
import { Button } from "../ui/Button";
import { Card, JsonViewer } from "../ui/Card";
import type { TransactionReportParams } from "../../types";

interface ReportsSectionProps {
  onGetReports: (params?: TransactionReportParams) => void;
  isLoading: boolean;
  response?: string | object;
  error?: Error | null;
}

export const ReportsSection: React.FC<ReportsSectionProps> = ({
  onGetReports,
  isLoading,
  response,
  error,
}) => {
  const [params, setParams] = useState<Partial<TransactionReportParams>>({
    page: 1,
    pageSize: 10,
    period: "hourly",
    licence_plate: "",
    timefilter_start: "0000",
    timefilter_end: "2359",
  });

  const [dateRange, setDateRange] = useState({
    startDate: new Date().toISOString().split("T")[0],
    endDate: new Date().toISOString().split("T")[0],
  });

  const handleSubmit = () => {
    const reportParams: TransactionReportParams = {
      ...params,
      start_datetime: new Date(dateRange.startDate).toISOString(),
      end_datetime: new Date(dateRange.endDate + "T23:59:59").toISOString(),
      licence_plate: params.licence_plate || undefined,
    } as TransactionReportParams;

    onGetReports(reportParams);
  };

  const inputClass =
    "w-full border border-gray-300 rounded p-2 focus:border-blue-500 focus:outline-none";

  return (
    <Card title="Transaction Reports">
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Start Date
            </label>
            <input
              type="date"
              value={dateRange.startDate}
              onChange={(e) =>
                setDateRange((prev) => ({ ...prev, startDate: e.target.value }))
              }
              className={inputClass}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              End Date
            </label>
            <input
              type="date"
              value={dateRange.endDate}
              onChange={(e) =>
                setDateRange((prev) => ({ ...prev, endDate: e.target.value }))
              }
              className={inputClass}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Time Filter Start
            </label>
            <input
              type="text"
              value={params.timefilter_start}
              onChange={(e) =>
                setParams((prev) => ({
                  ...prev,
                  timefilter_start: e.target.value,
                }))
              }
              placeholder="0000"
              pattern="[0-9]{4}"
              className={inputClass}
            />
            <p className="text-xs text-gray-500 mt-1">
              Format: HHMM (e.g., 0800 for 8:00 AM)
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Time Filter End
            </label>
            <input
              type="text"
              value={params.timefilter_end}
              onChange={(e) =>
                setParams((prev) => ({
                  ...prev,
                  timefilter_end: e.target.value,
                }))
              }
              placeholder="2359"
              pattern="[0-9]{4}"
              className={inputClass}
            />
            <p className="text-xs text-gray-500 mt-1">
              Format: HHMM (e.g., 1800 for 6:00 PM)
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              License Plate (optional)
            </label>
            <input
              type="text"
              value={params.licence_plate}
              onChange={(e) =>
                setParams((prev) => ({
                  ...prev,
                  licence_plate: e.target.value,
                }))
              }
              placeholder="ABC123"
              className={inputClass}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Period
            </label>
            <select
              value={params.period}
              onChange={(e) =>
                setParams((prev) => ({ ...prev, period: e.target.value }))
              }
              className={inputClass}
            >
              <option value="hourly">Hourly</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Page
            </label>
            <input
              type="number"
              value={params.page}
              onChange={(e) =>
                setParams((prev) => ({
                  ...prev,
                  page: parseInt(e.target.value) || 1,
                }))
              }
              min="1"
              className={inputClass}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Page Size
            </label>
            <input
              type="number"
              value={params.pageSize}
              onChange={(e) =>
                setParams((prev) => ({
                  ...prev,
                  pageSize: parseInt(e.target.value) || 10,
                }))
              }
              min="1"
              max="100"
              className={inputClass}
            />
          </div>
        </div>

        <div>
          <Button
            onClick={handleSubmit}
            isLoading={isLoading}
            loadingText="Loading reports..."
            className="bg-gray-600 hover:bg-gray-700"
          >
            Get reports
          </Button>
        </div>

        {response && (
          <div>
            <h4 className="font-medium text-gray-700 mb-2">Response:</h4>
            <JsonViewer data={response} />
          </div>
        )}

        {error && (
          <div className="text-red-600 text-sm">
            <strong>Error:</strong> {error.message}
          </div>
        )}
      </div>
    </Card>
  );
};
