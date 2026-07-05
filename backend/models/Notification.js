const notificationModel = {
    table: "notifications",
    columns: {
        id: "uuid primary key default gen_random_uuid()",
        user_id: "uuid not null references users(id) on delete cascade",
        opportunity_id: "uuid references opportunities(id) on delete cascade",
        message: "text not null",
        is_read: "boolean default false",
        created_at: "timestamp default now()"
    }
};

module.exports = notificationModel;