import Grid from '@mui/material/Grid';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Prayer from './Prayer';
import * as React from 'react';
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
  
  // حالات العداد
  const [nextPrayerName, setNextPrayerName] = useState('');
  const [timeLeft, setTimeLeft] = useState('');
  const [nextPrayerIndex, setNextPrayerIndex] = useState(null);

  useEffect(() => {
    const fetchPrayerTimes = async () => {
      setLoading(true);
      setError(null);
      try {
        const today = new Date();
        const day = String(today.getDate()).padStart(2, '0');
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const year = today.getFullYear();
        const dateStr = `${day}-${month}-${year}`;

        const res = await fetch(
          `https://api.aladhan.com/v1/timingsByCity/${dateStr}?city=${city}&country=YE&method=3`
        );
        const data = await res.json();
        if (data.code === 200) {
          setTimings(data.data.timings);
          setDateInfo(data.data.date);
        } else {
          setError('تعذّر جلب مواقيت الصلاة');
        }
      } catch (e) {
        setError('حدث خطأ أثناء الاتصال بالخادم');
      } finally {
        setLoading(false);
      }
    };
    fetchPrayerTimes();
  }, [city]);

  // منطق العداد كل ثانية
  useEffect(() => {
    if (!timings) return;

    const prayersOrder = [
      { key: 'Fajr', name: 'الفجر' },
      { key: 'Dhuhr', name: 'الظهر' },
      { key: 'Asr', name: 'العصر' },
      { key: 'Maghrib', name: 'المغرب' },
      { key: 'Isha', name: 'العشاء' },
    ];

    const calculateTimeLeft = () => {
      const now = new Date();
      
      for (let i = 0; i < prayersOrder.length; i++) {
        const prayerTimeStr = timings[prayersOrder[i].key]; // مثلا "04:45"
        const [hours, minutes] = prayerTimeStr.split(':');
        const prayerDate = new Date();
        prayerDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);

        if (prayerDate > now) {
          setNextPrayerName(prayersOrder[i].name);
          setNextPrayerIndex(i);
          const diff = prayerDate - now;
          const h = Math.floor(diff / (1000 * 60 * 60));
          const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
          const s = Math.floor((diff % (1000 * 60)) / 1000);
          setTimeLeft(`${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`);
          return;
        }
      }
      // لو كل الصلوات خلصت، القادمة فجر بكرة
      const tomorrowFajr = timings['Fajr'];
      const [hours, minutes] = tomorrowFajr.split(':');
      const prayerDate = new Date();
      prayerDate.setDate(prayerDate.getDate() + 1);
      prayerDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);
      
      setNextPrayerName('الفجر');
      setNextPrayerIndex(0);
      const diff = prayerDate - now;
      const h = Math.floor(diff / (1000 * 60 * 60));
      const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((diff % (1000 * 60)) / 1000);
      setTimeLeft(`${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`);
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(interval);

  }, [timings]);

  const cityLabel = CITIES.find((c) => c.value === city)?.label || city;

  return (
    <div className="main-container">
      <Grid container className="header-grid">
        <Grid item xs={6}>
          <div className="date-box-left">
            <p className="date-label">مواقيت الصلاة</p>
            <h1 className="date-value">{dateInfo?.gregorian?.date || '...'}</h1>
          </div>
        </Grid>
        <Grid item xs={6}>
          <div className="date-box-right">
            <p className="date-label">
              {dateInfo?.hijri ? `${dateInfo.hijri.day.ar} ${dateInfo.hijri.month.ar} ${dateInfo.hijri.year} هـ` : '...'}
            </p>
            <h1 className="date-value">{cityLabel} - اليمن</h1>
          </div>
        </Grid>
      </Grid>

      <Divider className="divider" />

      {/* ===== العداد الجديد هنا ===== */}
      {timings && !loading && (
        <div className="countdown-container">
          <p className="countdown-label">متبقي على صلاة {nextPrayerName}</p>
          <h1 className="countdown-time">{timeLeft}</h1>
        </div>
      )}

      {loading ? (
        <Stack alignItems="center" className="loading-box">
          <CircularProgress className="loading-spinner" />
        </Stack>
      ) : error ? (
        <Stack alignItems="center" className="loading-box">
          <h3 className="error-text">{error}</h3>
        </Stack>
      ) : (
        <Stack direction="row" spacing={2} className="prayers-stack">
          <div className={nextPrayerIndex === 0 ? 'active-prayer' : ''}><Prayer name="الفجر" time={timings?.Fajr} image="https://blog.ajsrp.com/wp-content/uploads/2025/05/%D9%81%D8%B6%D8%A7%D8%A6%D9%84-%D8%B5%D9%84%D8%A7%D8%A9-%D8%A7%D9%84%D9%81%D8%AC%D8%B1-1024x585.jpeg" /></div>
          <div className={nextPrayerIndex === 1 ? 'active-prayer' : ''}><Prayer name="الظهر" time={timings?.Dhuhr} image="https://tse2.mm.bing.net/th/id/OIP.f9mdujSaLryM_YC5lfnvjQHaEO?r=0&rs=1&pid=ImgDetMain&o=7&rm=3" /></div>
          <div className={nextPrayerIndex === 2 ? 'active-prayer' : ''}><Prayer name="العصر" time={timings?.Asr} image="https://tse3.mm.bing.net/th/id/OIP.-4X3YYLLxZ9ijgPDu2kbFAHaEJ?r=0&rs=1&pid=ImgDetMain&o=7&rm=3" /></div>
          <div className={nextPrayerIndex === 3 ? 'active-prayer' : ''}><Prayer name="المغرب" time={timings?.Maghrib} image="https://tse3.mm.bing.net/th/id/OIP.Djf8zKA8cXusfYS80Fc65wHaE8?r=0&rs=1&pid=ImgDetMain&o=7&rm=3" /></div>
          <div className={nextPrayerIndex === 4 ? 'active-prayer' : ''}><Prayer name="العشاء" time={timings?.Isha} image="https://tse4.mm.bing.net/th/id/OIP.n3jVzC9iMTkjtcKpaAVgFwHaEO?r=0&rs=1&pid=ImgDetMain&o=7&rm=3" /></div>
        </Stack>
      )}

      <Stack direction="row" className="city-select-wrapper">
        <FormControl className="city-select-control">
          <InputLabel id="city-select-label" className="city-label">المدينة</InputLabel>
          <Select value={city} label="المدينة" onChange={(e) => setCity(e.target.value)}>
            {CITIES.map((c) => (<MenuItem key={c.value} value={c.value}>{c.label}</MenuItem>))}
          </Select>
        </FormControl>
      </Stack>
    </div>
  );
}