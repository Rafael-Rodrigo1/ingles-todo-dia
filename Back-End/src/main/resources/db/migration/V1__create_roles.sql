CREATE TABLE roles (

                       id BIGSERIAL PRIMARY KEY,

                       name VARCHAR(30) NOT NULL UNIQUE,

                       description TEXT,

                       created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

                       updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP

);