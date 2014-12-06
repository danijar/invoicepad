# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import shared.fields
import django.utils.timezone
from django.conf import settings


class Migration(migrations.Migration):

    dependencies = [
        ('customer', '0001_initial'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Invoice',
            fields=[
                ('id', models.AutoField(auto_created=True, verbose_name='ID', serialize=False, primary_key=True)),
                ('date', models.DateField(null=True, default=django.utils.timezone.now)),
                ('counter', models.PositiveIntegerField()),
                ('number', models.PositiveIntegerField()),
                ('value', models.DecimalField(null=True, max_digits=9, decimal_places=2)),
                ('pdf', shared.fields.UrlFileField(null=True, upload_to='invoice')),
                ('customer', models.ForeignKey(to='customer.Customer')),
                ('user', models.ForeignKey(to=settings.AUTH_USER_MODEL)),
            ],
            options={
            },
            bases=(models.Model,),
        ),
    ]
