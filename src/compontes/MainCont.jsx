import Grid from '@mui/material/Grid';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Prayer from './Prayer';
import { useState, useEffect } from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import CircularProgress from '@mui/material/CircularProgress';
import './MainCont.css';

const CITIES = [
  { label: 'عدن', value: 'Aden' },
  { label: 'المكلا', value: 'Mukalla' },
  { label: 'صنعاء', value: 'Sanaa' },
];

export default function MainCont() {
  const [city, setCity] = useState('Aden');
  const [timings, setTimings] = useState(null);
  const [dateInfo, setDateInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [nextPrayerName, setNextPrayerName] = useState('');
  const [timeLeft, setTimeLeft] = useState('');
  const [nextPrayerIndex, setNextPrayerIndex] = useState(null);

  useEffect(() => {
    const fetchPrayerTimes = async () => {
      setLoading(true);
      try {
        const today = new Date();
        const dateStr = `${String(today.getDate()).padStart(2,'0')}-${String(today.getMonth()+1).padStart(2,'0')}-${today.getFullYear()}`;
        const res = await fetch(`https://api.aladhan.com/v1/timingsByCity/${dateStr}?city=${city}&country=YE&method=3`);
        const data = await res.json();
        if (data.code === 200) {
          setTimings(data.data.timings);
          setDateInfo(data.data.date);
        } else setError('تعذّر جلب المواقيت');
      } catch { setError('خطأ في الاتصال'); } finally { setLoading(false); }
    };
    fetchPrayerTimes();
  }, [city]);

  useEffect(() => {
    if (!timings) return;
    const order = [{k:'Fajr',n:'الفجر'},{k:'Dhuhr',n:'الظهر'},{k:'Asr',n:'العصر'},{k:'Maghrib',n:'المغرب'},{k:'Isha',n:'العشاء'}];
    const calc = () => {
      const now = new Date();
      for (let i=0; i<order.length; i++) {
        const [h,m] = timings[order[i].k].split(':');
        const d = new Date(); d.setHours(h,m,0,0);
        if (d > now) {
          setNextPrayerName(order[i].n); setNextPrayerIndex(i);
          const diff = d - now;
          setTimeLeft(`${String(Math.floor(diff/3600000)).padStart(2,'0')}:${String(Math.floor(diff%3600000/60000)).padStart(2,'0')}:${String(Math.floor(diff%60000/1000)).padStart(2,'0')}`);
          return;
        }
      }
      const [h,m] = timings.Fajr.split(':');
      const d = new Date(); d.setDate(d.getDate()+1); d.setHours(h,m,0,0);
      setNextPrayerName('الفجر'); setNextPrayerIndex(0);
      const diff = d - now;
      setTimeLeft(`${String(Math.floor(diff/3600000)).padStart(2,'0')}:${String(Math.floor(diff%3600000/60000)).padStart(2,'0')}:${String(Math.floor(diff%60000/1000)).padStart(2,'0')}`);
    };
    calc(); const id = setInterval(calc,1000); return ()=>clearInterval(id);
  }, [timings]);

  const cityLabel = CITIES.find(c=>c.value===city)?.label || city;
  // حل مشكلة undefined
  const hijriDate = dateInfo?.hijri?.date || ''; // مثل "15 ربيع الثاني 1448"
  const gregorianDate = dateInfo?.gregorian?.date || '...';

  return (
    <div className="main-container">

      {/* HEADER الجديد المرتب */}
      <div className="header-new">
        <div className="header-top">
          <p className="header-title">مواقيت الصلاة</p>
          <h1 className="header-city">{cityLabel} - اليمن</h1>
        </div>
        <div className="header-dates">
          <span className="date-gregorian">{gregorianDate}</span>
          <span className="date-separator">|</span>
          <span className="date-hijri">{hijriDate} هـ</span>
        </div>
      </div>

      <Divider className="divider" />

      {timings &&!loading && (
        <div className="countdown-container">
          <p className="countdown-label">متبقي على صلاة {nextPrayerName}</p>
          <h1 className="countdown-time">{timeLeft}</h1>
        </div>
      )}

      {loading? <Stack alignItems="center" className="loading-box"><CircularProgress className="loading-spinner"/></Stack> :
       error? <Stack alignItems="center" className="loading-box"><h3 className="error-text">{error}</h3></Stack> :
        <Stack direction="row" spacing={2} className="prayers-stack">
          <div className={nextPrayerIndex===0?'active-prayer':''}><Prayer name="الفجر" time={timings?.Fajr} image="https://blog.ajsrp.com/wp-content/uploads/2025/05/%D9%81%D8%B6%D8%A7%D8%A6%D9%84-%D8%B5%D9%84%D8%A7%D8%A9-%D8%A7%D9%84%D9%81%D8%AC%D8%B1-1024x585.jpeg" /></div>
          <div className={nextPrayerIndex===1?'active-prayer':''}><Prayer name="الظهر" time={timings?.Dhuhr} image="https://tse2.mm.bing.net/th/id/OIP.f9mdujSaLryM_YC5lfnvjQHaEO?r=0&rs=1&pid=ImgDetMain&o=7&rm=3" /></div>
          <div className={nextPrayerIndex===2?'active-prayer':''}><Prayer name="العصر" time={timings?.Asr} image="https://tse3.mm.bing.net/th/id/OIP.-4X3YYLLxZ9ijgPDu2kbFAHaEJ?r=0&rs=1&pid=ImgDetMain&o=7&rm=3" /></div>
          <div className={nextPrayerIndex===3?'active-prayer':''}><Prayer name="المغرب" time={timings?.Maghrib} image="https://tse3.mm.bing.net/th/id/OIP.Djf8zKA8cXusfYS80Fc65wHaE8?r=0&rs=1&pid=ImgDetMain&o=7&rm=3" /></div>
          <div className={nextPrayerIndex===4?'active-prayer':''}><Prayer name="العشاء" time={timings?.Isha} image="https://tse4.mm.bing.net/th/id/OIP.n3jVzC9iMTkjtcKpaAVgFwHaEO?r=0&rs=1&pid=ImgDetMain&o=7&rm=3" /></div>
        </Stack>
      }

      <Stack direction="row" className="city-select-wrapper">
        <FormControl className="city-select-control">
          <InputLabel className="city-label">المدينة</InputLabel>
          <Select value={city} label="المدينة" onChange={(e)=>setCity(e.target.value)}>
            {CITIES.map(c=><MenuItem key={c.value} value={c.value}>{c.label}</MenuItem>)}
          </Select>
        </FormControl>
      </Stack>
    </div>
  );
}