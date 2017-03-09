# Artic IoT challenge backend

## Technology stack
- NodeJS
- MySQL (I'm sorry)

## Goal
Short version: To store data from our car and serve our dashboard data.

## Database

If there's a new sensor, use the SQL-query below to create a new table.

```
CREATE TABLE gas (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    data VARCHAR(255) NOT NULL,
    miliseconds VARCHAR(255) NOT NULL,
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
```

## API
TODO
