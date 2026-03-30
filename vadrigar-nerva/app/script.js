function showTab(tab) {
  document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
  document.getElementById(tab).classList.add("active");
}

// SAFE RPC
async function rpc(method, params = {}) {
  try {
    const res = await fetch("/json_rpc", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: "0",
        method,
        params
      })
    });

    const data = await res.json();

    if (data.error) return null;

    return data;

  } catch {
    return null;
  }
}

// OVERVIEW
let lastHeight = 0;
let lastTime = Date.now();

async function updateOverview() {
  const data = await rpc("get_info");
  if (!data) return;

  const r = data.result;

  document.getElementById("height").innerText = r.height;
  document.getElementById("peerCount").innerText =
    r.incoming_connections_count + r.outgoing_connections_count;
  document.getElementById("tx").innerText = r.tx_count;
  document.getElementById("difficulty").innerText = r.difficulty;
  document.getElementById("mempool").innerText = r.tx_pool_size;
  document.getElementById("nettype").innerText = r.nettype;

  // Progress
  let percent = 0;
  if (r.target_height > 0) {
    percent = (r.height / r.target_height) * 100;
  }

  document.getElementById("progress").style.width = percent + "%";
  document.getElementById("syncText").innerText =
    percent.toFixed(2) + "% synced";

  // ETA
  const now = Date.now();
  const deltaH = r.height - lastHeight;
  const deltaT = (now - lastTime) / 1000;

  if (deltaH > 0 && r.target_height > 0) {
    const speed = deltaH / deltaT;
    const remaining = r.target_height - r.height;
    const eta = Math.floor(remaining / speed);

    document.getElementById("eta").innerText = eta + " sec";
  }

  lastHeight = r.height;
  lastTime = now;
}

// PEERS
async function updatePeers() {
  const data = await rpc("get_connections");
  if (!data || !data.result) return;

  let html = "";

  data.result.connections.forEach(p => {
    html += `
      <tr>
        <td>${p.address}</td>
        <td>${p.incoming ? "IN" : "OUT"}</td>
        <td>${p.height}</td>
        <td>${p.ping}</td>
      </tr>
    `;
  });

  document.getElementById("peerTable").innerHTML = html;
}

// BLOCKS
async function updateBlocks() {
  const info = await rpc("get_info");
  if (!info) return;

  const height = info.result.height;
  const start = Math.max(0, height - 10);

  const data = await rpc("get_block_headers_range", {
    start_height: start,
    end_height: height
  });

  if (!data || !data.result) return;

  let html = "";

  data.result.headers.reverse().forEach(b => {
    html += `
      <div class="block">
        #${b.height} • TX: ${b.num_txes}
      </div>
    `;
  });

  document.getElementById("blocksList").innerHTML = html;
}

// MINING
async function startMining() {
  const address = prompt("Enter Nerva address:");
  if (!address) return;

  const res = await rpc("start_mining", {
    miner_address: address,
    threads_count: 1
  });

  if (!res) {
    alert("Mining failed");
    return;
  }

  document.getElementById("miningStatus").innerText = "Mining active";
}

async function stopMining() {
  await rpc("stop_mining");
  document.getElementById("miningStatus").innerText = "Stopped";
}

// SYSTEM
async function updateSystem() {
  const res = await fetch("/json_rpc");
  const d = await res.json();

  function gb(x){ return (x / 1e9).toFixed(1) + " GB"; }

  document.getElementById("disk").innerText =
    `${gb(d.used)} / ${gb(d.total)}`;
}

// CONNECT
function showConnect() {
  const url = window.location.hostname;
  alert(`RPC Endpoint:\nhttp://${url}:17566`);
}

// LOOP
setInterval(() => {
  updateOverview();
  updatePeers();
  updateBlocks();
  updateSystem();
}, 5000);

updateOverview();
updatePeers();
updateBlocks();
updateSystem();
