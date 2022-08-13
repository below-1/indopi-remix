drop database if exists ratna_kmeans_db cascade;
create database ratna_kmeans_db;

use ratna_kmeans_db;

create type user_role_type as enum('superuser', 'siswa');
create table "user" (
  username STRING PRIMARY KEY NOT NULL,
  password STRING,
  "role" user_role_type not null
);

create type jenis_kelamin_type as enum('Laki - Laki', 'Perempuan');
create table siswa (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nisn STRING NOT NULL UNIQUE,
  nama STRING NOT NULL,
  
  jenis_kelamin jenis_kelamin_type NOT NULL,
  penghasilan_ortu INTEGER,
  tanggungan_ortu INTEGER,
  hafalan_alquran INTEGER,
  
  kelas integer not null,
  sub_kelas integer not null,
  avatar STRING,
  tanggal_lahir TIMESTAMPTZ NOT NULL,
  username STRING NOT NULL 
    REFERENCES public.user(username) 
    ON DELETE CASCADE ON UPDATE CASCADE
);

create table nilai (
  tahun_ajaran INTEGER NOT NULL,
  semester INTEGER NOT NULL,
  id_siswa UUID NOT NULL 
    REFERENCES siswa(id) 
    on delete cascade on update cascade,

  -- nilai columns
  matematika decimal(10, 4),
  ipa decimal(10, 4),
  ips decimal(10, 4),
  bing decimal(10, 4),
  bindo decimal(10, 4),
  penjaskes decimal(10, 4),
  prakarya decimal(10, 4),
  agama decimal(10, 4),
  pancasila decimal(10, 4),

  PRIMARY KEY (id_siswa, tahun_ajaran, semester)
);
