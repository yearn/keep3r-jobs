import 'dotenv/config';
import { AutotaskClient } from 'defender-autotask-client';
import inquirer from 'inquirer';
import path from 'path';
import fs from 'fs';

// Sample typescript type definitions
type EnvInfo = {
  OZ_DEFENDER_API_KEY: string;
  OZ_DEFENDER_API_SECRET: string;
};

async function main(): Promise<void> {
  return new Promise((resolve, reject) => {
    let autotasks = fs.readdirSync(path.resolve(__dirname, '../autotasks'));
    autotasks = autotasks.map((autotask) => autotask.substr(0, autotask.length - 3));
    inquirer
      .prompt([
        {
          message: 'Select autotask to update',
          type: 'list',
          name: 'autotask',
          choices: autotasks,
        },
      ])
      .then(async (answer: any) => {
        const { autotask } = answer;
        console.log(`Updating autotask ${autotask}`);
        console.time(`Updated autotask ${autotask}`);
        const autotaskCode = fs.readFileSync(path.resolve(__dirname, `../dist/${autotask}.js`), { encoding: 'utf-8' });
        const autotaskFile = require(`../dist/${autotask}.js`);
        const { OZ_DEFENDER_API_KEY: apiKey, OZ_DEFENDER_API_SECRET: apiSecret } = process.env as EnvInfo;
        const client = new AutotaskClient({
          apiKey,
          apiSecret,
        });
        await client.updateCodeFromSources(autotaskFile.id, { 'index.js': autotaskCode });
        console.timeEnd(`Updated autotask ${autotask}`);
        resolve();
      })
      .catch(reject);
  });
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
