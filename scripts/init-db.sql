-- Inicialización de la base de datos para QiangNet

-- Crear extensiones
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Crear tablas

-- Tabla de usuarios
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'user',
    status VARCHAR(20) NOT NULL DEFAULT 'pending',
    is_approved BOOLEAN NOT NULL DEFAULT FALSE,
    is_whitelisted BOOLEAN NOT NULL DEFAULT FALSE,
    last_login TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Tabla de perfiles de usuario
CREATE TABLE IF NOT EXISTS user_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    avatar_url TEXT,
    bio TEXT,
    preferences JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Tabla de aplicaciones
CREATE TABLE IF NOT EXISTS applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    icon TEXT,
    url TEXT NOT NULL,
    category VARCHAR(50) NOT NULL DEFAULT 'other',
    status VARCHAR(20) NOT NULL DEFAULT 'inactive',
    required_role VARCHAR(20) NOT NULL DEFAULT 'user',
    is_featured BOOLEAN NOT NULL DEFAULT FALSE,
    order_index INTEGER NOT NULL DEFAULT 0,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Tabla de accesos a aplicaciones
CREATE TABLE IF NOT EXISTS application_access (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    application_id UUID NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
    last_access TIMESTAMP WITH TIME ZONE,
    access_count INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    UNIQUE(user_id, application_id)
);

-- Tabla de logs del sistema
CREATE TABLE IF NOT EXISTS system_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    level VARCHAR(20) NOT NULL,
    action VARCHAR(100) NOT NULL,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    user_email VARCHAR(255),
    ip_address VARCHAR(45),
    user_agent TEXT,
    details JSONB DEFAULT '{}'
);

-- Tabla de configuración del sistema
CREATE TABLE IF NOT EXISTS system_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    key VARCHAR(100) UNIQUE NOT NULL,
    value JSONB NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Tabla de tokens de refresco
CREATE TABLE IF NOT EXISTS refresh_tokens (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token VARCHAR(255) UNIQUE NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    revoked BOOLEAN NOT NULL DEFAULT FALSE,
    revoked_at TIMESTAMP WITH TIME ZONE
);

-- Tabla de configuración de partículas
CREATE TABLE IF NOT EXISTS particle_configs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    is_default BOOLEAN NOT NULL DEFAULT FALSE,
    config JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_status ON users(status);
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_applications_category ON applications(category);
CREATE INDEX IF NOT EXISTS idx_applications_status ON applications(status);
CREATE INDEX IF NOT EXISTS idx_applications_required_role ON applications(required_role);
CREATE INDEX IF NOT EXISTS idx_application_access_user_id ON application_access(user_id);
CREATE INDEX IF NOT EXISTS idx_application_access_application_id ON application_access(application_id);
CREATE INDEX IF NOT EXISTS idx_system_logs_timestamp ON system_logs(timestamp);
CREATE INDEX IF NOT EXISTS idx_system_logs_level ON system_logs(level);
CREATE INDEX IF NOT EXISTS idx_system_logs_action ON system_logs(action);
CREATE INDEX IF NOT EXISTS idx_system_logs_user_id ON system_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_refresh_tokens_user_id ON refresh_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_refresh_tokens_token ON refresh_tokens(token);
CREATE INDEX IF NOT EXISTS idx_particle_configs_user_id ON particle_configs(user_id);

-- Funciones y triggers
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para actualizar updated_at en users
CREATE TRIGGER update_users_updated_at
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();

-- Trigger para actualizar updated_at en user_profiles
CREATE TRIGGER update_user_profiles_updated_at
BEFORE UPDATE ON user_profiles
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();

-- Trigger para actualizar updated_at en applications
CREATE TRIGGER update_applications_updated_at
BEFORE UPDATE ON applications
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();

-- Trigger para actualizar updated_at en application_access
CREATE TRIGGER update_application_access_updated_at
BEFORE UPDATE ON application_access
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();

-- Trigger para actualizar updated_at en system_settings
CREATE TRIGGER update_system_settings_updated_at
BEFORE UPDATE ON system_settings
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();

