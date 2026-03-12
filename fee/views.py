from django.shortcuts import render, redirect
from fee.models import Fee
from django.http import JsonResponse

# Create your views here.
def permit_fee(request):
    if request.method == "POST":
        master_fee_id = request.POST.get('master_fee_id')

        try:
            fee = Fee.objects.get(id=master_fee_id)

            data = {
                "classifications": fee.classifications,
                "base_charge": float(fee.base_charge),
                "unit_type": float(fee.base_charge)
            }

            return JsonResponse(data)

        except Fee.DoesNotExist:
            return JsonResponse({"error": "Fee not found"}, status=404)
