import uuid
import urllib.request

from django.core.files.base import ContentFile
from django.db import models
from django.db.models.fields.files import ImageFileDescriptor


class UrlImageFileDescriptor(ImageFileDescriptor):
	def __set__(self, instance, value):
		# If a string is used for assignment, it is used as URL
		# to fetch an image from and store it on the server.
		if isinstance(value, str):
			# Make sure it's an URL, since Django internally assigns the
			# local paths when instantiating models with file fields.
			PROTOCOLS = ['http', 'https', 'ftp']
			if value.startswith(tuple(x + '://' for x in PROTOCOLS)):
				try:
					# Fetch image
					response = urllib.request.urlopen(value)
					image = response.read()
					# Find file format
					headers = response.info()
					if 'Content-Type' in headers:
						format = headers['Content-Type'].split('/')[1].strip()
					elif '.' in value:
						format = value.split('.')[-1]
					else:
						format = 'png'
					# Create file from random name
					name = str(uuid.uuid4()) + '.' + format
					value = ContentFile(image, name)
				except:
					# Anyway initialize field with None
					print('Error fetching', value)
					value = None
		super().__set__(instance, value)


class UrlImageField(models.ImageField):
	descriptor_class = UrlImageFileDescriptor
