/*import dotenv from 'dotenv';
dotenv.config();

import {neon} from '@neondatabase/serverless'

const sql = neon(`${process.env.DATABASE_URL}`);

export default sql;*/

// db.js
import dotenv from 'dotenv';
dotenv.config();

import { neon } from '@neondatabase/serverless';

let sql;
if (!global.sql) {
  global.sql = neon(process.env.DATABASE_URL);
}
sql = global.sql;

export default sql;
