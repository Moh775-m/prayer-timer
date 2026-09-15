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
import './MainCont.css'; // ربط ملف الـ CSS

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

  const cityLabel = CITIES.find((c) => c.value === city)?.label || city;
  const hijriDay = dateInfo?.hijri?.day?.ar || '';
  const hijriMonth = dateInfo?.hijri?.month?.ar || '';
  const hijriYear = dateInfo?.hijri?.year || '';

  return (
    <div className="main-container">
      <Grid container className="header-grid">
        {/* يسار - التاريخ الميلادي */}
        <Grid item xs={6}>
          <div className="date-box-left">
            <p className="date-label">مواقيت الصلاة</p>
            <h1 className="date-value">{dateInfo?.gregorian?.date || '...'}</h1>
          </div>
        </Grid>

        {/* يمين - المدينة والشهر الهجري */}
        <Grid item xs={6}>
          <div className="date-box-right">
            <p className="date-label">
              {hijriMonth ? `${hijriDay} ${hijriMonth} ${hijriYear} هـ` : '...'}
            </p>
            <h1 className="date-value">{cityLabel} - اليمن</h1>
          </div>
        </Grid>
      </Grid>

      <Divider className="divider" />

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
          <Prayer name="الفجر" time={timings?.Fajr} image="https://blog.ajsrp.com/wp-content/uploads/2025/05/%D9%81%D8%B6%D8%A7%D8%A6%D9%84-%D8%B5%D9%84%D8%A7%D8%A9-%D8%A7%D9%84%D9%81%D8%AC%D8%B1-1024x585.jpeg" />
          <Prayer name="الظهر" time={timings?.Dhuhr} image="https://tse2.mm.bing.net/th/id/OIP.f9mdujSaLryM_YC5lfnvjQHaEO?r=0&rs=1&pid=ImgDetMain&o=7&rm=3" />
          <Prayer name="العصر" time={timings?.Asr} image="https://tse3.mm.bing.net/th/id/OIP.-4X3YYLLxZ9ijgPDu2kbFAHaEJ?r=0&rs=1&pid=ImgDetMain&o=7&rm=3" />
          <Prayer name="المغرب" time={timings?.Maghrib} image="https://tse3.mm.bing.net/th/id/OIP.Djf8zKA8cXusfYS80Fc65wHaE8?r=0&rs=1&pid=ImgDetMain&o=7&rm=3" />
          <Prayer name="العشاء" time={timings?.Isha} image="https://tse4.mm.bing.net/th/id/OIP.n3jVzC9iMTkjtcKpaAVgFwHaEO?r=0&rs=1&pid=ImgDetMain&o=7&rm=3" />
        </Stack>
      )}

      <Stack direction="row" className="city-select-wrapper">
        <FormControl className="city-select-control">
          <InputLabel id="city-select-label" className="city-label">المدينة</InputLabel>
          <Select
            labelId="city-select-label"
            id="city-select"
            value={city}
            label="المدينة"
            onChange={(e) => setCity(e.target.value)}
          >
            {CITIES.map((c) => (
              <MenuItem key={c.value} value={c.value}>{c.label}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Stack>
    </div>
  );
}