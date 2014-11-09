from django.views.decorators.csrf import csrf_exempt
from django.db.models.fields.files import ImageFieldFile
from shared.views import Ressource

from .models import Customer


@csrf_exempt
def customer(request, id):
	allowed = ['name', 'fullname', 'address1', 'address2', 'address3', 'mail', 'website', 'notes', 'ustid', 'logo']
	summary = ['id', 'name', 'website', 'mail', 'logo']
	treats = {ImageFieldFile: (lambda x: x.url if x else None)}
	ressource = Ressource(Customer, allowed, summary, treats=treats)
	return ressource.provide(request, id)
