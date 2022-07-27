DROP TABLE IF EXISTS pets;

CREATE TABLE pets(
    id serial,
    name TEXT,
    kind TEXT, 
    age INTEGER
);

INSERT INTO pets (name, kind, age) Values ('Fred', 'dog', 6);
INSERT INTO pets (name, kind, age) Values ('Fido', 'rainbow', 7);