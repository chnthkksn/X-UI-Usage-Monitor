async function renderModal(modelData) {
  if (window.location.pathname == "/admin") {
    let modal = "";
    let up = converter(modelData[1]);
    let down = converter(modelData[2]);
    let node = modelData[5].split(".")[0];
    if (modelData[3] == 0) {
      var allocation = "Unlimited";
      modal += `<div class="ui modal">
          <div class="header" id="modal">
            <div class="content">
              <h1 class="header"> User Info </h1>
              <p>Email: ${modelData[0]}</p>
              <p>Up: ${up}</p>
              <p>Down: ${down}</p>
              <p>Allocated: ${allocation} </p>
              <p>Node: ${node} </p>
              <p>Expiry: ${modelData[4]}</p>
            </div>
            <i class="close icon" onClick="HideModal()"></i>
        </div>`;
    } else {
      var allocation = converter(modelData[3]);
      modal += `<div class="ui modal">
        <div class="header" id="modal">
          <div class="content">
            <h1 class="header"> User Info </h1>
            <p>Email: ${modelData[0]}</p>
            <p>Up: ${up}</p>
            <p>Down: ${down}</p>
            <p>Allocated: ${allocation} </p>
            <p>Node: ${node} </p>
            <p>Expiry: ${modelData[4]}</p>
          </div>
          <div class="content">
            <canvas id="myChart" class="myChart"></canvas>
          </div>
          <i class="close icon" onClick="HideModal()"></i>
        </div>`;
    }

    document.querySelector("#modal").innerHTML = await modal;
    if (modelData[3] != 0) {
      renderChart(modelData);
    }
  } else {
    let modal = "";
    let lastUpdatedSeconds = new Date() - modelData["lastUpdated"];
    let lastUpdated = secondsConveter(lastUpdatedSeconds / 1000);
    modelData = modelData["data"];
    let chartData = [
      modelData["email"],
      modelData["up"],
      modelData["down"],
      modelData["total"],
    ];
    const nowData = new Date().toLocaleString({ timeZone: "Asia/Colombo" });
    const status = modelData["enable"] == 1 ? "Active 🟢" : "Disabled 🔴";
    const uplink = converter(modelData["up"]);
    const downlink = converter(modelData["down"]);
    const datetime = timedata(modelData["expiry_time"]);
    const totalUsage = converter(modelData["total"]);
    if (modelData["total"] == 0) {
      modal += `
      <div class="ui modal">
        <div class="header" id="modal">
          <div class="content">
            <h2 style='text-align:center'> Usage for ${nowData} </h2>
            <p> Status: ${status} </p>
            <p> Total Usage: ${totalUsage} </p>
            <div class='usage-div'>
                <p> Upload ⬆️: ${uplink} </p>
                <p> Download ⬇️: ${downlink} </p>
            </div>
            <p> Expiry Time: ${datetime} </p>
            <p> Last Updated: ${lastUpdated} ago </p>
            </div>
            <i class="close icon" onClick="HideModal()"></i>
      </div>
    `;
    } else {
      modal += `
    <div class="ui modal">
      <div class="header" id="modal">
        <div class="content">
          <h2 style='text-align:center'> Your Usage @ ${nowData} </h2>
          <p> Status: ${status} </p>
          <p> Total Usage: ${totalUsage} </p>
          <div class='usage-div'>
              <p> Upload ⬆️: ${uplink} </p>
              <p> Download ⬇️: ${downlink} </p>
          </div>
          <p> Expiry Time: ${datetime} </p>
          <p> Last Updated: ${lastUpdated} ago </p>
          </div>
          <div class="content">
          <canvas id="myChart" class="myChart"></canvas>
          </div>
          <i class="close icon" onClick="HideModal()"></i>
    </div>
  `;
    }
    document.querySelector("#modal").innerHTML = await modal;
    if (modelData["total"] != 0) {
      renderChart(chartData);
    }
  }
}

function renderChart(chartData) {
  let remaining = convertGb(chartData[3] - chartData[1] - chartData[2]);
  let up = convertGb(chartData[1]);
  let down = convertGb(chartData[2]);
  let total = convertGb(chartData[3]);
  const data = {
    labels: ["Uplaod", "Download", "Remaining"],

    datasets: [
      {
        label: "GigaBytes",
        data: [up, down, remaining],
        backgroundColor: ["#2ecc71", "#3498db", "#f1c40f"],
        hoverOffset: 4,
      },
    ],
  };

  const config = {
    type: "doughnut",
    data: data,
    Options: {
      responsive: true,
    },
  };

  new Chart(document.getElementById("myChart"), config);
}
