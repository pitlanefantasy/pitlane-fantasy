-- Tabla de usuarios
CREATE TABLE usuarios (
 id             SERIAL PRIMARY KEY,
 email          VARCHAR(255) UNIQUE NOT NULL, 
 nombre         VARCHAR(100) NOT NULL,
 password_hash  VARCHAR(255) NOT NULL,
 created_at      TIMESTAMP DEFAULT NOW()
);

-- Tabla de pilotos
CREATE TABLE pilotos (
  id          SERIAL PRIMARY KEY,
  nombre      VARCHAR(100) NOT NULL,
  numero      INTEGER NOT NULL,
  categoria   VARCHAR(10) NOT NULL,
  equipo      VARCHAR(100) NOT NULL,
  nacionalidad VARCHAR(50),
  precio      DECIMAL(5,2) NOT NULL,
  activo      BOOLEAN DEFAULT TRUE
);

-- Tabla de carreras
CREATE TABLE carreras (
  id          SERIAL PRIMARY KEY,
  nombre      VARCHAR(100) NOT NULL,
  circuito    VARCHAR(100) NOT NULL,
  pais        VARCHAR(50) NOT NULL,
  fecha       DATE NOT NULL,
  temporada   INTEGER NOT NULL,
  completada  BOOLEAN DEFAULT FALSE
);

-- Tabla de resultados por carrera
CREATE TABLE resultados (
  id              SERIAL PRIMARY KEY,
  carrera_id      INTEGER REFERENCES carreras(id),
  piloto_id       INTEGER REFERENCES pilotos(id),
  posicion_carrera INTEGER,
  posicion_qualy  INTEGER,
  posicion_sprint INTEGER,
  vuelta_rapida   BOOLEAN DEFAULT FALSE,
  abandono        BOOLEAN DEFAULT FALSE,
  puntos_fantasy  DECIMAL(6,2) DEFAULT 0
);

-- Tabla de ligas
CREATE TABLE ligas (
  id          SERIAL PRIMARY KEY,
  nombre      VARCHAR(100) NOT NULL,
  codigo      VARCHAR(10) UNIQUE NOT NULL,
  creador_id  INTEGER REFERENCES usuarios(id),
  temporada   INTEGER NOT NULL,
  publica     BOOLEAN DEFAULT FALSE,
  created_at  TIMESTAMP DEFAULT NOW()
);
-- Tabla de miembros de liga
CREATE TABLE liga_usuarios (
  id         SERIAL PRIMARY KEY,
  liga_id    INTEGER REFERENCES ligas(id),
  usuario_id INTEGER REFERENCES usuarios(id),
  joined_at  TIMESTAMP DEFAULT NOW(),
  UNIQUE(liga_id, usuario_id)
);
-- Liga global (se inserta una vez al inicio de temporada)
INSERT INTO ligas (nombre, codigo, creador_id, temporada, publica)
VALUES ('Ranking Global PitLane Fantasy 2027', 'GLOBAL-2027', NULL, 2027, TRUE);

-- Tabla de equipos (equipo de cada usuario por GP)
CREATE TABLE equipos (
  id              SERIAL PRIMARY KEY,
  usuario_id      INTEGER REFERENCES usuarios(id),
  carrera_id      INTEGER REFERENCES carreras(id),
  piloto_oro1_id  INTEGER REFERENCES pilotos(id),
  piloto_oro2_id  INTEGER REFERENCES pilotos(id),
  piloto_plata1_id INTEGER REFERENCES pilotos(id),
  piloto_plata2_id INTEGER REFERENCES pilotos(id),
  piloto_bronce_id INTEGER REFERENCES pilotos(id),
  capitan_id      INTEGER REFERENCES pilotos(id),
  comodin_usado   BOOLEAN DEFAULT FALSE,
  puntos_total    DECIMAL(8,2) DEFAULT 0,
  created_at      TIMESTAMP DEFAULT NOW(),
  UNIQUE(usuario_id, carrera_id)
);