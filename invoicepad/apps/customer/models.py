from django.db import models
from django.contrib.auth.models import User
from django.core.files.base import File

from shared.fields import UrlFileField


class Customer(models.Model):
    user     = models.ForeignKey(User)
    name     = models.CharField(max_length=127)
    mail     = models.EmailField(max_length=255)
    website  = models.URLField(max_length=127)
    fullname = models.CharField(max_length=127)
    address1 = models.CharField(max_length=63)
    address2 = models.CharField(max_length=63)
    address3 = models.CharField(max_length=63)
    ustid    = models.CharField(max_length=15)
    notes    = models.TextField()
    logo     = UrlFileField(upload_to='customer/logo', null=True)

    def delete(self, using=None):
        if isinstance(self.logo, File):
            self.logo.delete()
        super().delete(using)

    def __str__(self):
        return self.name
