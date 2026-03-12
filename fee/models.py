from django.db import models
from master_permit_type.models import MasterPermitType
class Fee(models.Model):

    master_permit_type_id = models.ForeignKey(
        MasterPermitType,
        on_delete=models.CASCADE
    )



    classifications = models.CharField(max_length=200, blank=True, null=True)
    base_charge = models.DecimalField( max_digits=10, decimal_places=2, blank=True, null=True )
    month = models.CharField(max_length=125, blank=True, null=True)
    employee = models.CharField(max_length=125, blank=True, null=True)

    
    is_active = models.BooleanField(default=1)
    deleted_at = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return self.classifications 