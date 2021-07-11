require("dotenv").config();
const BRANDNAME = process.env.BRAND_NAME;
const elasticApm = require("elastic-apm-node");
exports.apm = () => {
  if (process.env.APM_SERVER_URL && process.env.ENVIRONMENT) {
    elasticApm.start({
      // Override the service name from package.json
      // Allowed characters: a-z, A-Z, 0-9, -, _, and space
      serviceName: `ms-${BRANDNAME}-emailer`,

      // Use if APM Server requires a secret token
      secretToken: "",

      // Set the custom APM Server URL (default: http://localhost:8200)
      serverUrl: `${process.env.APM_SERVER_URL}`,

      // Set the service environment
      environment: `${process.env.ENVIRONMENT}`,
    });
    console.log("APM Monitoring");
  } else {
    console.log("APM ENVOIRNMENT VARIABLES NOT SET");
  }
};
