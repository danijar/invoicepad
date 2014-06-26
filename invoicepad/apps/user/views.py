import json

from django.shortcuts import render, redirect
from django.http import HttpResponse, HttpResponseBadRequest
from django.contrib import auth
from django.views.decorators.csrf import csrf_exempt


def index(request):
    # When not logged in show public area
    if request.user.is_anonymous():
        return render(request, 'public.html')
    # For logged in users show dashboard
    return render(request, 'index.html')


@csrf_exempt
def login(request):
    # Form submission
    if request.method == 'POST':
        # Attempt to log user in
        username = request.POST['username']
        password = request.POST['password']
        user = auth.authenticate(username=username, password=password)

        # For invalid credentials display message
        if user is None:
            return render(request, 'login.html', {'message': 'The entered username or password was wrong.'})
        # When successful login and redirect to dashboard
        elif user.is_active:
            auth.login(request, user)
            return redirect('index')
        # For disabled accounts display message
        else:
            return render(request, 'login.html', {'message': 'You account is disabled.'})

    # Access login page
    else:
        # Redirect logged in users to dashboard
        if request.user.is_authenticated():
            return redirect('index')
        # Otherwise show the page
        else:
            return render(request, 'login.html')


def logout(request):
    # Log out and redirect to public area
    auth.logout(request)
    return redirect('index')

def user(request):
    if request.user.is_anonymous():
        return HttpResponse('Unauthorized', status=401)

    if request.method == 'GET':
        # Return details of logged in user
        user = request.user
        values = {
            'first_name': user.first_name,
            'last_name':  user.last_name,
            'email':      user.email,
            'last_login': str(user.last_login),
        }
        string = json.dumps(values)
        return HttpResponse(string, content_type='application/json')
    else:
        # No method available
        return HttpResponseBadRequest()
