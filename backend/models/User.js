

const userModel={
    table:'users',
    columns:{
        id:'uuid primary key default gen-random-uuid()',
        name:'varchar(100) not null',
        email:'varchar(150) unique  not null',
        password:'varchar(100) not null',
        field:'varchar(120)',
        city:'varchar(100)',
        study_level:'varchar(50)',
        created_at:'timestamp defautl now()'
    }
};
module.exports=userModel