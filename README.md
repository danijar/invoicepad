Invoice Pad
===========

Invoice Pad is a job management tool with time tracker, invoice generation and
archiving solution. It uses Django in the backend and Angular in the frontend.
Work's in progress.

![Screenshot](screenshot/2014-12-13.png?raw=true)

Instructions
------------

Create a virtual environment inside the empty `<repository>/virtualenv`
directory. The contents of this files are already excluded from versioning.

Start a shell inside the virtual environment and navigate to
`<repository>/invoicepad`. You can use the batch file from the
`<repository>/tools` as shortcut, that doesn't activates the environment
globally. Run the following commands inside the virtual environment.

```python
# Install dependencies
pip install -r requirements.txt

# Set up the database
python manage.py migrate

# Create a superuser for Django
python manage.py createsuperuser
```

Now you can start the Django server by the following command inside the virtual
environment or using the according batch file from the tools directory.

```python
# Start Django server
python manage.py runserver --nostatic 8000
```

License
-------

This software is licensed under GNU GPL v3.0. See the
[license file](LICENSE.md) for more information.
