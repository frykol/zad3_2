const table_body = document.getElementById('station_body');
const dataset_body = document.getElementById('dataset_body');


async function fetchData(url) {
    const response = await fetch(url);
    const data = await response.json();

    return data;
}

async function main() {

    const data = await fetchData('/api/stations');
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

    //-----------------datasets

    const datasetsData = await fetchData("/api/datasets");
    console.log(datasetsData);

    const datasets = datasetsData.results;

    datasets.forEach(dataset => {
        const tr = document.createElement('tr');
        const id = document.createElement('td');
        const name = document.createElement('td');
        const maxdate = document.createElement('td');
        const mindate = document.createElement('td');

        id.textContent = dataset.id;
        name.textContent = dataset.name;
        maxdate.textContent = dataset.maxdate;
        mindate.textContent = dataset.mindate;

        tr.appendChild(id);
        tr.appendChild(name);
        tr.appendChild(maxdate);
        tr.appendChild(mindate);
        dataset_body.appendChild(tr);
    });
}


main();