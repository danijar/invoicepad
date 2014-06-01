# encoding: utf8
from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('project', '0003_auto_20140416_1525'),
    ]

    operations = [
        migrations.AlterField(
            model_name='time',
            name='message',
            field=models.CharField(max_length=127),
        ),
    ]
