import datetime
from functools import partial

from django.db.models.fields.files import FieldFile


def fetch_method(data, name):
	if data and hasattr(data, name):
		return getattr(data, name)()
	return None

def fetch_attribute(data, name):
	if data and hasattr(data, name):
		return getattr(data, name)
	return None

default_traits = {
	datetime.date:     partial(fetch_method,    name='isoformat'),
	datetime.datetime: partial(fetch_method,    name='isoformat'),
	FieldFile:         partial(fetch_attribute, name='url')
}
