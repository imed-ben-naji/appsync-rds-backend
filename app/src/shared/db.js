const { SecretsManagerClient, GetSecretValueCommand } = require("@aws-sdk/client-secrets-manager");
const { Client } = require("pg");

const secretsClient = new SecretsManagerClient();
let dbClient = null;

async function getDbConnection() {
  if (dbClient) return dbClient;

  // For local development, use mock credentials
  if (process.env.DB_SECRET_ARN === 'mock-secret-arn') {
    const client = new Client({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
      port: 5432,
      database: process.env.DB_NAME || 'localdb'
    });
    await client.connect();
    dbClient = client;
    return dbClient;
  }

  console.log('Fetching database credentials from Secrets Manager...');
  const command = new GetSecretValueCommand({ SecretId: process.env.DB_SECRET_ARN });
  const response = await secretsClient.send(command);
  const secret = JSON.parse(response.SecretString);

  console.log(`Connecting to database at: ${process.env.DB_ENDPOINT}`);

  const client = new Client({
    host: process.env.DB_ENDPOINT.split(':')[0],
    user: secret.username,
    password: secret.password,
    port: secret.port || 5432,
    database: secret.dbname || process.env.DB_NAME,
  });

  await client.connect();
  dbClient = client;

  console.log('Successfully connected to database');
  return dbClient;
}

async function ensureTableExists(client) {
  await client.query(`
    CREATE TABLE IF NOT EXISTS items (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      description TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
}

module.exports = {
  getDbConnection,
  ensureTableExists
};