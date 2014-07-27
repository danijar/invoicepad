from django.db import models
from django.contrib.auth.models import User
from django.core.files.base import File

from apps.customer.fields import UrlImageField


class Customer(models.Model):
    user     = models.ForeignKey(User)
    name     = models.CharField(max_length=127)
    mail     = models.EmailField(max_length=255, blank=True)
    website  = models.URLField(max_length=127, blank=True)
    fullname = models.CharField(max_length=127, blank=True)
    address1 = models.CharField(max_length=63, blank=True)
    address2 = models.CharField(max_length=63, blank=True)
    address3 = models.CharField(max_length=63, blank=True)
    ustid    = models.CharField(max_length=15, blank=True)
    notes    = models.TextField(blank=True)
    logo     = UrlImageField(upload_to='customer/logo', null=True, blank=True)

    def delete(self, using=None):
        if isinstance(self.logo, File):
            self.logo.delete()
        super().delete(using)

    def __str__(self):
        return self.name
