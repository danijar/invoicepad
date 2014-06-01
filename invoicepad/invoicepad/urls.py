from django.conf import settings
from django.conf.urls import patterns, include, url
from django.conf.urls.static import static
from django.contrib import admin


urlpatterns = patterns('',
    url(r'^admin/', include(admin.site.urls)),
    url(r'^$', 'apps.user.views.index', name='index'),
    url(r'^login/$', 'apps.user.views.login', name='login'),
    url(r'^logout/$', 'apps.user.views.logout', name='logout'),
    url(r'^customer/((?P<id>[0-9]+)/)?', 'apps.customer.views.customer', name='customer'),
) + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
