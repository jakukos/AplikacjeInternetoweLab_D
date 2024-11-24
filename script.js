const apiKey = ''; //TODO usunąć klucz API przed publikacją
const cityInput = document.getElementById('cityInput');
const getWeatherBtn = document.getElementById('getWeatherBtn');
const weatherInfo = document.getElementById('weatherInfo');
const forecastInfo = document.getElementById('forecastInfo');

getWeatherBtn.addEventListener('click', () => {
    const city = cityInput.value.trim();
    if (city) {
        fetchWeatherXML(city);
        fetchForecast(city);
    } else {
        alert('Wpisz nazwę miasta');
    }
});

document.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        const city = cityInput.value.trim();
        if (city) {
            fetchWeatherXML(city);
            fetchForecast(city);
        } else {
            alert('Wpisz nazwę miasta');
        }
    }
});

function fetchWeatherXML(city) {
    const xhr = new XMLHttpRequest();
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}&lang=pl`;

    xhr.open('GET', url, true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                const data = JSON.parse(xhr.responseText);
                console.log('XMLHttpRequest - Pogoda:', data);
                displayWeather(data);
            } else {
                console.error('Błąd XMLHttpRequest - Pogoda:', xhr.statusText);
                weatherInfo.innerHTML = `<p>Błąd: ${xhr.statusText}</p>`;
            }
        }
    };
    xhr.send();
}

async function fetchForecast(city) {
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}&lang=pl`;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Błąd HTTP: ${response.status}`);
        }
        const data = await response.json();
        console.log('Fetch API - Prognoza:', data);
        displayForecast(data);
    } catch (error) {
        console.error('Błąd podczas pobierania danych:', error);
        forecastInfo.innerHTML = `<p>Błąd: ${error.message}</p>`;
    }
}

function displayWeather(data) {
    const { name, main, weather } = data;
    weatherInfo.innerHTML = `
        <h2>Pogoda w ${name}</h2>
        <p>Temperatura: ${main.temp}°C</p>
        <p>Opis: ${weather[0].description}</p>
        <p>Wilgotność: ${main.humidity}%</p>
        <p>Prędkość wiatru: ${data.wind.speed} m/s</p>
    `;
}

function displayForecast(data) {
    const forecastList = data.list;
    const uniqueDays = new Set();
    const dailyForecast = [];

    forecastList.forEach(item => {
        const date = new Date(item.dt * 1000);
        const day = date.toLocaleDateString();

        if (!uniqueDays.has(day)) {
            uniqueDays.add(day);
            dailyForecast.push({
                date: day,
                temp: item.main.temp,
                description: item.weather[0].description,
                humidity: item.main.humidity
            });
        }
    });

    forecastInfo.innerHTML = `<h2>Prognoza pogody na 5 dni</h2><ul>`;
    dailyForecast.slice(0, 5).forEach(item => {
        forecastInfo.innerHTML += `
            <li>
                <strong>${item.date}</strong> - ${item.description},
                Temperatura: ${item.temp}°C,
                Wilgotność: ${item.humidity}%
            </li>
        `;
    });
    forecastInfo.innerHTML += `</ul>`;
}