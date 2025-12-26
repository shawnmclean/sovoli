import { createServer as createHttpsServer } from "node:https";
import { createServer as createHttpServer } from "node:http";
import { readFileSync } from "node:fs";
import { fileURLToPath, parse } from "node:url";
import { dirname, join } from "node:path";
import next from "next";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Always use production build for start command
const dev = false;
const hostname = process.env.HOSTNAME || "localhost";
const httpPort = parseInt(process.env.PORT || "3000", 10);
const httpsPort = parseInt(process.env.HTTPS_PORT || "3443", 10);

const app = next({ dev, hostname });
const handle = app.getRequestHandler();

// Try to find certificates
let keyPath = null;
let certPath = null;

// Check environment variables first
if (process.env.HTTPS_KEY && process.env.HTTPS_CERT) {
  try {
    readFileSync(process.env.HTTPS_KEY);
    readFileSync(process.env.HTTPS_CERT);
    keyPath = process.env.HTTPS_KEY;
    certPath = process.env.HTTPS_CERT;
  } catch {
    // Continue to file-based paths
  }
}

// Try mkcert directory
if (!keyPath || !certPath) {
  const mkcertKey = join(process.cwd(), "mkcert", "localhost-key.pem");
  const mkcertCert = join(process.cwd(), "mkcert", "localhost.pem");
  try {
    readFileSync(mkcertKey);
    readFileSync(mkcertCert);
    keyPath = mkcertKey;
    certPath = mkcertCert;
  } catch {
    // Continue to alternative location
  }
}

// Try certificates directory
if (!keyPath || !certPath) {
  const certDirKey = join(process.cwd(), "certificates", "localhost-key.pem");
  const certDirCert = join(process.cwd(), "certificates", "localhost.pem");
  try {
    readFileSync(certDirKey);
    readFileSync(certDirCert);
    keyPath = certDirKey;
    certPath = certDirCert;
  } catch {
    // Certificates not found
  }
}

const httpsOptions = keyPath && certPath
  ? {
      key: readFileSync(keyPath),
      cert: readFileSync(certPath),
    }
  : null;

app.prepare().then(() => {
  // Setup HTTP Server
  createHttpServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  }).listen(httpPort, hostname, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://${hostname}:${httpPort}`);
  });

  // Setup HTTPS Server (only if certificates are available)
  if (httpsOptions) {
    createHttpsServer(httpsOptions, (req, res) => {
      const parsedUrl = parse(req.url, true);
      handle(req, res, parsedUrl);
    }).listen(httpsPort, hostname, (err) => {
      if (err) throw err;
      console.log(`> Ready on https://${hostname}:${httpsPort}`);
    });
  } else {
    console.warn(
      "HTTPS certificates not found. HTTPS server will not be started.",
    );
    console.warn(
      "Certificates should be in one of: mkcert/, certificates/, or set HTTPS_KEY/HTTPS_CERT env vars",
    );
  }
});

