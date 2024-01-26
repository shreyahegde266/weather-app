const OPENWEATHERMAP_TOKEN = 'b2246999643d154d6b69a45950aa398e';

window.getWeather = function() {
    var input = document.getElementById("input").value;
    var result = document.getElementById("result");
    var loader = document.getElementById("loader");
    var result_container = document.querySelector(".result-container");
    result.style.display = "none";
    loader.style.display = "block";

    if (input) {
        const token = OPENWEATHERMAP_TOKEN;
        var url =
            "https://api.openweathermap.org/data/2.5/weather?q=" +
            input +
            "&units=metric&appid=" +
            token;

        fetch(url)
            .then(function (response) {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error("Something went wrong");
                }
            })
            .then(function (data) {
                var city = data.name;
                var country = data.sys.country;
                var temp = data.main.temp;
                var feels_like = data.main.feels_like;
                var humidity = data.main.humidity;
                var wind = data.wind.speed;
                var description = data.weather[0].description;

                let html =
                    "<p><span class='value temp'>" +
                    temp +
                    " °C " +
                    getTemperatureIcon(description) +
                    "</span></p>";
                html +=
                    "<p><span class='value description' style='text-transform:capitalize'>" +
                    description +
                    getWeatherIcon(description) +
                    "</span></p>";
                html +=
                    "<p><span class='label'>Humidity:</span> <span class='value'>" +
                    humidity +
                    " % <i class='fas fa-tint fa-lg'></i></span></p>";
                html +=
                    "<p><span class='label'>Wind:</span> <span class='value'>" +
                    wind +
                    " m/s <i class='fas fa-wind fa-lg'></i></span></p>";

                result.innerHTML = html;

                loader.style.display = "none";
                result_container.style.display = "block";
                result.style.display = "block";
            })
            .catch(function (error) {
                result_container.style.display = "none";
                alert(error.message);
            });
    } else {
        alert("Please enter a city name");
    }
    getGraph();
}

function getWeatherIcon(description) {
    var iconMappings = {
        "clear sky": "<i class='fas fa-sun'></i>",
        "few clouds": "<i class='fas fa-cloud-sun'></i>",
        "scattered clouds": "<i class='fas fa-cloud'></i>",
        "broken clouds": "<i class='fas fa-cloud'></i>",
        "overcast clouds": "<i class='fas fa-cloud'></i>",
        fog: "<i class='fas fa-smog'></i>",
        "light rain": "<i class='fas fa-cloud-showers-heavy'></i>",
        "moderate rain": "<i class='fas fa-cloud-showers-heavy'></i>",
        "heavy rain": "<i class='fas fa-cloud-showers-heavy'></i>",
    };

    if (iconMappings.hasOwnProperty(description.toLowerCase())) {
        return iconMappings[description.toLowerCase()];
    }

    return "";
}

function getTemperatureIcon(description) {
    var iconMappings = {
        "clear sky": "<i class='fas fa-sun'></i>",
        "few clouds": "<i class='fas fa-sun'></i>",
        "scattered clouds": "<i class='fas fa-cloud-sun'></i>",
        "broken clouds": "<i class='fas fa-cloud-sun'></i>",
        "overcast clouds": "<i class='fas fa-cloud'></i>",
        fog: "<i class='fas fa-smog'></i>",
        "light rain": "<i class='fas fa-cloud-showers-heavy'></i>",
        "moderate rain": "<i class='fas fa-cloud-showers-heavy'></i>",
        "heavy rain": "<i class='fas fa-cloud-showers-heavy'></i>",
    };

    if (iconMappings.hasOwnProperty(description.toLowerCase())) {
        return iconMappings[description.toLowerCase()];
    }

    return "";
}

async function getGraph() {
    var cityInput = document.getElementById("input").value;
    if (cityInput) {
        const weatherData = await fetchWeatherData(cityInput);

        if (weatherData) {
            updateChart(weatherData);
        }
    } else {
        alert('Please enter a city name or zip code.');
    }
};

async function fetchWeatherData(cityName) {
    try {
        var url =
            "https://api.openweathermap.org/data/2.5/forecast?q=" +
            cityName +
            "&units=metric&appid=" +
            OPENWEATHERMAP_TOKEN;
        const response = await fetch(url);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching weather data:', error);
        return null;
    }
}

function updateChart(data) {
    const hourlyTemperature = data?.list?.map(item => item.main.temp);
    const hourlyTime = data?.list?.map(item => new Date(item.dt * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));

    hourlyChart.data.labels = hourlyTime;
    hourlyChart.data.datasets[0].data = hourlyTemperature;
    hourlyChart.update();
}

const ctx = document.getElementById('hourlyChart').getContext('2d');
const hourlyChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: [],
        datasets: [
            {
                label: 'Temperature (°C)',
                data: [],
                borderColor: 'rgb(75, 192, 192)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
            },
        ],
    },
    options: {
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Hour'
                }
            },
            y: {
                title: {
                    display: true,
                    text: 'Temperature (°C)'
                }
            }
        }
    },
});

function selectedDropdown(event){
    document.querySelector('.dropbtn').textContent = event.target.textContent;
    document.querySelector('.dropbtn').name = event.target.name;
    switch (event.target.name) {
        case 'bar':
            hourlyChart.options={
                scales: {
                  y: {
                    beginAtZero: true
                  }
                }
            };
            break;
        case 'doughnut':
            hourlyChart.options={};
            break;
        case 'polarArea':
            hourlyChart.options={};
            break;
        case 'radar':
            hourlyChart.options={
                elements: {
                  line: {
                    borderWidth: 3
                  }
                }
              };
            break;
        default:
            hourlyChart.options={
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Hour'
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Temperature (°C)'
                        }
                    }
                }
            };
            break;
    }
    hourlyChart.config.type= event.target.name;
    hourlyChart.update('none');
}

document.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        getWeather();
    }
});

window.addEventListener("load", function() {
    const currentYear = new Date().getFullYear();
    document.getElementById("copyrightYear").textContent = currentYear;
});
