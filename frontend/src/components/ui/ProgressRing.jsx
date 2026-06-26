import React, { useRef, useEffect } from 'react';

/**
 * SVG circular progress ring — faithful to the Stitch Download Status design.
 */
export function ProgressRing({
  percent,
  size = 288,
  strokeWidth = 12,
  label,
  sublabel,
  className = '',
}) {
  const center = size / 2;
  const radius = center - strokeWidth / 2;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.min(100, Math.max(0, percent));
  const offset = circumference - (clamped / 100) * circumference;

  const circleRef = useRef(null);

  useEffect(() => {
    if (circleRef.current) {
      circleRef.current.style.strokeDashoffset = String(offset);
    }
  }, [offset]);

  return (
    <div
      className={`relative flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
      role="progressbar"
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={`Download progress: ${Math.floor(clamped)}%`}
    >
      <svg width={size} height={size} className="w-full h-full">
        {/* Track */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="transparent"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-surface-container-highest dark:text-dark-surface-container"
        />
        {/* Progress */}
        <circle
          ref={circleRef}
          cx={center}
          cy={center}
          r={radius}
          fill="transparent"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference}
          className="progress-ring__circle text-primary"
        />
      </svg>
      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className="font-display-lg text-display-lg text-primary leading-none">
          {Math.floor(clamped)}%
        </span>
        {sublabel && (
          <span className="font-label-md text-label-md text-secondary tracking-widest uppercase mt-2">
            {sublabel}
          </span>
        )}
        {label && (
          <span className="font-body-md text-body-md text-on-surface-variant mt-1">{label}</span>
        )}
      </div>
    </div>
  );
}
