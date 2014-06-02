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


@csrf_exempt
def customer(request, id):
    if request.user.is_anonymous():
        return HttpResponse('Unauthorized', status=401)

    # Ensure integer type
    hasid = False
    if id is not None:
        hasid = True
        id = int(id)

    if request.method == 'GET' and hasid:
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
        if not 'name' in values:
            return HttpResponseBadRequest()
        model = Customer.objects.create(name=values['name'], user=request.user)
        update(model, values)
        return show(model)
    elif request.method == 'PUT' and hasid:
        # Update existing models
        model = get_object_or_404(Customer, id=id, user=request.user)
        values = json.loads(request.body.decode('utf-8'))
        update(model, values)
        return show(model)
    elif request.method == 'DELETE' and hasid:
        # Delete model
        model = get_object_or_404(Customer, id=id, user=request.user)
        model.delete()
        return HttpResponse()
    else:
        # No method available
        return HttpResponseBadRequest()


def show(customer):
    # get properties
    values = model_to_dict(customer)

    # replace logo object by url
    values['logo'] = values['logo'].url if values['logo'] else ''

    # respond
    string = json.dumps(values)
    return HttpResponse(string, content_type='application/json')


def update(customer, values):
    # filter out values which can be modified
    validated = {}
    for i in ['name', 'fullname', 'address1', 'address2', 'address3', 'mail', 'website', 'notes', 'ustid', 'logo']:
        if i in values:
            validated[i] = values[i]

    # fetch logo from url
    if 'logo' in validated and validated['logo']:
        filename = str(uuid.uuid4()) + '.png'
        validated['logo'] = ContentFile(urllib.request.urlopen(validated['logo']).read(), filename)

    # update model
    for (key, value) in validated.items():
        setattr(customer, key, value)
    customer.save()
