from django.db import models

class Reporte(models.Model):
    nombre = models.CharField(max_length=100)
    descripcion = models.TextField()
    fecha = models.DateTimeField(auto_now_add=True)
    foto = models.ImageField(upload_to='fotos/', blank=True, null=True)
    video = models.FileField(upload_to='videos/', blank=True, null=True)
    audio = models.FileField(upload_to='audios/', blank=True, null=True)
    documento = models.FileField(upload_to='documentos/', blank=True, null=True)

    def __str__(self):
        return f"{self.nombre} - {self.fecha.strftime('%d/%m/%Y %H:%M')}"