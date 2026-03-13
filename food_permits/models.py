from django.db import models
from fee.models import Fee
from users.models import User
from owner.models import Owner

class FoodPermit(models.Model):

    RENEW_STATUS = [
        (0, "Firstly Created"),
        (1, "Renewed"),
        (2, "Previous Row after Renewal"),
    ]

    permit_number = models.CharField(max_length=150, blank=True, null=True)
    fee = models.ForeignKey(Fee, on_delete=models.CASCADE)
    is_catering_fee = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    is_late_fee = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    catering_fee = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    late_fee = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    permit_fee = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    total_fee = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    is_permit_fee_paid = models.BooleanField(default=False)
    application_date = models.DateField(blank=True, null=True)
    expiration_date = models.DateField(blank=True, null=True)
    est_name = models.CharField(max_length=150, blank=True, null=True)
    est_phone = models.CharField(max_length=150, blank=True, null=True)
    est_address = models.CharField(max_length=200, blank=True, null=True)
    est_city = models.CharField(max_length=150, blank=True, null=True)
    est_state = models.CharField(max_length=150, blank=True, null=True)
    est_zip = models.CharField(max_length=150, blank=True, null=True)
    manager_name = models.CharField(max_length=150, blank=True, null=True)
    manager_phone = models.CharField(max_length=150, blank=True, null=True)
    manager_email = models.CharField(max_length=150, blank=True, null=True)
    owner = models.ForeignKey( Owner, on_delete=models.SET_NULL, null=True, blank=True,related_name="owners")
    is_copy_est = models.BooleanField(default=False)
    is_copy_owner = models.BooleanField(default=False)
    applicant_name = models.CharField(max_length=150, blank=True, null=True)
    applicant_address = models.CharField(max_length=200, blank=True, null=True)
    applicant_city = models.CharField(max_length=150, blank=True, null=True)
    applicant_state = models.CharField(max_length=150, blank=True, null=True)
    applicant_zip = models.CharField(max_length=150, blank=True, null=True)
    risk = models.CharField(max_length=125, blank=True, null=True)
    renewed = models.IntegerField( choices=RENEW_STATUS, default=0, help_text="0 => Firstly Created, 1 => Renewed, 2 => Previous Row after Renewal" )
    permit_status = models.CharField(max_length=150, blank=True, null=True)
    active_date = models.DateField(blank=True, null=True)
    previous_permit_status = models.CharField(max_length=150, blank=True, null=True)
    previous_permit = models.ForeignKey('self', on_delete=models.SET_NULL, null=True, blank=True, related_name='renewed_permits' )
    exp_permit = models.ForeignKey('self', on_delete=models.SET_NULL, null=True, blank=True, related_name='expired_permits')
    created_by = models.ForeignKey( User, on_delete=models.SET_NULL, null=True, blank=True,related_name="created_food_permits")
    updated_by = models.ForeignKey( User, on_delete=models.SET_NULL, null=True, blank=True, related_name="updated_food_permits")
    is_active = models.BooleanField(default=True)
    is_import = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    deleted_at = models.DateTimeField(blank=True, null=True)

    def __str__(self):
        return self.permit_number or "Food Permit"