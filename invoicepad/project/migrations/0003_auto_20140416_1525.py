# encoding: utf8
from django.db import models, migrations
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('project', '0002_time'),
    ]

    operations = [
        migrations.AlterField(
            model_name='project',
            name='hours',
            field=models.PositiveIntegerField(null=True, blank=True),
        ),
        migrations.AlterField(
            model_name='project',
            name='invoice',
            field=models.ForeignKey(blank=True, to_field='id', to='invoice.Invoice', null=True, on_delete=django.db.models.deletion.SET_NULL),
        ),
    ]
