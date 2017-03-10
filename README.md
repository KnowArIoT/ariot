# Artic IoT challenge backend

## Technology stack
- NodeJS
- MySQL (I'm sorry)

## Goal
Short version: To store data from our car and serve our dashboard data.

## Database

If there's a new sensor, use the SQL-query below to create a new table.

```
CREATE TABLE <input-name-here> (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    data float unsigned NOT NULL,
    miliseconds VARCHAR(255) NOT NULL,
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
```

## API

```
Endpoint: /data
Type: GET
```
Params:
```
sensor => sensor name (all | u1 | u2 | gas)
startDate => YYYY-MM-DD HH:mm:ss
endDate => YYYY-MM-DD HH:mm:ss
```

```
Endpoint: /get/:sensor/:startDate/:endDate
Type: GET
```
Params:
```
sensor => sensor name
startDate => YYYY-MM-DD HH:mm:ss
endDate => YYYY-MM-DD HH:mm:ss
```

```
Endpoint: /save
Type: POST
```
Content:
```
Params: [{"name": "gas", "time": 123, "data": 10.24}]

name => sensor (and table) name
time => miliseconds
data => values from sensor
```
