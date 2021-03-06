from django.db import models
from django.contrib.auth.models import User
from shared.helpers import current_time, current_date

from apps.invoice.models import Invoice


class Project(models.Model):
	user        = models.ForeignKey(User)
	invoice     = models.ForeignKey(Invoice, null=True, on_delete=models.SET_NULL)
	name        = models.CharField(max_length=127)
	description = models.TextField()
	deadline    = models.DateField(null=True)
	agreement   = models.DateField(null=True, default=current_date)
	finished    = models.DateField(null=True)
	value       = models.IntegerField(null=True)
	hours       = models.PositiveIntegerField(default=0)

	def __str__(self):
		return self.name


class Time(models.Model):
	user    = models.ForeignKey(User)
	project = models.ForeignKey(Project, null=False, on_delete=models.CASCADE)
	message = models.CharField(max_length=127)
	start   = models.DateTimeField(default=current_time)
	end     = models.DateTimeField(null=True)

	def __str__(self):
		return self.message

	def duration(self):
		if start is None or end is None:
			return None
		return self.end - self.start
