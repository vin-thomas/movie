from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from . import ensemble
from .similarity_search import vector_search


@login_required
def index(request):
    return render(request, 'cl/index.html', {})

@login_required
def hob(request):
    if request.method == 'POST':
        text = request.POST.get('text')
        if text:
            result = ensemble.hit_or_miss(text)
            
        return JsonResponse({'output': str(result)})
    

@login_required
def similar(request):
    if request.method == 'POST':
        text = request.POST.get('text')
        # title = 
        results = vector_search(text)
        return JsonResponse({'results': results})