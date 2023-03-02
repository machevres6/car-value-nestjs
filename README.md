# Data Models: 

## User

| Property | Data Type | Description |
| ----------- | --------- | -------- |
| `id` | `number` | Unique identifier for the user |
| `email` | `string` | Email address of the user |
| `password` | `string` | Password of the user |
| `admin` | `boolean` | Whether the user is an admin or not |
| `reports` | `array` | Array of reports the user has created |


## Report

| Property | Data Type | Description |
| ----------- | --------- | -------- |
| `id` | `number` | Unique identifier for the report |
| `approved` | `boolean` | Whether the report has been approved or not |
| `price` | `number` | Price of the report |
| `make` | `string` | Make of the vehicle |
| `model` | `string` | Model of the vehicle |
| `year` | `number` | Year of the vehicle |
| `mileage` | `number` | Mileage of the vehicle |
| `lat` | `number` | Latitude of the vehicle |
| `lng` | `number` | Longitude of the vehicle |
| `user` | `object of User type` | User who created the report |