-- Teams table
CREATE TABLE IF NOT EXISTS teams (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Users table
CREATE TABLE users (
    id VARCHAR(36) PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- User-Team assignments with effective dates
CREATE TABLE IF NOT EXISTS user_team_assignments (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    team_id INTEGER NOT NULL,
    effective_from TIMESTAMP WITH TIME ZONE NOT NULL,
    effective_to TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (team_id) REFERENCES teams(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Cards/Notes table
CREATE TABLE cards (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT,
    user_id VARCHAR(36) NOT NULL REFERENCES users(id),
    team_id INTEGER REFERENCES teams(id),
    created_for VARCHAR(36) NOT NULL REFERENCES users(id),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
-- Create indexes for performance
CREATE INDEX idx_user_team_assignments_user ON user_team_assignments(user_id);
CREATE INDEX idx_user_team_assignments_team ON user_team_assignments(team_id);
CREATE INDEX idx_user_team_assignments_dates ON user_team_assignments(effective_from, effective_to);
CREATE INDEX idx_cards_user ON cards(user_id);
CREATE INDEX idx_cards_created_at ON cards(created_at);

-- Create a function to update timestamps
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updating timestamp
CREATE TRIGGER update_teams_timestamp
BEFORE UPDATE ON teams
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_users_timestamp
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_user_team_assignments_timestamp
BEFORE UPDATE ON user_team_assignments
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_cards_timestamp
BEFORE UPDATE ON cards
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

-- Create a view that joins cards with the correct team at creation time
-- CREATE OR REPLACE VIEW team_cards AS
--     SELECT 
--         c.id AS card_id,
--         c.title,
--         c.content,
--         c.created_at AS card_created_at,
--         u.id AS user_id,
--         u.first_name,
--         u.last_name,
--         t.id AS team_id,
--         t.name AS team_name
--     FROM 
--         cards c
--     JOIN 
--         users u ON c.user_id = u.id  -- Join to creator
--     JOIN 
--         users cf ON c.created_for = cf.id  -- Join to recipient
--     LEFT JOIN  -- Use LEFT JOIN to ensure we get all cards
--         user_team_assignments uta ON 
--             u.id = uta.user_id AND 
--             c.created_at >= uta.effective_from AND 
--             (c.created_at < uta.effective_to OR uta.effective_to IS NULL)
--     LEFT JOIN 
--         teams t ON uta.team_id = t.id
--     ORDER BY 
--         c.created_at DESC;