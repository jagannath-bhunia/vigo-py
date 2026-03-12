from django.db import models

class MasterPermitType(models.Model):
    name = models.CharField(max_length=200, blank=True, null=True)
    description = models.CharField(max_length=200, blank=True, null=True)
    prefix = models.CharField(max_length=50, blank=True, null=True)
    is_active = models.BooleanField(default=1)
    deleted_at = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return self.name 