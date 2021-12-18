This router contains web endpoints to serve the backoffice pages for managers.

| Method | Route | Description |
|:----------|:------|:-------|
|GET|**/overview**|backoffice manager dashboard
|GET|**/register/employee**|new employee page with form
|POST|**/register/employee**|new employee page processing POST form
|GET|**/statistics**|page showing charts for various categories
|GET|**/activities/new**|new activity form from backoffice
|POST|**/activities/new**|new activity form process POST form
|GET|**/activities/edit/:id**|edit activity form given activity id
|POST|**/activities/edit/:id**|edit activity process POST form
|GET|**/facilities/new**|new facility form from backoffice
|POST|**/facilities/new**|new facility form process POST form
|GET|**/facitilies/edit/:id**|edit facility form given facility id
|POST|**/facilities/edit/:id**|edit facility process POST form