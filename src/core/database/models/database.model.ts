export interface DatabaseConfigAttributes {
  username?: string;
  password?: string;
  database?: string;
  host?: string;
  port?: number | string;
  dialect?: string;
  urlDatabase?: string;
  schema?: string;
}

export interface DatabaseConfig {
  development: DatabaseConfigAttributes;
  test: DatabaseConfigAttributes;
  production: DatabaseConfigAttributes;
}
