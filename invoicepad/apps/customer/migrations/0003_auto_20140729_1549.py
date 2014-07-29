# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import apps.customer.fields


class Migration(migrations.Migration):

    dependencies = [
        ('customer', '0002_auto_20140725_1333'),
    ]

    operations = [
        migrations.AlterField(
            model_name='customer',
            name='address1',
            field=models.CharField(max_length=63),
        ),
        migrations.AlterField(
            model_name='customer',
            name='address2',
            field=models.CharField(max_length=63),
        ),
        migrations.AlterField(
            model_name='customer',
            name='address3',
            field=models.CharField(max_length=63),
        ),
        migrations.AlterField(
            model_name='customer',
            name='fullname',
            field=models.CharField(max_length=127),
        ),
        migrations.AlterField(
            model_name='customer',
            name='logo',
            field=apps.customer.fields.UrlImageField(upload_to='customer/logo', null=True),
        ),
        migrations.AlterField(
            model_name='customer',
            name='mail',
            field=models.EmailField(max_length=255),
        ),
        migrations.AlterField(
            model_name='customer',
            name='notes',
            field=models.TextField(),
        ),
        migrations.AlterField(
            model_name='customer',
            name='ustid',
            field=models.CharField(max_length=15),
        ),
        migrations.AlterField(
            model_name='customer',
            name='website',
            field=models.URLField(max_length=127),
        ),
    ]
