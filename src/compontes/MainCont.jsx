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
import { red } from '@mui/material/colors';

const CITIES = [
  { label: 'عدن', value: 'Aden' },
  { label: 'المكلا', value: 'Mukalla' },
  {label:'صنعاء' , value:'Sanaa'},
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
  const hijriDay=dateInfo?.hijri?.day?.ar|| '';
  const hijriMonth = dateInfo?.hijri?.month?.ar || '';
  const hijriYear = dateInfo?.hijri?.year || '';

  return (
    <>
      <Grid container sx={{ width: '100%', padding: '30px 0 20px 0', alignItems: 'center' }}>

        {/* يسار - التاريخ الميلادي */}
        <Grid xs={6}>
          <div style={{ textAlign: 'left', paddingLeft: '20px' }}>
            <p style={{
              margin: 0,
              fontSize: '25px',
              color: 'rgba(8, 8, 8, 0.7)',
              letterSpacing: '2px',
              fontWeight: 400,
            }}>
              مواقيت الصلاة
            </p>
            <h1 style={{
              margin: '6px 0 0 0',
              fontSize: '38px',
              fontWeight: 700,
              color: 'black',
              textShadow: '0 2px 8px rgba(0,0,0,0.4)',
              lineHeight: 1.2,
            }}>
              {dateInfo?.gregorian?.date || '...'}
            </h1>
          </div>
        </Grid>

        {/* يمين - المدينة والشهر الهجري */}
        <Grid xs={6}>
          <div style={{ textAlign: 'right', paddingRight: '20px' }}>
            <p style={{
              margin: 0,
              fontSize: '25px',
              color: 'rgba(22, 21, 21, 0.7)',
              letterSpacing: '2px',
              fontWeight: 400,
            }}>
              {hijriMonth ? `${hijriDay} ${hijriMonth} ${hijriYear} هـ` : '...'}
            </p>
            <h1 style={{
              margin: '6px 0 0 0',
              fontSize: '38px',
              fontWeight: 700,
              color: 'black',
              textShadow: '0 2px 8px rgba(0,0,0,0.4)',
              lineHeight: 1.2,
            }}>
              {cityLabel} - اليمن
            </h1>
          </div>
        </Grid>

      </Grid>
      <Divider sx={{ borderColor: 'rgba(8, 8, 8, 0.3)' }} />

      {loading ? (
        <Stack alignItems="center" sx={{ marginTop: '50px' }}>
          <CircularProgress sx={{ color: 'black' }} />
        </Stack>
      ) : error ? (
        <Stack alignItems="center" sx={{ marginTop: '50px' }}>
          <h3 style={{ color: 'red' }}>{error}</h3>
        </Stack>
      ) : (
        <Stack
          direction="row"
          spacing={2}
          sx={{
            width: '100%',
            marginTop: '50px',
            overflow: 'hidden',
          }}
        >
          <Prayer name="الفجر"  time={timings?.Fajr} image={"https://blog.ajsrp.com/wp-content/uploads/2025/05/%D9%81%D8%B6%D8%A7%D8%A6%D9%84-%D8%B5%D9%84%D8%A7%D8%A9-%D8%A7%D9%84%D9%81%D8%AC%D8%B1-1024x585.jpeg"}   />
          <h1>  </h1>
          <Prayer name="الظهر"  time={timings?.Dhuhr} image={"https://tse2.mm.bing.net/th/id/OIP.f9mdujSaLryM_YC5lfnvjQHaEO?r=0&rs=1&pid=ImgDetMain&o=7&rm=3"}   />
          <Prayer name="العصر"  time={timings?.Asr}  image={"https://tse3.mm.bing.net/th/id/OIP.-4X3YYLLxZ9ijgPDu2kbFAHaEJ?r=0&rs=1&pid=ImgDetMain&o=7&rm=3"}   />
          <Prayer name="المغرب" time={timings?.Maghrib} image={"https://tse3.mm.bing.net/th/id/OIP.Djf8zKA8cXusfYS80Fc65wHaE8?r=0&rs=1&pid=ImgDetMain&o=7&rm=3"} />
          <Prayer name="العشاء" time={timings?.Isha} image={"https://tse4.mm.bing.net/th/id/OIP.n3jVzC9iMTkjtcKpaAVgFwHaEO?r=0&rs=1&pid=ImgDetMain&o=7&rm=3"}   />
        </Stack>
      )}

      <Stack direction="row" style={{ marginTop: '40px' }}>
        <FormControl
          sx={{
           backgroundColor:'#f5f5f0',
            width: '20%',
            '& .MuiInputLabel-root': { color: 'black' },
            '& .MuiInputLabel-root.Mui-focused': { color: 'black' },
            '& .MuiOutlinedInput-root': {
              color: 'black',
              '& fieldset': { borderColor: 'black' },
              '&:hover fieldset': { borderColor: 'black' },
              '&.Mui-focused fieldset': { borderColor: 'black' },
            },
          }}
        >
          <InputLabel id="city-select-label"
              sx={{
              right: 30,
              left: 'auto',
              transformOrigin: 'top right',
              fontWeight:'bold',
            }}
                                                
>
  المدينة
</InputLabel>
          <Select
            labelId="city-select-label"
            id="city-select"
            value={city}
            label="المدينة"
            onChange={(e) => setCity(e.target.value)}
          >
            {CITIES.map((c) => (
              <MenuItem key={c.value} value={c.value}>
                {c.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Stack>
    </>
  );
}