import json

from django.shortcuts import get_object_or_404
from django.http import HttpResponse, HttpResponseBadRequest
from django.forms.models import model_to_dict


class provide(object):
	def __init__(self, model, allowed, summary=None, encoder=None):
		self.model = model
		self.allowed = allowed
		self.summary = summary
		self.encoder = encoder

		# Use all for summary if not provided
		if summary:
			self.summary = summary
		else:
			self.summary = allowed
			self.summary.append('id')

	def provide(self, request, id):
		# Require login
		if request.user.is_anonymous():
			return HttpResponse('Unauthorized', status=401)

		# Ensure integer type
		id = int(id) if id else None

		if request.method == 'GET' and id:
			# Get single entity
			entity = get_object_or_404(model, id=id, user=request.user)
			return show(entity)
		elif request.method == 'GET':
			# Get list of all entities
			entities = self.model.objects.filter(user=request.user)
			values = entities.values(*self.summary)
			string = json.dumps(list(values), cls=self.encoder)
			return HttpResponse(string, content_type='application/json')
		elif request.method == 'POST':
			# Create new entity
			values = json.loads(request.body.decode('utf-8'))
			entity = self.model.objects.create(name='', user=request.user)
			update(entity, values)
			return show(entity)
		elif request.method == 'PUT' and id:
			# Update existing models
			entity = get_object_or_404(self.model, id=id, user=request.user)
			values = json.loads(request.body.decode('utf-8'))
			update(entity, values)
			return show(entity)
		elif request.method == 'DELETE' and id:
			# Delete entity
			entity = get_object_or_404(self.model, id=id, user=request.user)
			entity.delete()
			return HttpResponse()
		else:
			# No method available
			return HttpResponseBadRequest()

	# Respond with serialized entity
	def show(self, entity):
		values = model_to_dict(entity)
		del values['user']
		string = json.dumps(values, cls=self.encoder) if self.encoder else json.dumps(values)
		return HttpResponse(string, content_type='application/json')

	# Update entity from user input
	def update(self, entity, values):
		# Filter allowed values
		validated = {}
		for i in self.allowed:
			if i in values:
				validated[i] = values[i]
		# Update model
		for (key, value) in validated.items():
			setattr(entity, key, value)
		entity.save()
