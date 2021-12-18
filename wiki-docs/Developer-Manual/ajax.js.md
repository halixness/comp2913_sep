This router contains data endpoints to support frontend (forms, dropdowns, charts etc).

| Method | Route | Description |
|:----------|:------|:-------|
|POST|**/register/response-1**|register form check for fields in tab 1
|POST|**/register/response-2**|register form check for fields in tab 2
|POST|**/register/response-3**|register form check for fields in tab 3
|POST|**/facility/timetable**|get timetable json from Date and Facility Id
|POST|**/facility/timetable**|get timetable json from Date and Facility Id
|POST|**/activities/timetable**|get a activities for a specific date given Date Obj
|GET|**/report/overall/activity/:id**|get overall activity stats
|POST|**/report/weekly/activity**|get weekly activity stats given a date interval
|GET|**/data/activity/all**|get all activities
|GET|**/data/facility/all**|get all facilities
|GET|**/report/overall/facility/:id**|get overall facility stats given id
|POST|**/report/weekly/facility/:id**|get weekly facility stats given a date interval
|POST|**/report/overall/sport/:id**|get overall sport stats given id
|POST|**/report/weekly/sport/:id**|get weekly sport stats given a date interval
|POST|**/report/usage/weekly/**|get weekly login stats given a date interval
|POST|**/delete/image/activity**|delete an activity image given id
|POST|**/update/payment**|get editable user payments by card and user id 
|POST|**/get/activity**|get activity by id
|POST|**/get/pricing**|get membership pricing by id
|POST|**/get/card**|get payment card by id (encrypted)





