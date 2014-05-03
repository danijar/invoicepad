# encoding: utf8
from django.db import models, migrations
import django.db.models.deletion
from django.conf import settings


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('invoice', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Project',
            fields=[
                ('id', models.AutoField(verbose_name='ID', auto_created=True, primary_key=True, serialize=False)),
                ('user', models.ForeignKey(to=settings.AUTH_USER_MODEL, to_field='id')),
                ('invoice', models.ForeignKey(to_field='id', on_delete=django.db.models.deletion.SET_NULL, to='invoice.Invoice', null=True)),
                ('name', models.CharField(max_length=127)),
                ('description', models.TextField(blank=True)),
                ('deadline', models.DateField(blank=True, null=True)),
                ('agreement', models.DateField(blank=True, null=True)),
                ('finished', models.DateField(blank=True, null=True)),
                ('value', models.IntegerField(blank=True, null=True)),
                ('hours', models.PositiveIntegerField()),
            ],
            options={
            },
            bases=(models.Model,),
        ),
    ]
