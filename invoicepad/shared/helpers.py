import datetime

from django.utils.timezone import now


def current_time():
	return now()

def current_date():
	return current_time().date()
