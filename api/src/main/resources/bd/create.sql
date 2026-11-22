    
    create table users (
        birthday date,
        user_created_date timestamp(6),
        cpf varchar(255) unique,
        email varchar(255) unique,
        id uuid not null,
        name varchar(255),
        password varchar(255),
        username varchar(255) unique,
        primary key (id)
    );
    
    create table players (
        media_desempenho float(53),
        total_partidas_avaliadas integer,
        user_id uuid references users(id),
        primary key (user_id)
    );
    
    create table manager (
        user_id uuid references users(id),
        chave_pix varchar(255),
        cnpj varchar(255),
        primary key (user_id)
    );
    
    create table sport_complex (
        number integer,
        id uuid not null,
        cep varchar(255),
        city varchar(255),
        cnpj varchar(255),
        name varchar(255),
        state varchar(255),
        street varchar(255),
        manager_id uuid references manager(user_id),
        primary key (id)
    );
    
    create table court (
        hour_value float4 not null,
        type smallint check ((type between 0 and 3)),
        id uuid not null,
        name varchar(255),
        complex_id uuid references sport_complex(id),
        primary key (id)
    );
    
    create table match (
        date date,
        match_create_date timestamp(6),
        id uuid not null,
        status varchar(255),
        court_id uuid references court(id),
        organizador_id uuid references users(id),
        primary key (id)
    );
    
    create table participation (
        match_id uuid references match(id),
        user_id uuid references users(id),
        payment_status varchar(255),
        quota_value varchar(255),
        primary key (match_id, user_id)
    );
    
    create table avaliacao (
        nota float4 not null,
        data_avaliacao timestamp(6),
        avaliado_id uuid references players(user_id),
        avaliador_id uuid references players(user_id),
        match_id uuid references match(id),
        comentario varchar(255),
        primary key (avaliado_id, avaliador_id, match_id)
    );
