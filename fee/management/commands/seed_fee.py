from django.core.management.base import BaseCommand
from fee.models import Fee
from master_permit_type.models import MasterPermitType


class Command(BaseCommand):
    help = "Seed fee table"

    def handle(self, *args, **kwargs):

        fees = [
            {
                "id": 1,
                "master_permit_type_id": 1,
                "classifications": "1-15 Employees(January-December)",
                "base_charge": 150.00,
                "month": "1-6",
                "employee": "15",
                "is_active": True,
            },
            {
                "id": 2,
                "master_permit_type_id": 1,
                "classifications": "16 or More Employees(January-December)",
                "base_charge": 200.00,
                "month": "1-6",
                "employee": "More Than 16",
                "is_active": True,
            },
            {
                "id": 3,
                "master_permit_type_id": 1,
                "classifications": "1-15 Employees(July-December)",
                "base_charge": 75.00,
                "month": "7-12",
                "employee": "15",
                "is_active": True,
            },
            {
                "id": 4,
                "master_permit_type_id": 1,
                "classifications": "16 or More Employees(July-December)",
                "base_charge": 100.00,
                "month": "7-12",
                "employee": "More Than 16",
                "is_active": True,
            },
            {
                "id": 5,
                "master_permit_type_id": 2,
                "classifications": "One Year Mobile Unit",
                "base_charge": 125.00,
                "month": "",
                "employee": "",
                "is_active": True,
            },
            {
                "id": 6,
                "master_permit_type_id": 3,
                "classifications": "Resident of Vigo County",
                "base_charge": 40.00,
                "month": "",
                "employee": "",
                "is_active": True,
            },
            {
                "id": 7,
                "master_permit_type_id": 3,
                "classifications": "Non-Resident of Vigo County",
                "base_charge": 50.00,
                "month": "",
                "employee": "",
                "is_active": True,
            },
        ]

        for fee in fees:

            permit = MasterPermitType.objects.get(id=fee["master_permit_type_id"])

            Fee.objects.update_or_create(
                id=fee["id"],
                defaults={
                    "master_permit_type_id": permit,
                    "classifications": fee["classifications"],
                    "base_charge": fee["base_charge"],
                    "month": fee["month"],
                    "employee": fee["employee"],
                    "is_active": fee["is_active"],
                },
            )

        self.stdout.write(self.style.SUCCESS("Fees seeded successfully"))