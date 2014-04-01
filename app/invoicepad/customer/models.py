from django.db import models
from django.contrib.auth.models import User

class Customer(models.Model):
	user     = models.ForeignKey(User)
	name     = models.CharField(127)
	mail     = models.EmailField(255, blank=True)
	website  = models.URLField(127, blank=True)
	fullname = models.CharField(127, blank=True)
	address1 = models.CharField(63, blank=True)
	address2 = models.CharField(63, blank=True)
	address3 = models.CharField(63, blank=True)
	ustid    = models.CharField(15, blank=True)
	notes    = models.TextField(blank=True)
	logo     = models.ImageField(upload_to='customer/logo', null=True, blank=True)
