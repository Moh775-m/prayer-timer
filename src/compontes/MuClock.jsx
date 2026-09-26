import { useState, useEffect } from 'react';
import './MuClock.css';

export default function MuClock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // حساب توقيت المكلا
  const mukallaTime = new Date(time.toLocaleString('en-US', { timeZone: 'Asia/Aden' }));
  
  const seconds = mukallaTime.getSeconds();
  const minutes = mukallaTime.getMinutes();
  const hours = mukallaTime.getHours();

  const secondDeg = (seconds / 60) * 360;
  const minuteDeg = (minutes / 60) * 360 + (seconds / 60) * 6;
  const hourDeg = (hours % 12) / 12 * 360 + (minutes / 60) * 30;

  const timeString = mukallaTime.toLocaleTimeString('ar-EG', { hour12: false });

  return (
    <div className="mukalla-clock-wrapper">
      <div className="analog-card">
        <div className="analog-header">توقيت المكلا الآن 🕌</div>
        
        <div className="analog-clock">
          {/* علامات الساعة */}
          {[...Array(12)].map((_, i) => (
            <div key={i} className="hour-mark" style={{ transform: `rotate(${i * 30}deg)` }}>
              <div className="mark-line"></div>
            </div>
          ))}

          <div className="hand hour-hand" style={{ transform: `rotate(${hourDeg}deg)` }}></div>
          <div className="hand minute-hand" style={{ transform: `rotate(${minuteDeg}deg)` }}></div>
          <div className="hand second-hand" style={{ transform: `rotate(${secondDeg}deg)` }}></div>
          <div className="center-dot"></div>
        </div>

        <div className="digital-time">{timeString}</div>
      </div>
    </div>
  );
}