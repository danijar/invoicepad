from django.db import models
from django.contrib.auth.models import User

from apps.customer.models import Customer
from shared.fields import UrlFileField
from shared.helpers import current_date

class Invoice(models.Model):
	user     = models.ForeignKey(User)
	customer = models.ForeignKey(Customer, null=True)
	date     = models.DateField(default=current_date, null=True)
	counter  = models.PositiveIntegerField(null=True)
	number   = models.PositiveIntegerField(null=True)
	value    = models.DecimalField(max_digits=9, decimal_places=2, null=True)
	pdf      = UrlFileField(upload_to='invoice', null=True)
