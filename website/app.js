/* Global Variables */
const baseUrl = 'https://api.openweathermap.org/data/2.5/weather?zip=';
const apiKey = 'c34b83f8d704d201553e345c84ee82ac';

// Create a new date instance dynamically with JS
let d = new Date();
let newDate = d.toLocaleString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

document.getElementById('generate').addEventListener('click', performAction);

function performAction(){
    const postCode = document.getElementById('zip').value;
    const comment = document.getElementById('feelings').value;
    getTemperature(baseUrl, postCode, apiKey)
    .then(function (data){
        postData('http://localhost:3001/addWeatherData', {temperature: data.main.temp, date: newDate, user_response: comment } )
        .then(function() {
            updateUI()
        })
    })
}

// Async GET
const getTemperature = async (baseUrl, code, apiKey)=>{
    const response = await fetch(baseUrl + code + ',us' + '&APPID=' + apiKey)
    try {
        if (response.status == 404) {
            document.getElementById('error').innerHTML = 'ZipCode not found';
        } else {
            document.getElementById('error').innerHTML = '';
        }
        const data = await response.json();
        return data;
    }
    catch(error) {
        console.log('Error: ', error);
    }
}

// Async POST
const postData = async (url = '', data = {}) => {
    const postRequest = await fetch(url, {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });
    try {
        const newData = await postRequest.json();
        return newData;
    }
    catch (error) {
        console.log('Error: ', error);
    }
}

// Update user interface
const updateUI = async () => {
    const request = await fetch('http://localhost:3001/all');
    try {
        const allData = await request.json();
        document.getElementById('date').innerHTML = allData.date;
        document.getElementById('temp').innerHTML = allData.temperature;
        document.getElementById('content').innerHTML = allData.user_response;
    }
    catch (error) {
        console.log('Error: ', error);
    }
}