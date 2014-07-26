# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import apps.customer.fields


class Migration(migrations.Migration):

    dependencies = [
        ('customer', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='customer',
            name='logo',
            field=apps.customer.fields.UrlImageField(blank=True, upload_to='customer/logo', null=True),
        ),
    ]
