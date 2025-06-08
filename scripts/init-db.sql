-- Inicialización de base de datos para QiangNet
-- Este script crea las tablas necesarias para el funcionamiento del sistema

-- Crear base de datos si no existe
CREATE DATABASE IF NOT EXISTS qiangnet;
USE qiangnet;

-- Tabla de usuarios
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(50) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('admin', 'moderator', 'user', 'guest') DEFAULT 'user',
    status ENUM('active', 'inactive', 'suspended', 'pending') DEFAULT 'pending',
    is_approved BOOLEAN DEFAULT FALSE,
    is_whitelisted BOOLEAN DEFAULT FALSE,
    last_login TIMESTAMP NULL,
    failed_login_attempts INT DEFAULT 0,
    locked_until TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_username (username),
    INDEX idx_status (status),
    INDEX idx_role (role)
);

-- Tabla de perfiles de usuario
CREATE TABLE IF NOT EXISTS user_profiles (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    user_id VARCHAR(36) NOT NULL,
    avatar_url VARCHAR(500),
    bio TEXT,
    preferences JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id)
);

-- Tabla de aplicaciones
CREATE TABLE IF NOT EXISTS applications (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    url VARCHAR(500) NOT NULL,
    icon VARCHAR(500),
    category ENUM('media', 'productivity', 'development', 'gaming', 'utility', 'other') DEFAULT 'other',
    status ENUM('active', 'inactive', 'maintenance') DEFAULT 'inactive',
    required_role ENUM('admin', 'moderator', 'user', 'guest') DEFAULT 'user',
    is_featured BOOLEAN DEFAULT FALSE,
    order_index INT DEFAULT 0,
    metadata JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_status (status),
    INDEX idx_category (category),
    INDEX idx_featured (is_featured),
    INDEX idx_order (order_index)
);

-- Tabla de logs de actividad
CREATE TABLE IF NOT EXISTS activity_logs (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    user_id VARCHAR(36),
    user_email VARCHAR(255),
    action VARCHAR(100) NOT NULL,
    resource VARCHAR(100),
    details JSON,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_user_id (user_id),
    INDEX idx_action (action),
    INDEX idx_created_at (created_at),
    INDEX idx_ip_address (ip_address)
);

-- Tabla de sesiones
CREATE TABLE IF NOT EXISTS user_sessions (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    user_id VARCHAR(36) NOT NULL,
    token_hash VARCHAR(255) NOT NULL,
    refresh_token_hash VARCHAR(255),
    ip_address VARCHAR(45),
    user_agent TEXT,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_token_hash (token_hash),
    INDEX idx_expires_at (expires_at)
);

-- Tabla de configuración del sistema
CREATE TABLE IF NOT EXISTS system_config (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    config_key VARCHAR(100) UNIQUE NOT NULL,
    config_value JSON,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_config_key (config_key)
);

-- Insertar usuario administrador por defecto
INSERT INTO users (
    email, 
    username, 
    full_name, 
    password_hash, 
    role, 
    status, 
    is_approved, 
    is_whitelisted
) VALUES (
    'admin@qiangnet.local',
    'admin',
    'Administrador',
    '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/RK.PJ/...',  -- Admin123!
    'admin',
    'active',
    TRUE,
    TRUE
) ON DUPLICATE KEY UPDATE
    role = 'admin',
    status = 'active',
    is_approved = TRUE,
    is_whitelisted = TRUE;

-- Insertar perfil del administrador
INSERT INTO user_profiles (user_id, bio, preferences)
SELECT id, 'Administrador del sistema QiangNet', '{"theme": "dark", "notifications": true}'
FROM users WHERE email = 'admin@qiangnet.local'
ON DUPLICATE KEY UPDATE
    bio = 'Administrador del sistema QiangNet';

-- Insertar aplicaciones de ejemplo
INSERT INTO applications (name, description, url, icon, category, status, is_featured) VALUES
('Plex Media Server', 'Servidor multimedia para streaming de contenido', 'http://plex.local:32400', '/icons/plex.png', 'media', 'active', TRUE),
('Nextcloud', 'Plataforma de almacenamiento en la nube', 'http://nextcloud.local', '/icons/nextcloud.png', 'productivity', 'active', TRUE),
('Portainer', 'Gestión de contenedores Docker', 'http://portainer.local:9000', '/icons/portainer.png', 'development', 'active', FALSE),
('Home Assistant', 'Automatización del hogar', 'http://homeassistant.local:8123', '/icons/homeassistant.png', 'utility', 'active', TRUE)
ON DUPLICATE KEY UPDATE
    status = VALUES(status),
    is_featured = VALUES(is_featured);

-- Insertar configuración inicial del sistema
INSERT INTO system_config (config_key, config_value, description) VALUES
('particles_enabled', 'true', 'Habilitar efectos de partículas en el fondo'),
('registration_enabled', 'false', 'Permitir registro de nuevos usuarios'),
('approval_required', 'true', 'Requerir aprobación manual para nuevos usuarios'),
('max_login_attempts', '5', 'Máximo número de intentos de login antes del bloqueo'),
('session_timeout', '86400', 'Tiempo de expiración de sesión en segundos (24 horas)')
ON DUPLICATE KEY UPDATE
    config_value = VALUES(config_value);

-- Crear índices adicionales para optimización
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at);
CREATE INDEX IF NOT EXISTS idx_applications_created_at ON applications(created_at);
CREATE INDEX IF NOT EXISTS idx_activity_logs_user_action ON activity_logs(user_id, action);

-- Crear vistas útiles
CREATE OR REPLACE VIEW active_users AS
SELECT u.*, up.avatar_url, up.bio
FROM users u
LEFT JOIN user_profiles up ON u.id = up.user_id
WHERE u.status = 'active';

CREATE OR REPLACE VIEW featured_applications AS
SELECT *
FROM applications
WHERE status = 'active' AND is_featured = TRUE
ORDER BY order_index, name;

-- Procedimiento para limpiar sesiones expiradas
DELIMITER //
CREATE PROCEDURE CleanExpiredSessions()
BEGIN
    DELETE FROM user_sessions WHERE expires_at < NOW();
END //
DELIMITER ;

-- Evento para limpiar sesiones automáticamente (cada hora)
CREATE EVENT IF NOT EXISTS clean_expired_sessions
ON SCHEDULE EVERY 1 HOUR
DO
    CALL CleanExpiredSessions();

COMMIT;
