# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import shared.fields
from django.conf import settings


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Customer',
            fields=[
                ('id', models.AutoField(auto_created=True, verbose_name='ID', serialize=False, primary_key=True)),
                ('name', models.CharField(max_length=127)),
                ('mail', models.EmailField(max_length=255)),
                ('website', models.URLField(max_length=127)),
                ('fullname', models.CharField(max_length=127)),
                ('address1', models.CharField(max_length=63)),
                ('address2', models.CharField(max_length=63)),
                ('address3', models.CharField(max_length=63)),
                ('ustid', models.CharField(max_length=15)),
                ('notes', models.TextField()),
                ('logo', shared.fields.UrlFileField(null=True, upload_to='customer/logo')),
                ('user', models.ForeignKey(to=settings.AUTH_USER_MODEL)),
            ],
            options={
            },
            bases=(models.Model,),
        ),
    ]
