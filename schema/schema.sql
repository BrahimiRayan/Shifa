drop DATABASE if EXISTS shifabase;

create database if not EXISTS shifabase;

CREATE table if not EXISTS patients(
	idp varchar(50) NOT null,
    nom varchar(45) NOT null,
    prenom varchar(45) not null,
    birthdate date not null,
    phone varchar(18) not null,
    address varchar(100),
    ncin varchar(12) not null,
    pswd varchar(100) not null,
    email varchar(60) not null,
    PRIMARY key(idp)
);

CREATE table if not EXISTS patients_temp(
	idtemp varchar(50) NOT null,
    nom varchar(45) NOT null,
    prenom varchar(45) not null,
    birthdate date not null,
    ncin varchar(12) not null,
    PRIMARY key(idtemp)
);


CREATE TABLE if NOT EXISTS services(
	idserv varchar(50) , 
    nomserv varchar(50) not null,
    patient_in_hour int not null,
    PRIMARY KEY(idserv)
);


CREATE table if not EXISTS docteurs(
	iddoc varchar(50) not null,
    matricule varchar(10) not null ,
    nom varchar(45) not null,
    prenom varchar(45) not null,
    birthdate date not null,
    phone varchar(18) not null,
    address varchar(100),
    ncin varchar(12) not null,
    pswd varchar(400) not null,
    email varchar(60) not null,
    idserv varchar(50),
    PRIMARY key(iddoc),
    FOREIGN KEY (idserv) REFERENCES services(idserv) ON DELETE CASCADE
);

CREATE table if not EXISTS secritaires(
	idsec varchar(50),
    matricule int not null ,
    nom varchar(45) not null,
    prenom varchar(45) not null,
    birthdate date not null,
    phone varchar(18) not null,
    email varchar(60) not null,
    address varchar(100),
    ncin varchar(12) not null,
    pswd varchar(400) not null,
    PRIMARY key(idsec)
);

CREATE table if not EXISTS admin(
	idadmin varchar(50) not null,
    matricule varchar(10) not null ,
    nom varchar(45) not null,
    prenom varchar(45) not null,
    pswd varchar(400) not null,
    PRIMARY key(idadmin)
);
CREATE table if not EXISTS planing(
	iddoc varchar(50),
    idserv varchar(50),
    date_debut date ,
    date_fin date,
    heur_debut TIME,
    heur_fin TIME,
    PRIMARY key(iddoc , idserv),
    FOREIGN KEY (idserv) REFERENCES services(idserv) ON DELETE CASCADE,
    FOREIGN KEY (iddoc) REFERENCES docteurs(iddoc) ON DELETE CASCADE
);

-- le type attribut c'est pour dire que il exist trois type de rdv pour le moment j'ai supposer
-- 0 : rdv normal(patient)
-- 1 : rdv anonyme (secritaire)
-- 2 : rdv bloquee (docteur)
-- on tout cas en va discutez tout a fin de reglez les edies final ...

CREATE table if not EXISTS rdv(
	idrdv varchar(50) not null,
    idp varchar(50),
    iddoc varchar(50),
    idtemp varchar(30) ,
    date_rdv date ,
    heur_debut_rdv TIME,
    heur_fin_rdv TIME,
 	type int DEFAULT 0,
    PRIMARY KEY (idrdv),
    FOREIGN KEY (idp) REFERENCES patients(idp) ON DELETE CASCADE,
    FOREIGN KEY (iddoc) REFERENCES docteurs(iddoc) ON DELETE CASCADE,
    FOREIGN KEY (idtemp) REFERENCES docteurs(iddoc) ON DELETE CASCADE
);
