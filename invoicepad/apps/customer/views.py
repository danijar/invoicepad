import json
import urllib.request

from django.core.files.base import ContentFile
from django.shortcuts import get_object_or_404
from django.http import HttpResponse, HttpResponseNotFound, HttpResponseBadRequest
from django.forms.models import model_to_dict
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.models import User

from apps.customer.models import Customer


@csrf_exempt
def customers(request):
    if request.user.is_anonymous():
        return HttpResponse('Unauthorized', status=401)
    models = Customer.objects.filter(user=request.user)
    values = models.values('id', 'name', 'website', 'mail', 'logo')
    string = json.dumps(list(values))
    return HttpResponse(string, content_type='application/json')


@csrf_exempt
def customer(request, id):
    if request.user.is_anonymous():
        return HttpResponse('Unauthorized', status=401)
    if request.method == 'POST':
        return create(request)
    elif id is not None:
        id = int(id)
        if request.method == 'GET':
            return select(request, id)
        elif request.method == 'PUT':
            return update(request, id)
        elif request.method == 'DELETE':
            return delete(request, id)
    return HttpResponseBadRequest()


def create(request):
    # get request body
    values = json.loads(request.body.decode('utf-8'))

    # check for needed properties
    if not 'name' in values:
        return HttpResponseBadRequest()

    # create model and update values
    model = Customer.objects.create(name=values['name'], user=request.user)
    return update(request, model.id)


def select(request, id):
    # get customer as dictionary
    model = get_object_or_404(Customer, id=id, user=request.user)
    values = model_to_dict(model)

    # replace logo object by url
    values['logo'] = values['logo'].url if values['logo'] else ''

    # respond with customer properties
    string = json.dumps(values)
    return HttpResponse(string, content_type='application/json')


def update(request, id):
    # get request body
    values = json.loads(request.body.decode('utf-8'))

    # filter out forbidden values
    allowed = ['name', 'fullnane', 'address1', 'address2', 'address3', 'mail', 'website', 'notes', 'ustid', 'logo']
    validated = {}
    for key in allowed:
        if key in values:
            validated[key] = values[key]

    # fetch logo from url
    if 'logo' in validated and validated['logo']:
        validated['logo'] = ContentFile(urllib.request.urlopen(validated['logo']).read(), 'test.png')

    # update model and respond
    Customer.objects.filter(id=id, user=request.user).update(**validated)
    return select(request, id)


def delete(request, id):
    # find model
    model = Customer.objects.filter(id=id, user=request.user)
    if not model:
        return HttpResponseNotFound()

    # delete and respond with ok
    model.delete()
    return HttpResponse()
