import json

from django.shortcuts import get_object_or_404
from django.http import HttpResponse, HttpResponseBadRequest, Http404
from django.forms.models import model_to_dict
from django.db.models.query import QuerySet


class Encoder(json.JSONEncoder):
	def __init__(self, treats={}):
		self.treats = treats
		super().__init__()

	def default(self, obj):
		if type(obj) in self.treats:
			return self.treats[type(obj)](obj)
		return json.JSONEncoder.default(self, obj)


class Ressource(object):
	def __init__(self, model, allowed, summary=None, foreigns=[], treats={}):
		self.model = model
		self.allowed = allowed
		self.summary = summary
		self.foreigns = foreigns
		self.encoder = Encoder(treats)

		# Fall back to allowed and id for summary
		if summary:
			self.summary = summary
		else:
			self.summary = allowed
			self.summary.append('id')

	def provide(self, request, id, foreign=None):
		# Require login
		if request.user.is_anonymous():
			return HttpResponse('Unauthorized', status=401)

		# Ensure parameter types
		id = int(id) if id else None
		foreign = str(foreign) if foreign else None

		if request.method == 'GET' and id and foreign:
			# Get list of entities this has a foreign key to
			if not foreign in self.foreigns:
				return HttpResponseBadRequest()
			entity = self.get(request.user, id)
			if not hasattr(entity, foreign + '_set'):
				raise Http404()
			entities = getattr(entity, foreign + '_set').all()
			return self.show(entities)
		elif request.method == 'GET' and id:
			# Get single entity
			entity = self.get(request.user, id)
			return self.show(entity)
		elif request.method == 'GET':
			# Get list of all entities
			entities = self.get(request.user)
			return self.show(entities)
		elif request.method == 'POST':
			# Create new entity
			values = self.parse(request)
			entity = self.create(request.user, values)
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

	# Get dict from serialized request body
	def parse(self, request):
		values = json.loads(request.body.decode('utf-8'))
		return values

	# Create new entity from model
	def create(self, user, values):
		entity = self.model.objects.create(user=user)
		self.update(entity, values)
		return entity

	# Get entity by id or list of all entities
	def get(self, user, id=None):
		if id:
			try:
				return self.model.objects.get(id=id, user=user)
			except self.model.DoesNotExist:
				raise Http404
		return self.model.objects.filter(user=user)

	# Respond with serialized entity or list of entities
	def show(self, data):
		if isinstance(data, self.model):
			# Data is an entity of our model
			values = model_to_dict(data)
			del values['user']
		elif isinstance(data, QuerySet) and data.model is self.model:
			# Data is a queryset of entities of our model,
			# filter summary fileds for list requests
			values = list(data.values(*self.summary))
		elif isinstance(data, QuerySet):
			# Data is a queryset of an unknown model, so
			# just convert it to a list
			values = list(data)
		else:
			# Data is unknown, perform no conversion
			values = data
		string = self.encoder.encode(values)
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


class AttachedRessource(Ressource):
	# Represents a ressource which owning user is not stored as a field,
	# but determined by the ownership of a foreign key. This is suitable
	# for models strongly related to other models.
	def __init__(self, model, foreign, *args, **kwargs):
		self.foreign = foreign
		super().__init__(model, *args, **kwargs)

	# Create new entity from model and provide foreign key
	def create(self, user, values):
		foreign_model = self.model._meta.get_field(self.foreign).rel.to
		foreign_entity = foreign_model.objects.get(user=user, id=values[self.foreign])
		kwargs = {self.foreign: foreign_entity}
		entity = self.model.objects.create(user=user, **kwargs)
		del values[self.foreign]
		self.update(entity, values)
		return entity

	# Get entity by id or list of all entities
	# Perform a field lookup at foreign model to determine ownership
	def get(self, user, id=None):
		kwargs = {self.foreign + '__user': user}
		if id:
			try:
				return self.model.objects.get(id=id, **kwargs)
			except self.model.DoesNotExist:
				raise Http404
		return self.model.objects.filter(**kwargs)
