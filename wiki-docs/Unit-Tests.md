# Unit Tests
## Database
[Test cases (YAML)](https://gitlab.com/joejeffcock/comp2913_sep/-/blob/master/test/central_system/test_db/test_db.yaml)

### 05/04/20

| No | Test | Result | Action Taken |
| ---                            | --- | --- | --- |
| 0 | INSERT Sport               | OK   | - |
| 1 | INSERT Activity            | FAIL   | issue #26 opened |
| 3 | INSERT User                | FAIL   | changed birth to DATETIME, set email UNIQUE |
| 4 | INSERT Card                | FAIL   | issue #26 opened |
| 5 | INSERT Card_User           | OK   | - |
| 6 | INSERT Card BookedActivity | OK   | - |
| 7 | INSERT Payment             | OK   | - |

### 02/05/20 (All tests passed)

| No | Test | Result | Action Taken |
| ---                            | --- | --- | --- |
| 0 | INSERT Sport               | OK   | - |
| 1 | INSERT Activity            | OK   | - |
| 3 | INSERT User                | OK   | - |
| 4 | INSERT Card                | OK   | - |
| 5 | INSERT Card_User           | OK   | - |
| 6 | INSERT Card BookedActivity | OK   | - |
| 7 | INSERT Payment             | OK   | - |

## Node.js server

[Test cases (YAML)](https://gitlab.com/joejeffcock/comp2913_sep/-/blob/master/test/central_system/test_node/test_node.yaml)

### 25/04/20 (All tests passed)

| No | Test | Result | Action Taken |
| ---                            | --- | --- | --- |
| 0 | Register and login         | OK   | - |
| 1 | New Activity               | OK   | - |
