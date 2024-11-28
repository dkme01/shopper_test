import { database } from '../../config/database';
import { Driver } from '../../models/driver';

export function findDriverById(id?: string): Driver | null {
  const findDriver = database.prepare('SELECT * FROM drivers WHERE id = ?');
  return id ? findDriver.get(id) as Driver | null : null;
}

export function listDrivers(distance: number): Driver[] {
  const listDrivers = database.prepare('SELECT * FROM drivers WHERE ? > minimum_km');
  return listDrivers.all(distance) as Driver[];
}


