import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import MainCont from './compontes/MainCont';
import Container from '@mui/material/Container'
import { red } from '@mui/material/colors'


function App() {
  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100%",
        backgroundImage: 'url("/images/m.jpeg")',
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <Container maxWidth="xl">
        <MainCont />
      </Container>
    </div>
  )
}
export default App
