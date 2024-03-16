import React, { useEffect } from 'react'

export default function Map() {
    useEffect(() => {
      
        fetchDefaultMap();
    
        
    }, []);
  
    const fetchDefaultMap = () => {
        fetch('https://sk45678.pythonanywhere.com/generate_map', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ city_name: "indore" })
        })
        .then(response => response.json())
        .then(data => {
            if (data.map_html) {
                // Set the map HTML content as the srcdoc of the iframe
                document.getElementById('mapFrame').srcdoc = data.map_html;
            } else {
                document.getElementById('mapContainer').innerHTML = 'Error: Unable to generate map';
            }
        })
        .catch(error => {
            console.error('Error:', error);
            document.getElementById('mapContainer').innerHTML = 'Error: Unable to connect to the server';
        });
    }
    const search =()=>{
        document.getElementById('cityForm').addEventListener('submit', function(event) {
            event.preventDefault();
            const cityName = document.getElementById('cityName').value;
            fetch('https://sk45678.pythonanywhere.com/generate_map', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ city_name: cityName })
            })
            .then(response => response.json())
            .then(data => {
                if (data.map_html) {
                    // Set the map HTML content as the srcdoc of the iframe
                    document.getElementById('mapFrame').srcdoc = data.map_html;
                } else {
                    document.getElementById('mapContainer').innerHTML = 'Error: Unable to generate map';
                }
            })
            .catch(error => {
                console.error('Error:', error);
                document.getElementById('mapContainer').innerHTML = 'Error: Unable to connect to the server';
            });
        });
   
   
    }
  return (
    <div className=' absoulte h-screen w-full '>
        
    <div id="mapContainer">
        <iframe id="mapFrame" className='w-full h-[100vh] z-0 absolute top-0 left-0' frameborder="0" style={{border:0 ,overflow:'auto'}} allowfullscreen scrolling='no'></iframe>
    </div>
    <form id="cityForm" className='relative z-50  w-full h-12 flex justify-center items-center space-x-5'>
        <input className=' border outline-none rounded px-3 shadow py-1 font-medium text-md text-gray-900' placeholder='Search city..' type="text" id="cityName" name="cityName" required></input>
        <button onClick={search} type="submit" className=' shadow px-3 py-1 rounded text-white font-medium bg-green'>Search</button>
    </form>



    </div>
  )
}
