import uuid
import urllib.request

from django.core.files.base import ContentFile
from django.db import models
from django.db.models.fields.files import FileDescriptor


class UrlFileFieldDescriptor(FileDescriptor):
	def __set__(self, instance, value):
		# If a string is used for assignment, it is used as URL
		# to fetch an image from and store it on the server.
		if isinstance(value, str):
			# Make sure it's an URL, since Django internally assigns the
			# local paths when instantiating models with file fields.
			PROTOCOLS = ['http', 'https', 'ftp']
			if value.startswith(tuple(x + '://' for x in PROTOCOLS)):
				try:
					# Fetch file
					response = urllib.request.urlopen(value)
					data = response.read()
					# Find file format
					headers = response.info()
					if 'Content-Type' in headers:
						extension = '.' + headers['Content-Type'].split('/')[1].strip()
					elif '.' in value:
						extension = '.' + value.split('.')[-1]
					else:
						extension = ''
					# Create file from random name
					name = str(uuid.uuid4()) + extension
					value = ContentFile(data, name)
				except:
					# Anyway initialize field with None
					print('Error fetching', value)
					value = None
		super().__set__(instance, value)


class UrlFileField(models.FileField):
	descriptor_class = UrlFileFieldDescriptor
