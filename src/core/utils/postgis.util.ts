import sequelize from 'sequelize';

export const WGS84ToLambert93 = geom => {
  return sequelize.fn('ST_Transform', geom, 2154);
};
