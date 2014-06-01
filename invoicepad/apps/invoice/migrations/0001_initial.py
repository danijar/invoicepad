# encoding: utf8
from django.db import models, migrations
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
                ('id', models.AutoField(verbose_name='ID', auto_created=True, primary_key=True, serialize=False)),
                ('user', models.ForeignKey(to=settings.AUTH_USER_MODEL, to_field='id')),
                ('customer', models.ForeignKey(to='customer.Customer', to_field='id')),
                ('date', models.DateField(blank=True, null=True, default=django.utils.timezone.now)),
                ('counter', models.PositiveIntegerField()),
                ('number', models.PositiveIntegerField()),
                ('value', models.DecimalField(blank=True, decimal_places=2, null=True, max_digits=9)),
                ('pdf', models.FileField(editable=False, upload_to='invoice', blank=True, null=True)),
            ],
            options={
            },
            bases=(models.Model,),
        ),
    ]
