import React from 'react'

import Charts from './Chart'
import Map from '../General Components/Map'
import HeroSection from './HeroSection'
import Navigation from '../General Components/Navigation'

export default function Home() {
  return (
    <div className='bg w-full h-screen flex flex-col'>
      <style>
        {`

        .bg{
          background-image: url("images/banner-bg.webp");
          background-repeat: no-repeat;
          background-size: cover;
        }
        `}
      </style>
    <Navigation/>
 <HeroSection/>
      </div>
  )
}
