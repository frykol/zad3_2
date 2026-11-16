const table_body = document.getElementById('station_body');


async function fetchData() {
    const response = await fetch('/api/stations');
    const data = await response.json();

    return data;
}

async function main() {

    const data = await fetchData();

    console.log(data);

    const stations = data.results;

    stations.forEach(station => {
        const tr = document.createElement('tr');
        const station_id = document.createElement('td');
        const name = document.createElement('td');
        const latitude = document.createElement('td');
        const longitude = document.createElement('td');

        station_id.textContent = station.id;
        name.textContent = station.name;
        latitude.textContent = station.latitude;
        longitude.textContent = station.longitude;

        tr.appendChild(station_id);
        tr.appendChild(name);
        tr.appendChild(longitude);
        tr.appendChild(latitude);
        table_body.appendChild(tr);

        console.log(station.id);
    });    
}


main();