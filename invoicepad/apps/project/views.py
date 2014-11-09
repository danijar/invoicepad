import datetime

from django.views.decorators.csrf import csrf_exempt
from shared.views import Ressource, AttachedRessource

from .models import Project, Time


@csrf_exempt
def project(request, id, foreign):
	allowed = ['invoice', 'name', 'description', 'deadline', 'agreement', 'finished', 'value', 'hours']
	summary = ['id', 'name', 'deadline', 'agreement', 'finished']
	foreigns = ['time']
	treats = {datetime.date: (lambda x: x.isoformat() if x else None)}
	ressource = Ressource(Project, allowed, summary, foreigns, treats=treats)
	return ressource.provide(request, id, foreign)


@csrf_exempt
def time(request, id):
	allowed = ['project', 'message', 'start', 'end']
	summary = ['id', 'project']
	treats = {datetime.datetime: (lambda x: x.isoformat() if x else None)}
	ressource = AttachedRessource(Time, 'project', allowed, summary, treats=treats)
	return ressource.provide(request, id)
