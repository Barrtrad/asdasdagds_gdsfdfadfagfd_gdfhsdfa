const API = "https://script.google.com/macros/s/AKfycbxqxQOKOwjJip5GJ2A7SCLG5ZInMx-Zifj0dwK7JYcaWckxT_rZcKuP_MvnXr5swKJ-Fg/exec";


let allTrains = [];

let currentStation = "";



// Klocka

function updateClock(){

    const now = new Date();

    document.getElementById("clock").innerHTML =
        now.toLocaleTimeString("sv-SE");

}


setInterval(updateClock,1000);

updateClock();





// Hämtar data

function loadTrains(){


fetch(API)

.then(response => response.json())

.then(data => {


    allTrains = data;


    createStationList(data);


    if(currentStation === ""){
        currentStation = data[0].Station;
    }


    showStation();



});


}





// Skapar stationsmenyn automatiskt

function createStationList(data){


const select =
document.getElementById("stationSelect");



select.innerHTML = "";



const stations = [
    ...new Set(
        data.map(train => train.Station)
    )
];



stations.forEach(station => {


    let option =
    document.createElement("option");


    option.value = station;

    option.textContent = station;


    select.appendChild(option);


});



select.value = currentStation;



}







// Visar vald station

function showStation(){


const table =
document.getElementById("departures");



table.innerHTML = "";



const now = new Date();

const currentTime =
now.getHours() * 60 + now.getMinutes();



const trains =
allTrains.filter(train => {


    if(train.Station !== currentStation){
        return false;
    }


    const parts =
    train.Departure.split(":");


    const trainTime =
    parseInt(parts[0]) * 60 +
    parseInt(parts[1]);


    return trainTime >= currentTime;


});

trains.sort((a, b) => {

    return a.Departure.localeCompare(b.Departure);

});

document.getElementById("stationName")
.innerHTML = currentStation;




trains.forEach(train => {


let statusClass =
train.Status === "Delayed"
? "delayed"
: "ontime";



table.innerHTML += `

<tr>

<td>${train.Train}</td>

<td>${train.Destination}</td>

<td>${train.Departure}</td>

<td>${train.Platform}</td>

<td class="${statusClass}">
${train.Status}
</td>

</tr>

`;


});


}





// När man byter station

const search =
document.getElementById("stationSearch");


const results =
document.getElementById("stationResults");



search.addEventListener("input", function(){


    const text =
    this.value.toLowerCase();


    results.innerHTML = "";


    if(text.length < 1){
        return;
    }



    const stations = [
        ...new Set(
            allTrains.map(train => train.Station)
        )
    ];



    stations
    .filter(station =>
        station.toLowerCase()
        .includes(text)
    )
    .forEach(station => {


        const div =
        document.createElement("div");


        div.className =
        "station-option";


        div.textContent =
        station;



        div.onclick = function(){


            currentStation = station;


            document.getElementById("stationName")
            .innerHTML = station;


            search.value = station;


            results.innerHTML = "";


            showStation();


        };



        results.appendChild(div);


    });


});




loadTrains();



// Uppdatera data automatiskt

setInterval(loadTrains,100);