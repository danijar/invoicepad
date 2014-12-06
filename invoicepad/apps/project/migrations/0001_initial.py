# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import shared.helpers
import django.db.models.deletion
from django.conf import settings


class Migration(migrations.Migration):

    dependencies = [
        ('invoice', '0002_auto_20141206_1204'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Project',
            fields=[
                ('id', models.AutoField(primary_key=True, auto_created=True, verbose_name='ID', serialize=False)),
                ('name', models.CharField(max_length=127)),
                ('description', models.TextField()),
                ('deadline', models.DateField(null=True)),
                ('agreement', models.DateField(default=shared.helpers.current_date, null=True)),
                ('finished', models.DateField(null=True)),
                ('value', models.IntegerField(null=True)),
                ('hours', models.PositiveIntegerField(default=0)),
                ('invoice', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='invoice.Invoice')),
                ('user', models.ForeignKey(to=settings.AUTH_USER_MODEL)),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='Time',
            fields=[
                ('id', models.AutoField(primary_key=True, auto_created=True, verbose_name='ID', serialize=False)),
                ('message', models.CharField(max_length=127)),
                ('start', models.DateTimeField(default=shared.helpers.current_time)),
                ('end', models.DateTimeField(null=True)),
                ('project', models.ForeignKey(to='project.Project')),
                ('user', models.ForeignKey(to=settings.AUTH_USER_MODEL)),
            ],
            options={
            },
            bases=(models.Model,),
        ),
    ]
