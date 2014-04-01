from django.db import models
from django.contrib.auth.models import User
from django.utils.timezone import now

class Project(models.Model):
	user        = models.ForeignKey(User)
	invoice     = models.ForeignKey('Invoice', null=True, on_delete=models.SET_NULL)
	name        = models.CharField(127)
	description = models.TextField(blank=True)
	deadline    = models.DateField(null=True, blank=True)
	agreement   = models.DateField(null=True, blank=True)
	finished    = models.DateField(null=True, blank=True)
	value       = models.IntegerField(null=True, blank=True)
	hours       = models.PositiveIntegerField()

class Time(models.Model):
	project     = models.ForeignKey(Project)
	message     = models.TextField()
	start       = models.DateTimeField(default=now)
	end         = models.DateTimeField(null=True, blank=True)
