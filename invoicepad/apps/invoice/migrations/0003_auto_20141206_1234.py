# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('invoice', '0002_auto_20141206_1204'),
    ]

    operations = [
        migrations.AlterField(
            model_name='invoice',
            name='counter',
            field=models.PositiveIntegerField(null=True),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='invoice',
            name='customer',
            field=models.ForeignKey(to='customer.Customer', null=True),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='invoice',
            name='number',
            field=models.PositiveIntegerField(null=True),
            preserve_default=True,
        ),
    ]
