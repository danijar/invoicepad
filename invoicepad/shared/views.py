import json

from django.shortcuts import get_object_or_404
from django.http import HttpResponse, HttpResponseBadRequest, Http404
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
			entity = self.get(request.user, id)
			return self.show(entity)
		elif request.method == 'GET':
			# Get list of all entities
			entities = self.get(request.user)
			return self.show(entities)
		elif request.method == 'POST':
			# Create new entity
			entity = self.model.objects.create(user=request.user)
			values = self.parse(request)
			self.update(entity, values)
			return self.show(entity)
		elif request.method == 'PUT' and id:
			# Update existing models
			entity = self.get(request.user, id)
			values = self.parse(request)
			self.update(entity, values)
			return self.show(entity)
		elif request.method == 'DELETE' and id:
			# Delete entity
			entity = self.get(request.user, id)
			entity.delete()
			return HttpResponse()
		else:
			# No method available
			return HttpResponseBadRequest()

	def parse(self, request):
		values = json.loads(request.body.decode('utf-8'))
		return values

	# Get entity by id or list of all entities
	def get(self, user, id=None):
		if id:
			try:
				return self.model.objects.get(id=id, user=user)
			except self.model.DoesNotExist:
				raise Http404
		return self.model.objects.filter(user=user)

	# Respond with serialized entity or list of entities
	def show(self, entity):
		if isinstance(entity, self.model):
			values = model_to_dict(entity)
			del values['user']
		else:
			values = list(entity.values(*self.summary))
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
