import { Column, DataType, Model, Table } from 'sequelize-typescript';
import { Location } from './models/panoramas.model';

@Table
export class Panorama extends Model<Panorama> {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  image: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  timestamp: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  direction: number;

  @Column({
    type: DataType.GEOMETRY,
    allowNull: false,
  })
  location: Location;

  hotspots: {
    distance: number;
    direction: number;
  }[];
}
