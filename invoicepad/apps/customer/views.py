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


class MyJSONEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, ImageFieldFile):
            if obj:
                return obj.url
            else:
                return ''
        return json.JSONEncoder.default(self, obj)


@csrf_exempt
def customer(request, id):
    if request.user.is_anonymous():
        return HttpResponse('Unauthorized', status=401)

    # Ensure integer type
    id = int(id) if id else None

    if request.method == 'GET' and id:
        # Get single model
        model = get_object_or_404(Customer, id=id, user=request.user)
        return show(model)
    elif request.method == 'GET':
        # Get list of all models
        models = Customer.objects.filter(user=request.user)
        values = models.values('id', 'name', 'website', 'mail', 'logo')
        string = json.dumps(list(values))
        return HttpResponse(string, content_type='application/json')
    elif request.method == 'POST':
        # Create new model
        values = json.loads(request.body.decode('utf-8'))
        model = Customer.objects.create(name='', user=request.user)
        update(model, values)
        return show(model)
    elif request.method == 'PUT' and id:
        # Update existing models
        model = get_object_or_404(Customer, id=id, user=request.user)
        values = json.loads(request.body.decode('utf-8'))
        update(model, values)
        return show(model)
    elif request.method == 'DELETE' and id:
        # Delete model
        model = get_object_or_404(Customer, id=id, user=request.user)
        model.delete()
        return HttpResponse()
    else:
        # No method available
        return HttpResponseBadRequest()


def show(customer):
    # Respond with serialized model
    values = model_to_dict(customer)
    string = json.dumps(values, cls=MyJSONEncoder)
    return HttpResponse(string, content_type='application/json')


def update(customer, values):
    # Filter allowed values
    validated = {}
    for i in ['name', 'fullname', 'address1', 'address2', 'address3', 'mail', 'website', 'notes', 'ustid', 'logo']:
        if i in values:
            validated[i] = values[i]

    # Update model
    for (key, value) in validated.items():
        setattr(customer, key, value)
    customer.save()
