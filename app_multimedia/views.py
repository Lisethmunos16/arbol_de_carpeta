from django.shortcuts import render
from .forms import ReporteForm
from .models import Reporte

def evacuacion_view(request):
    if request.method == 'POST':
        form = ReporteForm(request.POST, request.FILES)
        if form.is_valid():
            form.save()
    else:
        form = ReporteForm()

    reportes = Reporte.objects.all().order_by('-fecha')

    return render(request, 'app_multimedia/evacuacion.html', {
        'form': form,
        'reportes': reportes
    })

def panel_view(request):
    return render(request, 'app_multimedia/panel.html')