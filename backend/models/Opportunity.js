const opportunityModel = {
    table: "opportunities",
    columns: {
        id: "uuid primary key default gen_random_uuid()",
        title: "varchar(200) not null",
        type: "varchar(50) not null",
        description: "text",
        field: "varchar(100)",
        city: "varchar(100)",
        latitude: "decimal(9,6)",
        longitude: "decimal(9,6)",
        deadline: "date",
        link: "varchar(255)",
        created_by: "uuid references users(id) on delete set null",
        created_at: "timestamp default now()"
    }
};

module.exports = opportunityModel;