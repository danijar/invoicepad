REST Interface
==============

user
----
Login.
<< GET /user { email, password }
>> { name, email } and sets Cookie.

Register a mew user.
<< POST /user { name, email, password }
>> { name, email }

customer
--------
Array of basic information of costumers.
<< GET /customer
>> [{ id, name }, ...]

Detailed customer information.
<< GET /customer/:id
>> { id, name, address?, email? }

Add new customer.
<< POST /customer { name, address?, email? }
>> { id, name, address?, email? }

Update customer.
<< UPDATE /customer { id, name?, address?, email? }
>> { id, name, address?, email? }

Delete existing customer.
<< DELETE /customer/:id

project
-------
Array of basic information of projects.
<< GET /project
>> [{ id, name, description? }, ...]

Detailed project information.
<< GET /project/:id
>> { id, name, description, deadline?, value?, agreement?, finished?, invoice? }

Create new project. Agreement defaults to today.
<< POST /project { name, description, deadline?, agreement? }
>> { id, name, ... }

Update project.
<< UPDATE /project { id, name?, description?, deadline?, value?, agreement?, finished?, invoice? }
>> { id, name, description, deadline?, value?, agreement?, finished?, invoice? }

Delete existing project.
<< DELETE /project/:id

time
----
Array of basic information of times for one project.
<< GET /time { project }
>> [{ id, message?, start, end? }, ...]

Create new time.
<< POST /time { project }
>> { id, start }

Close created time.
<< POST /time/:id { end?, message? }
>> { id, message?, start, end }

Update time.
<< UPDATE /time { id, message?, start?, end? }
>> { id, message?, start?, end? }

Delete existing time.
<< DELETE /time/:id

invoice
-------
Array of basic information of invoices.
<< GET /invoice
>> [{ id, customer, date, value? }, ...]

Detailed invoice information.
<< GET /invoice/:id
>> { id, customer, date, consecutive, number, value? }

Update invoice.
<< UPDATE /invoice { id, customer?, date?, value? }
>> { id, customer, date, consecutive, number, value? }

Delete existing invoice.
<< DELETE /invoice/:id

Array of projects associated with invoice.
<< GET /invoice/:id/project
>> [{ id, name, description? }, ...]

Associate project with invoice.
<< POST /invoice/:id/project/:id

Deassociate project with invoice.
<< DELETE /invoice/:id/project/:id

Get pdf blob for invoice.
<< GET /invoice/:id/pdf

Add pdf to invoice.
<< POST /invoice/:id/pdf PDF

Remove pdf from invoice.
<< DELETE /invoice/:id/pdf
