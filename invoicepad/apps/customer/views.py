import json

from django.views.decorators.csrf import csrf_exempt
from django.db.models.fields.files import ImageFieldFile
from shared.views import provide

from .models import Customer


class Encoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, ImageFieldFile):
            return obj.url if obj else None
        return json.JSONEncoder.default(self, obj)


@csrf_exempt
def customer(request, id):
    allowed = ['name', 'fullname', 'address1', 'address2', 'address3', 'mail', 'website', 'notes', 'ustid', 'logo']
    summary = ['id', 'name', 'website', 'mail', 'logo']
    handler = provide(Customer, allowed=allowed, summary=summary, encoder=Encoder)
    return handler.provide(request, id)
