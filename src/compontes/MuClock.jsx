import { useState, useEffect } from 'react';
import './MuClock.css';

export default function MuClock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    // دالة تجيب الوقت الحقيقي للمكلا من الإنترنت
    const fetchMukallaTime = async () => {
      try {
        const res = await fetch('https://worldtimeapi.org/api/timezone/Asia/Aden');
        const data = await res.json();
        setTime(new Date(data.datetime));
      } catch (error) {
        // لو النت ضعيف، يرجع لوقت الجهاز مؤقتاً
        setTime(new Date());
      }
    };

    fetchMukallaTime(); // أول مرة
    
    // كل ثانية زود ثانية واحدة بدون ما نرجع للسيرفر
    const timer = setInterval(() => {
      setTime(prev => prev ? new Date(prev.getTime() + 1000) : new Date());
    }, 1000);

    // كل 5 دقائق صحح الوقت من السيرفر مرة ثانية
    const syncTimer = setInterval(fetchMukallaTime, 5 * 60 * 1000);

    return () => {
      clearInterval(timer);
      clearInterval(syncTimer);
    };
  }, []);

  if (!time) return <div>جاري تحميل توقيت المكلا...</div>;

  const seconds = time.getSeconds();
  const minutes = time.getMinutes();
  const hours = time.getHours();

  const secondDeg = (seconds / 60) * 360;
  const minuteDeg = (minutes / 60) * 360 + (seconds / 60) * 6;
  const hourDeg = (hours % 12) / 12 * 360 + (minutes / 60) * 30;

  const timeString = time.toLocaleTimeString('ar-EG', { hour12: false, timeZone: 'Asia/Aden' });

  return (
    <div className="mukalla-clock-wrapper">
      <div className="analog-card">
        <div className="analog-clock">
       {[...Array(12)].map((_, i) => {
         const number = i === 0? 12 : i; // لأن i يبدأ من 0، نحوله لـ 12
          return (
               <div key={i} className="hour-mark" style={{ transform: `rotate(${i * 30}deg)` }}>
               <div className="mark-line"></div>
               <span className="hour-number" style={{ transform: `rotate(-${i * 30}deg)` }}>
               {number}
               </span>
              </div>
                 );
      })}
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