# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
from django.conf import settings
import django.utils.timezone
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('project', '0004_auto_20140419_1206'),
    ]

    operations = [
        migrations.AddField(
            model_name='time',
            name='user',
            field=models.ForeignKey(to=settings.AUTH_USER_MODEL, default=0),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='project',
            name='agreement',
            field=models.DateField(null=True, default=django.utils.timezone.now),
        ),
        migrations.AlterField(
            model_name='project',
            name='deadline',
            field=models.DateField(null=True),
        ),
        migrations.AlterField(
            model_name='project',
            name='description',
            field=models.TextField(),
        ),
        migrations.AlterField(
            model_name='project',
            name='finished',
            field=models.DateField(null=True),
        ),
        migrations.AlterField(
            model_name='project',
            name='hours',
            field=models.PositiveIntegerField(default=0),
        ),
        migrations.AlterField(
            model_name='project',
            name='invoice',
            field=models.ForeignKey(to='invoice.Invoice', null=True, on_delete=django.db.models.deletion.SET_NULL),
        ),
        migrations.AlterField(
            model_name='project',
            name='value',
            field=models.IntegerField(null=True),
        ),
        migrations.AlterField(
            model_name='time',
            name='end',
            field=models.DateTimeField(null=True),
        ),
    ]
