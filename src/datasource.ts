import { DataSource } from 'typeorm';

export const dataSource = new DataSource({
  type: 'better-sqlite3',
  database: '../gestionTournoi.db',
  entities: [import.meta.dirname + '/**/*.entity{.ts,.js}'],
  synchronize: true,
  invalidWhereValuesBehavior: {
    undefined: 'ignore',
  },
});

try {
  await dataSource.initialize();
  console.log('Data Source has been initialized!');
} catch (error) {
  console.error('Error during Data Source initialization', error);
}
