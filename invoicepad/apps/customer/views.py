from django.views.decorators.csrf import csrf_exempt
from django.db.models.fields.files import FileField

from shared.views import Ressource
from shared.traits import default_traits
from .models import Customer


@csrf_exempt
def customer(request, id):
	allowed = ['name', 'fullname', 'address1', 'address2', 'address3', 'mail', 'website', 'notes', 'ustid', 'logo']
	summary = ['id', 'name', 'website', 'mail', 'logo']
	ressource = Ressource(Customer, allowed, summary, json_traits=default_traits)
	return ressource.provide(request, id)
