# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import shared.helpers


class Migration(migrations.Migration):

    dependencies = [
        ('invoice', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='invoice',
            name='date',
            field=models.DateField(default=shared.helpers.current_date, null=True),
            preserve_default=True,
        ),
    ]