-- Trigger para actualizar updated_at en particle_configs
CREATE TRIGGER update_particle_configs_updated_at
BEFORE UPDATE ON particle_configs
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();

-- Insertar datos iniciales

-- Usuario administrador
INSERT INTO users (email, username, password_hash, full_name, role, status, is_approved, is_whitelisted)
VALUES (
    'admin@qiangnet.local',
    'admin',
    crypt('Admin123!', gen_salt('bf')),
    'Administrador',
    'admin',
    'active',
    TRUE,
    TRUE
) ON CONFLICT (email) DO NOTHING;

-- Perfil del administrador
INSERT INTO user_profiles (user_id, avatar_url, bio)
SELECT id, '/placeholder.svg?height=200&width=200', 'Administrador del sistema'
FROM users
WHERE email = 'admin@qiangnet.local'
AND NOT EXISTS (
    SELECT 1 FROM user_profiles WHERE user_id = users.id
);

-- Usuario normal
INSERT INTO users (email, username, password_hash, full_name, role, status, is_approved, is_whitelisted)
VALUES (
    'user@qiangnet.local',
    'user',
    crypt('User123!', gen_salt('bf')),
    'Usuario Normal',
    'user',
    'active',
    TRUE,
    TRUE
) ON CONFLICT (email) DO NOTHING;

-- Perfil del usuario normal
INSERT INTO user_profiles (user_id, avatar_url, bio)
SELECT id, '/placeholder.svg?height=200&width=200', 'Usuario del sistema'
FROM users
WHERE email = 'user@qiangnet.local'
AND NOT EXISTS (
    SELECT 1 FROM user_profiles WHERE user_id = users.id
);

-- Aplicaciones de ejemplo
INSERT INTO applications (name, description, icon, url, category, status, required_role, is_featured, order_index)
VALUES
    ('Plex Media Server', 'Servidor multimedia para organizar y transmitir tu colección de películas, series y música.', '/placeholder.svg?height=64&width=64', 'http://plex.local:32400', 'media', 'active', 'user', TRUE, 1),
    ('Nextcloud', 'Plataforma de productividad y almacenamiento en la nube de código abierto.', '/placeholder.svg?height=64&width=64', 'http://nextcloud.local', 'productivity', 'active', 'user', TRUE, 2),
    ('Home Assistant', 'Plataforma de automatización del hogar de código abierto.', '/placeholder.svg?height=64&width=64', 'http://homeassistant.local:8123', 'system', 'active', 'user', TRUE, 3),
    ('Portainer', 'Gestión de contenedores Docker a través de una interfaz web.', '/placeholder.svg?height=64&width=64', 'http://portainer.local:9000', 'development', 'active', 'admin', FALSE, 4),
    ('Jellyfin', 'Servidor multimedia de código abierto.', '/placeholder.svg?height=64&width=64', 'http://jellyfin.local:8096', 'media', 'active', 'user', FALSE, 5),
    ('Grafana', 'Plataforma de análisis y monitorización.', '/placeholder.svg?height=64&width=64', 'http://grafana.local:3000', 'development', 'active', 'admin', FALSE, 6),
    ('Minecraft Server', 'Servidor de Minecraft para jugar con amigos.', '/placeholder.svg?height=64&width=64', 'http://minecraft.local:25565', 'gaming', 'active', 'user', FALSE, 7),
    ('Transmission', 'Cliente BitTorrent ligero y multiplataforma.', '/placeholder.svg?height=64&width=64', 'http://transmission.local:9091', 'media', 'maintenance', 'user', FALSE, 8),
    ('Pi-hole', 'Bloqueador de anuncios y rastreadores a nivel de red.', '/placeholder.svg?height=64&width=64', 'http://pihole.local/admin', 'system', 'active', 'admin', FALSE, 9),
    ('Bitwarden', 'Gestor de contraseñas de código abierto.', '/placeholder.svg?height=64&width=64', 'http://bitwarden.local', 'productivity', 'inactive', 'guest', FALSE, 10)
ON CONFLICT DO NOTHING;

