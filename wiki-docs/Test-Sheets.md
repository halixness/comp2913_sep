| Test No | Table | Command | Type | Data | Expected result |
| ------- | ------ | ------- | ---- | ---- | --- |
| 0 | User | Insert | Normal | 0, "person0", "person0@leeds.ac.uk", "07777777777", "1990-01-01" | OK |
| 1 | User | Insert | Extreme | 1, "person1", "person1_with_an_excessively_lengthy_but_valid_email_address@leeds.ac.uk, "07777777777", "1970-01-01" | OK |
| 2 | User | Insert | Abnormal | 1, "person3", "person3@leeds.ac.uk", "07777777777", "1990-01-01" | ERROR |
| 3 | User | Insert | Abnormal | 2, "person4", "07777777777", "1990-01-01" | ERROR |
| 4 | User | Insert | Abnormal | 5, "person5", "person0@leeds.ac.uk", "07777777777", "1990-01-01" | ERROR |