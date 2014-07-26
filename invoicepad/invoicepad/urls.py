from django.conf import settings
from django.conf.urls import patterns, include, url
from django.conf.urls.static import static
from django.contrib import admin

from django.contrib.staticfiles.views import serve
from django.views.decorators.cache import never_cache


urlpatterns = patterns('',
    url(r'^admin/', include(admin.site.urls)),
    url(r'^$', 'apps.user.views.index', name='index'),
    url(r'^login/$', 'apps.user.views.login', name='login'),
    url(r'^logout/$', 'apps.user.views.logout', name='logout'),
    url(r'^user/$', 'apps.user.views.user', name='user'),
    url(r'^customer/((?P<id>[0-9]+)/)?$', 'apps.customer.views.customer', name='customer'),
)

# Serve all media files publically
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

# Skip cache for development
if settings.DEBUG:
	urlpatterns += patterns('', url(r'^static/(?P<path>.*)$', never_cache(serve)))
