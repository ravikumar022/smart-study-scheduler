import React, { useState, useEffect } from 'react';

function Timer() {
  const WORK_TIME = 25 * 60;
  const SHORT_BREAK = 5 * 60;
  const LONG_BREAK = 15 * 60;
  const LONG_BREAK_INTERVAL = 4;

  const [seconds, setSeconds] = useState(WORK_TIME);
  const [isRunning, setIsRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [cycles, setCycles] = useState(0);
  const [phase, setPhase] = useState('Work');
  const [maxTime, setMaxTime] = useState(WORK_TIME);

  const radius = 80;
  const stroke = 10;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const progress = (seconds / maxTime) * circumference;

  const playSound = () => {
    const audio = new Audio('https://www.soundjay.com/buttons/beep-07.mp3');
    audio.play();
  };

  useEffect(() => {
    let interval = null;

    if (isRunning) {
      interval = setInterval(() => {
        setSeconds((prev) => {
          if (prev === 1) {
            clearInterval(interval);
            playSound();

            if (!isBreak) {
              const newCycles = cycles + 1;
              setCycles(newCycles);
              const isLong = newCycles % LONG_BREAK_INTERVAL === 0;
              const newTime = isLong ? LONG_BREAK : SHORT_BREAK;
              setSeconds(newTime);
              setMaxTime(newTime);
              setPhase(isLong ? 'Long Break' : 'Short Break');
              setIsBreak(true);
            } else {
              setSeconds(WORK_TIME);
              setMaxTime(WORK_TIME);
              setPhase('Work');
              setIsBreak(false);
            }

            setIsRunning(false);
            return prev;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isRunning, seconds, isBreak, cycles]);

  const format = (s) =>
    `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

  return (
    <div className="timer animated">
      <h2>⏳ Pomodoro Timer</h2>
      <h3>Phase: {phase}</h3>

      <div className="circle-container">
        <svg height={radius * 2} width={radius * 2}>
          <circle
            stroke="#e0e0e0"
            fill="transparent"
            strokeWidth={stroke}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
          <circle
            stroke={phase === 'Work' ? '#4caf50' : '#2196f3'}
            fill="transparent"
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={circumference + ' ' + circumference}
            strokeDashoffset={circumference - progress}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
            style={{ transition: 'stroke-dashoffset 1s linear' }}
          />
          <text
            x="50%"
            y="50%"
            textAnchor="middle"
            dy=".3em"
            fontSize="24"
            fill="#333"
          >
            {format(seconds)}
          </text>
        </svg>
      </div>

      <div style={{ margin: '10px 0' }}>
        <button onClick={() => setIsRunning(!isRunning)}>
          {isRunning ? 'Pause' : 'Start'}
        </button>
        <button
          onClick={() => {
            setIsRunning(false);
            setSeconds(WORK_TIME);
            setMaxTime(WORK_TIME);
            setIsBreak(false);
            setPhase('Work');
          }}
        >
          Reset
        </button>
      </div>

      <p>✅ Pomodoro Sessions Completed: {cycles}</p>
    </div>
  );
}

export default Timer;
