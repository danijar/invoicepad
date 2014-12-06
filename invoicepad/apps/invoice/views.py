import datetime

from django.views.decorators.csrf import csrf_exempt
from shared.traits import default_traits
from shared.views import Ressource

from .models import Invoice

@csrf_exempt
def invoice(request, id):
	allowed = ['customer', 'date', 'counter', 'number', 'value', 'pdf']
	summary = ['id', 'customer', 'date', 'counter', 'value']
	ressource = Ressource(Invoice, allowed, summary, json_traits=default_traits)
	return ressource.provide(request, id)
