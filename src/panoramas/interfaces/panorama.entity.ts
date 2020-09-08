import { Column, DataType, Model, Table } from 'sequelize-typescript';

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
  location: GeoJSON.Point;

  hotspots: {
    distance: number;
    direction: number;
  }[];
}
