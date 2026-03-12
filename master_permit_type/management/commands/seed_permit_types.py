from django.core.management.base import BaseCommand
from master_permit_type.models import MasterPermitType


class Command(BaseCommand):
    help = "Seed permit type table"

    def handle(self, *args, **kwargs):

        permit_types = [
            {"id": 1, "name": "food", "description": "Food", "prefix": "RFP-"},
            {"id": 2, "name": "mobile_food", "description": "Mobile Food", "prefix": "MF-"},
            {"id": 3, "name": "temp_food", "description": "Temporary Food", "prefix": "TF-"},
            {"id": 4, "name": "farmers_market", "description": "Farmers Market", "prefix": "FM-"},
            {"id": 5, "name": "temp_artist_license", "description": "Temp Artist License", "prefix": "TALP-"},
            {"id": 6, "name": "body_art", "description": "Body Art", "prefix": "BA-"},
            {"id": 7, "name": "pool", "description": "Pool", "prefix": "PP-"},
            {"id": 8, "name": "regular_artist_license", "description": "Regular Artist License", "prefix": "RALP-"},
            {"id": 9, "name": "non_profit_food_permit", "description": "Non-Profit Food Permit", "prefix": "NP-"},
            {"id": 10, "name": "sewage_permit", "description": "Sewage Permit", "prefix": "SP-"},
            {"id": 11, "name": "micro_market", "description": "Micro Market", "prefix": "MM-"},
        ]

        for permit in permit_types:
            MasterPermitType.objects.update_or_create(
                id=permit["id"],
                defaults={
                    "name": permit["name"],
                    "description": permit["description"],
                    "prefix": permit["prefix"],
                }
            )

        self.stdout.write(self.style.SUCCESS("Permit types seeded successfully"))