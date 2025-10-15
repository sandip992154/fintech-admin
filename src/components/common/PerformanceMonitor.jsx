/**
 * Performance Monitor Component
 * Provides insights into component rendering and API performance
 */
import React, { useState, useEffect, useMemo } from "react";
import { FiActivity, FiClock, FiRefreshCw, FiTrendingUp } from "react-icons/fi";

const PerformanceMonitor = ({
  isEnabled = false,
  position = "bottom-right",
  apiMetrics = {},
  renderMetrics = {},
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [metrics, setMetrics] = useState({
    renderCount: 0,
    lastRenderTime: Date.now(),
    avgRenderTime: 0,
    apiCalls: 0,
    cacheHits: 0,
    errorCount: 0,
  });

  const performanceData = useMemo(() => {
    const cacheHitRate =
      metrics.apiCalls > 0
        ? ((metrics.cacheHits / metrics.apiCalls) * 100).toFixed(1)
        : 0;

    return {
      ...metrics,
      cacheHitRate,
      errorRate:
        metrics.apiCalls > 0
          ? ((metrics.errorCount / metrics.apiCalls) * 100).toFixed(1)
          : 0,
    };
  }, [metrics]);

  useEffect(() => {
    if (isEnabled) {
      setMetrics((prev) => ({
        ...prev,
        ...apiMetrics,
        ...renderMetrics,
        renderCount: prev.renderCount + 1,
        lastRenderTime: Date.now(),
      }));
    }
  }, [isEnabled, apiMetrics, renderMetrics]);

  if (!isEnabled) return null;

  const positionStyles = {
    "top-right": { top: "20px", right: "20px" },
    "top-left": { top: "20px", left: "20px" },
    "bottom-right": { bottom: "20px", right: "20px" },
    "bottom-left": { bottom: "20px", left: "20px" },
  };

  return (
    <div
      className={`fixed z-50 bg-gray-900 text-white rounded-lg p-3 shadow-lg transition-all duration-300 ${
        isVisible ? "opacity-95" : "opacity-30 hover:opacity-95"
      }`}
      style={positionStyles[position]}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      <div className="flex items-center gap-2 mb-2">
        <FiActivity className="text-green-400" />
        <span className="text-sm font-semibold">Performance</span>
      </div>

      {isVisible && (
        <div className="space-y-2 text-xs">
          <div className="flex items-center justify-between gap-3">
            <span className="flex items-center gap-1">
              <FiRefreshCw size={12} />
              Renders:
            </span>
            <span className="text-green-400">
              {performanceData.renderCount}
            </span>
          </div>

          <div className="flex items-center justify-between gap-3">
            <span className="flex items-center gap-1">
              <FiClock size={12} />
              API Calls:
            </span>
            <span className="text-blue-400">{performanceData.apiCalls}</span>
          </div>

          <div className="flex items-center justify-between gap-3">
            <span className="flex items-center gap-1">
              <FiTrendingUp size={12} />
              Cache Hit:
            </span>
            <span className="text-yellow-400">
              {performanceData.cacheHitRate}%
            </span>
          </div>

          {performanceData.errorCount > 0 && (
            <div className="flex items-center justify-between gap-3">
              <span>Errors:</span>
              <span className="text-red-400">{performanceData.errorCount}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PerformanceMonitor;
