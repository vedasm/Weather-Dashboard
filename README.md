# Weather Dashboard

A simple weather app built with HTML, CSS & JavaScript. Search any city and get current weather info from a live free API.

## What it does today

- Search Box to enter a city
- Find the city's longitude and latitude
- Retrive the current weather for that location you specified
- Currently Displays Temperatue, Condition, Feels-like, Humidity, & Wind-Speed
- Simple Loading and Error status

## Tech Stack

- HTML
- CSS
- Vanilla JS
- [Open-Meteo](https://open-meteo.com/) for geocoding and fetching the weather info. It doesn't require any API Keys.

## Working

1. User types a city name and clicks search
2. `geocodeCity()` send the city name to Open-Meteo's endpoint and gets city's longitude and latitude
3. `fetchCurrentWeather()` uses the two Coordinates to get the current forecast from the endpoint
4. `renderCurrentWeather()` inserts the result dynamically

## File Structure

```
weather-dashboard/
|--- index.html
|--- styles.css
|--- script.js
|--- README.md <---> You Are Here

## Running the App

Just clone the repo and open the `index.html` file in your favourite web browser and search for your city or your favourite one.