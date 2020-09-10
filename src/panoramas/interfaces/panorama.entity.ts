import { ApiProperty } from '@nestjs/swagger';
import { Column, DataType, Model, Table } from 'sequelize-typescript';

@Table
export class Panorama extends Model<Panorama> {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  @ApiProperty({ type: Number, description: 'The unique id' })
  id: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  @ApiProperty({ type: String, description: 'The path to the image 360' })
  image: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  @ApiProperty({ type: Number, description: 'The timestamp of the panorama' })
  timestamp: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  @ApiProperty({ type: Number, description: 'The angle following the north' })
  direction: number;

  @Column({
    type: DataType.GEOMETRY,
    allowNull: false,
  })
  @ApiProperty({ type: [Number], description: 'The location of the panorama' })
  location: GeoJSON.Point;
}
