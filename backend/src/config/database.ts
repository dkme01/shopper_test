import Database from 'better-sqlite3';
import path from 'path';

import fs from 'fs';
import { AVAILABLE_DRIVERS } from '../data/drivers';

const dbDir = path.resolve(__dirname, '../../db');
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const dbPath = path.resolve(dbDir, 'shopper-test.sqlite');
const db = new Database(dbPath, {
  verbose: console.log,
  fileMustExist: false
});

function isDatabaseNew(): boolean {
  try {
    const stmt = db.prepare('SELECT COUNT(*) as count FROM drivers');
    const result = stmt.get() as { count: number };

    return result.count === 0;
  } catch {
    return true;
  }
}

function initializeDatabase() {
  db.prepare(/* sql */`
    CREATE TABLE IF NOT EXISTS drivers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      vehicle TEXT,
      review_rating REAL,
      review_comment TEXT,
      rate_per_km REAL NOT NULL,
      minimum_km REAL NOT NULL
    )
  `).run();

  db.prepare(/* sql */`
    CREATE TABLE IF NOT EXISTS rides (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      customer_id TEXT NOT NULL,
      origin TEXT NOT NULL,
      destination TEXT NOT NULL,
      distance REAL NOT NULL,
      duration TEXT NOT NULL,
      driver_id TEXT NOT NULL,
      driver_name TEXT NOT NULL,
      value REAL NOT NULL,
      date DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(driver_id) REFERENCES drivers(id)
    )
  `).run();

  if (isDatabaseNew()) {
    const insertDriver = db.prepare(/* sql */`
        INSERT INTO drivers (
          id,
          name,
          description,
          vehicle,
          review_rating,
          review_comment,
          rate_per_km,
          minimum_km
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `
    )

    const populateDrivers = db.transaction((drivers) => {
      for (const driver of drivers) {
        insertDriver.run(
          driver.id,
          driver.name,
          driver.description,
          driver.vehicle,
          driver.review_rating,
          driver.review_comment,
          driver.rate_per_km,
          driver.minimum_km
        );
      }
    });

    populateDrivers(AVAILABLE_DRIVERS);
  }


  return db;
}

export const database = initializeDatabase();
