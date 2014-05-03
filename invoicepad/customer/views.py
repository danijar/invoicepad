import json

from django.shortcuts import render, get_object_or_404
from django.http import HttpResponse, HttpResponseBadRequest
from django.forms.models import model_to_dict
from django.views.decorators.csrf import csrf_exempt

from customer.models import Customer


@csrf_exempt # for development
def listing(request):
    # if not request.user.is_authenticated():
    #     return HttpResponse('Unauthorized', status=401)
    models = Customer.objects.filter(user=1) # request.user
    values = models.values('id', 'name', 'website', 'mail', 'logo')
    string = json.dumps(list(values))
    return HttpResponse(string, content_type='application/json')


@csrf_exempt # for development
def single(request, id):
    # if not request.user.is_authenticated():
    #     return HttpResponse('Unauthorized', status=401)
    if request.method == 'POST':
        return create(request)
    elif id is not None:
        id = int(id)
        if request.method == 'GET':
            return select(request, id)
        elif request.method == 'PUT':
            return update(request, id)
        elif request.method == 'DELETE':
            return delete(id)
    return HttpResponseBadRequest()


def create(request):
    values = json.loads(request.body.decode('utf-8'))
    return HttpResponse('Create customer with ' + str(values))


def select(request, id):
    model = get_object_or_404(Customer, id=id, user=1) # request.user
    values = model_to_dict(model)
    values['logo'] = values['logo'].url if values['logo'] else ''
    string = json.dumps(values)
    return HttpResponse(string, content_type='application/json')


def update(request, id):
    values = json.loads(request.body.decode('utf-8'))
    return HttpResponse('Edit customer ' + str(id) + ' with ' + str(values))


def delete(id):
    return HttpResponse('Delete customer ' + str(id))
