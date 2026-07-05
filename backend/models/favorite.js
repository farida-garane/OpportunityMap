const favoriteModel = {
    table: "favorites",
    columns: {
        id: "uuid primary key default gen_random_uuid()",
        user_id: "uuid not null references users(id) on delete cascade",
        opportunity_id: "uuid not null references opportunities(id) on delete cascade",
        created_at: "timestamp default now()"
    }
};

module.exports = favoriteModel;