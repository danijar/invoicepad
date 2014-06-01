from django.db import models
from django.contrib.auth.models import User
from django.utils.timezone import now
from apps.customer.models import Customer

class Invoice(models.Model):
	user     = models.ForeignKey(User)
	customer = models.ForeignKey(Customer)
	date     = models.DateField(default=now, null=True, blank=True)
	counter  = models.PositiveIntegerField()
	number   = models.PositiveIntegerField()
	value    = models.DecimalField(max_digits=9, decimal_places=2, null=True, blank=True)
	pdf      = models.FileField(upload_to='invoice', editable=False, null=True, blank=True)
