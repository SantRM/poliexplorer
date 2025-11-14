-- Eliminar la base de datos si ya existe
DROP DATABASE IF EXISTS poliexplorer;

-- Crear una nueva base de datos
CREATE DATABASE poliexplorer CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Usar la base de datos creada
USE poliexplorer;

-- Crear la tabla usuarios
CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    contrasena VARCHAR(255) NOT NULL,
    rol ENUM('estudiante', 'profesor') NOT NULL,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    token_recuperacion VARCHAR(100),
    token_expira BIGINT

);

-- Crear la tabla materias 
CREATE TABLE materias (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    cantidad_creditos INT NOT NULL,
    numero_semestre INT NOT NULL,
    intensidad_horaria INT NOT NULL
);


-- Crear la tabla contenidos
CREATE TABLE contenidos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    id_materia INT NOT NULL,
    nombre VARCHAR(255) NOT NULL,
    tipo ENUM('Video (URL)', 'Documento') NOT NULL,
    contenido TEXT,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id),
    FOREIGN KEY (id_materia) REFERENCES materias(id)
);

-- Crear la tabla valoraciones
CREATE TABLE valoraciones (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    id_materia INT NOT NULL,
    calificacion INT NOT NULL CHECK (calificacion BETWEEN 1 AND 5),
    comentario TEXT,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id),
    FOREIGN KEY (id_materia) REFERENCES materias(id)
);


-- primer semestre
INSERT INTO materias (nombre, descripcion, cantidad_creditos, numero_semestre, intensidad_horaria) VALUES
('Introducción al área profesional', 'Estudia la carrera, su enfoque, aplicación y perfil profesional.', 3, 1,3),
('Algoritmos y programación 1', 'Aprende lógica, algoritmos y estructuras en programación.', 4, 1,6),
('Lengua Materna', 'Desarrolla habilidades en lectura, escritura, comprensión y expresión.', 2, 1,4),
('Cálculo Diferencial', 'Introduce funciones, límites, derivadas y sus aplicaciones.', 3, 1,3),
('Humanidades 1', 'Analiza al ser humano desde una perspectiva ética y social.', 2, 1,4),
('Matemáticas discretas 1', 'Estudia lógica, conjuntos, funciones, relaciones y métodos de conteo.', 4, 1,4);


-- segundo semestre
INSERT INTO materias (nombre, descripcion, cantidad_creditos, numero_semestre, intensidad_horaria) VALUES 
('Algoritmos y programación 2', 'Estructuras de datos, recursividad y programación modular.', 4, 2, 6),
('Matemáticas discretas 2', 'Grafos, lógica, funciones recursivas y teoría de conjuntos aplicadas.', 4, 2, 4),
('Física del Movimiento', 'Estudio de movimiento, leyes de Newton, trabajo y energía.', 4, 2, 6),
('Geometría vectorial', 'Vectores, planos, rectas y sistemas de coordenadas en el espacio.', 3, 2, 3),
('Cálculo Integral', 'Integración, aplicaciones y métodos matemáticos.', 3, 2, 3),
('Deporte, arte y recreación', 'Desarrollo físico, artístico y recreativo a través de actividades.', 1, 2, 2);
