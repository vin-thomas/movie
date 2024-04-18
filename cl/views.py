from django.http import HttpResponse
from django.shortcuts import render
from . import ensemble

def index(request):
    task = ''
    result = ''
    if request.method == 'POST':
        task = request.POST.get('plot', '')
        if task:
            result = 'Hit or Miss: ' + str(ensemble.hit_or_miss(task))
    return render(request, "cl/index.html",
    {'original_text': task, 'result': result})
    
   