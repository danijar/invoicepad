import json
import uuid
import urllib.request

from django.core.files.base import ContentFile
from django.shortcuts import get_object_or_404
from django.http import HttpResponse, HttpResponseNotFound, HttpResponseBadRequest
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.models import User
from django.forms.models import model_to_dict

from apps.customer.models import Customer
from django.db.models.fields.files import ImageFieldFile


# Respond with serialized entity
def show(entity, encoder=None):
    values = model_to_dict(entity)
    string = json.dumps(values, cls=encoder) if encoder else json.dumps(values)
    return HttpResponse(string, content_type='application/json')


# Update entity from user input
def update(entity, allowed, values):
    # Filter allowed values
    validated = {}
    for i in allowed:
        if i in values:
            validated[i] = values[i]
    # Update model
    for (key, value) in validated.items():
        setattr(entity, key, value)
    entity.save()


def provide(model, request, id, allowed, summary=None, encoder=None):
    # Require login
    if request.user.is_anonymous():
        return HttpResponse('Unauthorized', status=401)

    # Use all for summary if not provided
    if not summary:
        summary = allowed
        summary.append('id')

    # Ensure integer type
    id = int(id) if id else None

    if request.method == 'GET' and id:
        # Get single model
        entity = get_object_or_404(model, id=id, user=request.user)
        return show(entity, encoder)
    elif request.method == 'GET':
        # Get list of all models
        models = model.objects.filter(user=request.user)
        values = models.values(*summary)
        string = json.dumps(list(values))
        return HttpResponse(string, content_type='application/json')
    elif request.method == 'POST':
        # Create new model
        values = json.loads(request.body.decode('utf-8'))
        entity = model.objects.create(name='', user=request.user)
        update(entity, allowed, values)
        return show(entity, encoder)
    elif request.method == 'PUT' and id:
        # Update existing models
        entity = get_object_or_404(model, id=id, user=request.user)
        values = json.loads(request.body.decode('utf-8'))
        update(entity, allowed, values)
        return show(entity, encoder)
    elif request.method == 'DELETE' and id:
        # Delete model
        entity = get_object_or_404(model, id=id, user=request.user)
        entity.delete()
        return HttpResponse()
    else:
        # No method available
        return HttpResponseBadRequest()


class Encoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, ImageFieldFile):
            return obj.url if obj else ''
        return json.JSONEncoder.default(self, obj)


@csrf_exempt
def customer(request, id):
    allowed = ['name', 'fullname', 'address1', 'address2', 'address3', 'mail', 'website', 'notes', 'ustid', 'logo']
    summary = ['id', 'name', 'website', 'mail', 'logo']
    return provide(Customer, request, id, allowed, summary, encoder=Encoder)
