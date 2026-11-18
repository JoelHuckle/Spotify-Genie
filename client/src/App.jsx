import { useState } from 'react'
import './App.css'
import Login from "./components/Login"


//get user data from spotify api (top songs)
//ask ai to build description of person based on top songs
//show to user

function App() {
  return (
    <>
      <h1>Spotify Genie</h1>
      <Login/>
    </>
  )
}

export default App
