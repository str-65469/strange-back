import { Connection } from 'typeorm';

export const testing = (conn: Connection) => {
  console.log('hello');
};
