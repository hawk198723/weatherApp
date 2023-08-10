// Defining the main DOM elements
const container = document.querySelector(".container");
const searchInput = document.querySelector(".search-box input");
const search = document.querySelector(".search-box button");
const weatherBox = document.querySelector(".weather-box");
const weatherDetails = document.querySelector(".weather-details");
const error404 = document.querySelector(".not-found");

// Adding event listener to trigger search on 'Enter' key press
searchInput.addEventListener("keyup", (event) => {
  if (event.keyCode === 13) {
    // keycode 13 is for the 'Enter' on the keyboard
    event.preventDefault();
    search.click(); // Programmatically trigger the click event of the search button
  }
});

// Add a click event to the search button
search.addEventListener("click", () => {
  // Retrieve city name from the input box
  const city = document.querySelector(".search-box input").value;
  // API key
  const APIKey = "f6b0084c5da865d7ded4f360f784b540";
  // Make sure the city name is not empty
  console.log("Button clicked! Searching for city:", city);
  if (city === "") {
    return;
  }
  // Use fetch to call the OpenWeatherMap API to get weather data for the specified city
  fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${APIKey}`
  )
    .then((response) => {
      // If the response is not okay, throw an error
      if (!response.ok) {
        return response.json().then((json) => Promise.reject(json));
      }
      return response.json();
    })
    .then((json) => {
      // for testing API data in the console
      // console.log("API response:", json);

      // console.log("main:", json.main);
      // console.log("weather:", json.weather);
      // console.log("humidity:", json.main.humidity);
      // console.log("speed:", json.wind.speed);

      // Check the API response
      if (json.cod === 404 || json.cod === "404") {
        // Display error message
        container.style.height = "400px";
        weatherBox.style.display = "none";
        weatherDetails.style.display = "none";
        error404.style.display = "block";
        error404.classList.add("fadeIn");
        return;
      } else if (json.cod === 200 || json.cod === "200") {
        // Display the weather data
        weatherBox.style.display = "";
        weatherDetails.style.display = "";
        error404.style.display = "none";
        error404.classList.remove("fadeIn");
      } else {
        // Handle unknown API response
        console.error("Unknown API response:", json);
        return;
      }

      // Update the UI elements to show weather data
      const image = document.querySelector(".weather-box img");
      const temperature = document.querySelector(".weather-box .temperature");
      const description = document.querySelector(".weather-box .description");
      const humidity = document.querySelector(
        ".weather-details .humidity span"
      );
      const wind = document.querySelector(".weather-details .wind span");

      // Choose an image based on the weather type
      switch (json.weather[0].main) {
        case "Clear":
          image.src = "images/clear.png";
          break;
        case "Rain":
          image.src = "images/rain.png";
          break;
        case "Clouds":
          image.src = "images/cloud.png";
          break;
        case "Snow":
          image.src = "images/snow.png";
          break;
        case "Haze":
          image.src = "images/haze.png";
          break;
        case "Mist":
          image.src = "images/mist.png";
          break;
        case "Thunderstorm":
          image.src = "images/thunderstorm.png";
          break;
        default:
          image.src = "";
      }

      // Update the UI with the weather data
      temperature.innerHTML = `${parseInt(json.main.temp)}<span> °C</span>`;
      description.innerHTML = `${json.weather[0].description}`;
      humidity.innerHTML = `${json.main.humidity}%`;
      wind.innerHTML = `${parseInt(json.wind.speed)} km/h`;

      weatherBox.style.display = "";
      weatherDetails.style.display = "";
      weatherBox.classList.add("fadeIn");
      weatherDetails.classList.add("fadeIn");
      container.style.height = "590px";
    })
    .catch((error) => {
      // Handle the error from the API call
      console.error("Error fetching data: ", error);
      if (error.cod === 404 || error.cod === "404") {
        container.style.height = "400px";
        weatherBox.style.display = "none";
        weatherDetails.style.display = "none";
        error404.style.display = "block";
        error404.classList.add("fadeIn");
      }
    });
});
