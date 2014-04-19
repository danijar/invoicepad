from django.conf.urls import patterns, include, url
from django.contrib import admin


urlpatterns = patterns('',
    url(r'^admin/', include(admin.site.urls)),
    url(r'^$', 'invoicepad.views.index', name='index'),
    url(r'^customers/', 'customer.views.listing', name='customers'),
    url(r'^customer/((?P<id>[0-9]+)/)?', 'customer.views.single', name='customer'),
)
