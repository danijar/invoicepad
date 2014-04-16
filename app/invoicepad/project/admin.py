from django.contrib import admin
from project.models import Project, Time

class TimeInline(admin.TabularInline):
	model = Time
	extra = 0

class ProjectAdmin(admin.ModelAdmin):
	inlines = [TimeInline]

admin.site.register(Project, ProjectAdmin)
admin.site.register(Time)
