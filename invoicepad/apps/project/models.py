from django.db import models
from django.contrib.auth.models import User
from django.utils.timezone import now
from apps.invoice.models import Invoice

class Project(models.Model):
	user        = models.ForeignKey(User)
	invoice     = models.ForeignKey(Invoice, null=True, blank=True, on_delete=models.SET_NULL)
	name        = models.CharField(max_length=127)
	description = models.TextField(blank=True)
	deadline    = models.DateField(null=True, blank=True)
	agreement   = models.DateField(null=True, blank=True)
	finished    = models.DateField(null=True, blank=True)
	value       = models.IntegerField(null=True, blank=True)
	hours       = models.PositiveIntegerField(null=True, blank=True)
	def __str__(self):
		return self.name

class Time(models.Model):
	project = models.ForeignKey(Project)
	message = models.CharField(max_length=127)
	start   = models.DateTimeField(default=now)
	end     = models.DateTimeField(null=True, blank=True)
	def __str__(self):
		return self.message
	def duration(self):
		if start is None or end is None:
			return None
		return self.end - self.start
