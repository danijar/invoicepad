import json
import datetime

from django.views.decorators.csrf import csrf_exempt
from shared.views import provide

from .models import Project, Time


class Encoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, datetime.date):
             return obj.isoformat() if obj else None
        return json.JSONEncoder.default(self, obj)


@csrf_exempt
def project(request, id):
	allowed = ['invoice', 'name', 'description', 'deadline', 'agreement', 'finished', 'value', 'hours']
	summary = ['id', 'name', 'deadline', 'agreement', 'finished']
	handler = provide(Project, allowed=allowed, summary=summary, encoder=Encoder)
	return handler.provide(request, id)


@csrf_exempt
def time(request, id):
	allowed = ['project', 'message', 'start', 'end']
	summary = ['id', 'project']
	handler = provide(Time, allowed=allowed, summary=summary, encoder=Encoder)
	return handler.provide(request, id)