-- Configuración del sistema
INSERT INTO system_settings (key, value, description)
VALUES
    ('general', '{"site_name": "QiangNet", "site_description": "Sistema de gestión de servidor doméstico", "allow_registration": true, "require_approval": true}', 'Configuración general del sistema'),
    ('security', '{"max_login_attempts": 5, "lockout_time": 15, "password_expiry_days": 90, "session_timeout": 30}', 'Configuración de seguridad'),
    ('appearance', '{"theme": "system", "accent_color": "blue", "enable_animations": true}', 'Configuración de apariencia'),
    ('notifications', '{"email_notifications": true, "browser_notifications": true, "notification_frequency": "immediate"}', 'Configuración de notificaciones')
ON CONFLICT (key) DO NOTHING;

-- Configuraciones de partículas predefinidas
INSERT INTO particle_configs (user_id, name, is_default, config)
SELECT 
    id, 
    'Default', 
    TRUE, 
    '{"particles":{"number":{"value":80,"density":{"enable":true,"value_area":800}},"color":{"value":"#3b82f6"},"shape":{"type":"circle","stroke":{"width":0,"color":"#000000"},"polygon":{"nb_sides":5}},"opacity":{"value":0.5,"random":false,"anim":{"enable":false,"speed":1,"opacity_min":0.1,"sync":false}},"size":{"value":3,"random":true,"anim":{"enable":false,"speed":40,"size_min":0.1,"sync":false}},"line_linked":{"enable":true,"distance":150,"color":"#3b82f6","opacity":0.4,"width":1},"move":{"enable":true,"speed":2,"direction":"none","random":false,"straight":false,"out_mode":"out","bounce":false,"attract":{"enable":false,"rotateX":600,"rotateY":1200}}},"interactivity":{"detect_on":"canvas","events":{"onhover":{"enable":true,"mode":"grab"},"onclick":{"enable":true,"mode":"push"},"resize":true},"modes":{"grab":{"distance":140,"line_linked":{"opacity":1}},"bubble":{"distance":400,"size":40,"duration":2,"opacity":8,"speed":3},"repulse":{"distance":200,"duration":0.4},"push":{"particles_nb":4},"remove":{"particles_nb":2}}},"retina_detect":true}'::jsonb
FROM users
WHERE email = 'admin@qiangnet.local'
AND NOT EXISTS (
    SELECT 1 FROM particle_configs WHERE name = 'Default' AND is_default = TRUE
);

-- Insertar configuraciones de partículas adicionales para el administrador
INSERT INTO particle_configs (user_id, name, is_default, config)
SELECT 
    id, 
    'Stars', 
    FALSE, 
    '{"particles":{"number":{"value":100,"density":{"enable":true,"value_area":800}},"color":{"value":"#ffffff"},"shape":{"type":"circle","stroke":{"width":0,"color":"#000000"},"polygon":{"nb_sides":5}},"opacity":{"value":0.5,"random":true,"anim":{"enable":false,"speed":1,"opacity_min":0.1,"sync":false}},"size":{"value":3,"random":true,"anim":{"enable":false,"speed":40,"size_min":0.1,"sync":false}},"line_linked":{"enable":false,"distance":150,"color":"#ffffff","opacity":0.4,"width":1},"move":{"enable":true,"speed":1,"direction":"none","random":true,"straight":false,"out_mode":"out","bounce":false,"attract":{"enable":false,"rotateX":600,"rotateY":1200}}},"interactivity":{"detect_on":"canvas","events":{"onhover":{"enable":true,"mode":"bubble"},"onclick":{"enable":true,"mode":"repulse"},"resize":true},"modes":{"grab":{"distance":400,"line_linked":{"opacity":1}},"bubble":{"distance":250,"size":0,"duration":2,"opacity":0,"speed":3},"repulse":{"distance":400,"duration":0.4},"push":{"particles_nb":4},"remove":{"particles_nb":2}}},"retina_detect":true}'::jsonb
FROM users
WHERE email = 'admin@qiangnet.local'
AND NOT EXISTS (
    SELECT 1 FROM particle_configs WHERE name = 'Stars' AND user_id = users.id
);

