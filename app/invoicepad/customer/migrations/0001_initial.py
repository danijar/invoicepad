# encoding: utf8
from django.db import models, migrations
from django.conf import settings


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Customer',
            fields=[
                ('id', models.AutoField(verbose_name='ID', auto_created=True, primary_key=True, serialize=False)),
                ('user', models.ForeignKey(to=settings.AUTH_USER_MODEL, to_field='id')),
                ('name', models.CharField(max_length=127)),
                ('mail', models.EmailField(blank=True, max_length=255)),
                ('website', models.URLField(blank=True, max_length=127)),
                ('fullname', models.CharField(blank=True, max_length=127)),
                ('address1', models.CharField(blank=True, max_length=63)),
                ('address2', models.CharField(blank=True, max_length=63)),
                ('address3', models.CharField(blank=True, max_length=63)),
                ('ustid', models.CharField(blank=True, max_length=15)),
                ('notes', models.TextField(blank=True)),
                ('logo', models.ImageField(upload_to='customer/logo', blank=True, null=True)),
            ],
            options={
            },
            bases=(models.Model,),
        ),
    ]
