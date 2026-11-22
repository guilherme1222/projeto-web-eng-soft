CREATE TABLE USERS(
    Id UUID primary key,
    Birthday DATE,
    Cpf VARCHAR(11),
    Email VARCHAR(30),
    Name VARCHAR(40),
    Password VARCHAR(255),
    Roles VARCHAR(10)[],
    User_created_date timestamp(6) without time zone  DEFAULT SYSDATE
    Username VARCHAR(15) unique
);

CREATE TABLE PLAYER(
    UserId UUID PRIMARY KEY,
    Score NUMBER DEFAULT 0,
    
)

CRATE TABLE SPORT_COMPLEX(
      Id UUID primary key,
      Name VARCHAR2(40),
      Address VARCHAR2
)