INSERT INTO particle_configs (user_id, name, is_default, config)
SELECT 
    id, 
    'Bubbles', 
    FALSE, 
    '{"particles":{"number":{"value":30,"density":{"enable":true,"value_area":800}},"color":{"value":"#1e90ff"},"shape":{"type":"circle","stroke":{"width":0,"color":"#000000"},"polygon":{"nb_sides":5}},"opacity":{"value":0.7,"random":false,"anim":{"enable":false,"speed":1,"opacity_min":0.1,"sync":false}},"size":{"value":10,"random":true,"anim":{"enable":true,"speed":2,"size_min":0.1,"sync":false}},"line_linked":{"enable":false,"distance":150,"color":"#ffffff","opacity":0.4,"width":1},"move":{"enable":true,"speed":1,"direction":"top","random":true,"straight":false,"out_mode":"out","bounce":false,"attract":{"enable":false,"rotateX":600,"rotateY":1200}}},"interactivity":{"detect_on":"canvas","events":{"onhover":{"enable":true,"mode":"bubble"},"onclick":{"enable":true,"mode":"push"},"resize":true},"modes":{"grab":{"distance":400,"line_linked":{"opacity":1}},"bubble":{"distance":200,"size":20,"duration":2,"opacity":8,"speed":3},"repulse":{"distance":200,"duration":0.4},"push":{"particles_nb":4},"remove":{"particles_nb":2}}},"retina_detect":true}'::jsonb
FROM users
WHERE email = 'admin@qiangnet.local'
AND NOT EXISTS (
    SELECT 1 FROM particle_configs WHERE name = 'Bubbles' AND user_id = users.id
);

INSERT INTO particle_configs (user_id, name, is_default, config)
SELECT 
    id, 
    'Connections', 
    FALSE, 
    '{"particles":{"number":{"value":80,"density":{"enable":true,"value_area":800}},"color":{"value":"#00ff00"},"shape":{"type":"circle","stroke":{"width":0,"color":"#000000"},"polygon":{"nb_sides":5}},"opacity":{"value":0.5,"random":false,"anim":{"enable":false,"speed":1,"opacity_min":0.1,"sync":false}},"size":{"value":3,"random":true,"anim":{"enable":false,"speed":40,"size_min":0.1,"sync":false}},"line_linked":{"enable":true,"distance":150,"color":"#00ff00","opacity":0.4,"width":1},"move":{"enable":true,"speed":3,"direction":"none","random":false,"straight":false,"out_mode":"out","bounce":false,"attract":{"enable":false,"rotateX":600,"rotateY":1200}}},"interactivity":{"detect_on":"canvas","events":{"onhover":{"enable":true,"mode":"grab"},"onclick":{"enable":true,"mode":"push"},"resize":true},"modes":{"grab":{"distance":140,"line_linked":{"opacity":1}},"bubble":{"distance":400,"size":40,"duration":2,"opacity":8,"speed":3},"repulse":{"distance":200,"duration":0.4},"push":{"particles_nb":4},"remove":{"particles_nb":2}}},"retina_detect":true}'::jsonb
FROM users
WHERE email = 'admin@qiangnet.local'
AND NOT EXISTS (
    SELECT 1 FROM particle_configs WHERE name = 'Connections' AND user_id = users.id
);

INSERT INTO particle_configs (user_id, name, is_default, config)
SELECT 
    id, 
    'Snow', 
    FALSE, 
    '{"particles":{"number":{"value":400,"density":{"enable":true,"value_area":800}},"color":{"value":"#ffffff"},"shape":{"type":"circle","stroke":{"width":0,"color":"#000000"},"polygon":{"nb_sides":5}},"opacity":{"value":0.5,"random":true,"anim":{"enable":false,"speed":1,"opacity_min":0.1,"sync":false}},"size":{"value":3,"random":true,"anim":{"enable":false,"speed":40,"size_min":0.1,"sync":false}},"line_linked":{"enable":false,"distance":500,"color":"#ffffff","opacity":0.4,"width":2},"move":{"enable":true,"speed":1,"direction":"bottom","random":false,"straight":false,"out_mode":"out","bounce":false,"attract":{"enable":false,"rotateX":600,"rotateY":1200}}},"interactivity":{"detect_on":"canvas","events":{"onhover":{"enable":true,"mode":"bubble"},"onclick":{"enable":true,"mode":"repulse"},"resize":true},"modes":{"grab":{"distance":400,"line_linked":{"opacity":0.5}},"bubble":{"distance":400,"size":4,"duration":0.3,"opacity":1,"speed":3},"repulse":{"distance":200,"duration":0.4},"push":{"particles_nb":4},"remove":{"particles_nb":2}}},"retina_detect":true}'::jsonb
