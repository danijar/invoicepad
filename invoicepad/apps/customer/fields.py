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
			try:
				response = urllib.request.urlopen(value)
				image = response.read()
				name = str(uuid.uuid4()) + '.png'
				value = ContentFile(image, name)
			except:
				print('Error fetching image from', value)
				pass
		super().__set__(instance, value)


class UrlImageField(models.ImageField):
	# An image field that you can assign a string to and it will
	# automatically fetch the image from that URL.
	descriptor_class = UrlImageFileDescriptor
