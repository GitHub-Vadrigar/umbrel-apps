async function getStatus() {
  try {
    const res = await fetch("http://localhost:17566/json_rpc", {
      method: "POST",
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: "0",
        method: "get_info"
      })
    });

    const data = await res.json();

    document.getElementById("status").innerText =
      "Block height: " + data.result.height;
  } catch (e) {
    document.getElementById("status").innerText = "Node not ready";
  }
}

setInterval(getStatus, 3000);