FROM users
WHERE email = 'admin@qiangnet.local'
AND NOT EXISTS (
    SELECT 1 FROM particle_configs WHERE name = 'Snow' AND user_id = users.id
);

INSERT INTO particle_configs (user_id, name, is_default, config)
SELECT 
    id, 
    'Fireflies', 
    FALSE, 
    '{"particles":{"number":{"value":50,"density":{"enable":true,"value_area":800}},"color":{"value":"#ffff00"},"shape":{"type":"circle","stroke":{"width":0,"color":"#000000"},"polygon":{"nb_sides":5}},"opacity":{"value":0.7,"random":true,"anim":{"enable":true,"speed":1,"opacity_min":0.1,"sync":false}},"size":{"value":3,"random":true,"anim":{"enable":true,"speed":2,"size_min":0.1,"sync":false}},"line_linked":{"enable":false,"distance":150,"color":"#ffffff","opacity":0.4,"width":1},"move":{"enable":true,"speed":1,"direction":"none","random":true,"straight":false,"out_mode":"out","bounce":false,"attract":{"enable":false,"rotateX":600,"rotateY":1200}}},"interactivity":{"detect_on":"canvas","events":{"onhover":{"enable":true,"mode":"bubble"},"onclick":{"enable":true,"mode":"repulse"},"resize":true},"modes":{"grab":{"distance":400,"line_linked":{"opacity":1}},"bubble":{"distance":250,"size":0,"duration":2,"opacity":0,"speed":3},"repulse":{"distance":400,"duration":0.4},"push":{"particles_nb":4},"remove":{"particles_nb":2}}},"retina_detect":true}'::jsonb
FROM users
WHERE email = 'admin@qiangnet.local'
AND NOT EXISTS (
    SELECT 1 FROM particle_configs WHERE name = 'Fireflies' AND user_id = users.id
);

-- Configuración de partículas para el usuario normal
INSERT INTO particle_configs (user_id, name, is_default, config)
SELECT 
    id, 
    'Default', 
    TRUE, 
    '{"particles":{"number":{"value":80,"density":{"enable":true,"value_area":800}},"color":{"value":"#3b82f6"},"shape":{"type":"circle","stroke":{"width":0,"color":"#000000"},"polygon":{"nb_sides":5}},"opacity":{"value":0.5,"random":false,"anim":{"enable":false,"speed":1,"opacity_min":0.1,"sync":false}},"size":{"value":3,"random":true,"anim":{"enable":false,"speed":40,"size_min":0.1,"sync":false}},"line_linked":{"enable":true,"distance":150,"color":"#3b82f6","opacity":0.4,"width":1},"move":{"enable":true,"speed":2,"direction":"none","random":false,"straight":false,"out_mode":"out","bounce":false,"attract":{"enable":false,"rotateX":600,"rotateY":1200}}},"interactivity":{"detect_on":"canvas","events":{"onhover":{"enable":true,"mode":"grab"},"onclick":{"enable":true,"mode":"push"},"resize":true},"modes":{"grab":{"distance":140,"line_linked":{"opacity":1}},"bubble":{"distance":400,"size":40,"duration":2,"opacity":8,"speed":3},"repulse":{"distance":200,"duration":0.4},"push":{"particles_nb":4},"remove":{"particles_nb":2}}},"retina_detect":true}'::jsonb
FROM users
WHERE email = 'user@qiangnet.local'
AND NOT EXISTS (
    SELECT 1 FROM particle_configs WHERE user_id = users.id
);
