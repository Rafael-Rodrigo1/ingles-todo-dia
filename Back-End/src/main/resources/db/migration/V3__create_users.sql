CREATE TABLE users (

                       id BIGSERIAL PRIMARY KEY,

                       role_id BIGINT NOT NULL,

                       name VARCHAR(120) NOT NULL,

                       email VARCHAR(255) NOT NULL UNIQUE,

                       password VARCHAR(255) NOT NULL,

                       enabled BOOLEAN DEFAULT TRUE,

                       profile_image VARCHAR(500),

                       last_login TIMESTAMP,

                       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

                       updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

                       CONSTRAINT fk_user_role
                           FOREIGN KEY(role_id)
                               REFERENCES roles(id)

);