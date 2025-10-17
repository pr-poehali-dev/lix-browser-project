CREATE TABLE IF NOT EXISTS t_p52045837_lix_browser_project.search_history (
    id SERIAL PRIMARY KEY,
    query TEXT NOT NULL,
    search_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    user_ip VARCHAR(45),
    results_count INTEGER DEFAULT 0
);

CREATE INDEX idx_search_time ON t_p52045837_lix_browser_project.search_history(search_time DESC);
CREATE INDEX idx_query ON t_p52045837_lix_browser_project.search_history(query);