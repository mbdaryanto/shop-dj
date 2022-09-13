from django.test import TestCase
from django.utils import timezone
from .models import ItemCategory, Item, Purchase, PurchaseD
from .serializers import PurchaseCreateUpdateSerializer


class PurchaseTest(TestCase):

    def create_initial_data(self):
        item_category = ItemCategory.objects.create(name='Category 1')
        item = Item.objects.create(category=item_category, barcode='11111', name='Testing Item', unit_price='12345.0')
        purchase = Purchase.objects.create(code='TEST_1', date=timezone.now().date())
        purchase_d = PurchaseD.objects.create(purchase=purchase, item=item, quantity=2, unit_price=12340)

        return item, purchase, purchase_d
    
    def test_purchase_serializer(self):
        item, purchase, purchase_d = self.create_initial_data()

        data = dict(
            id=purchase.id,
            code='11112',
            date=timezone.now().date() - timezone.timedelta(days=1),
            details=[
                dict(
                    id=purchase_d.id,
                    item=item.id,
                    quantity=11,
                    unit_price=20050,
                ),
            ]
        )
        serializer = PurchaseCreateUpdateSerializer(purchase, data=data)
        self.assertTrue(serializer.is_valid(), repr(serializer.errors))
        serializer.save()
        print(repr(serializer.validated_data))

        purchase_ds = PurchaseD.objects.filter(purchase=purchase)
        self.assertEqual(len(purchase_ds), 1)
        self.assertEqual(purchase_ds[0].id, purchase_d.id)
        self.assertEqual(purchase_ds[0].quantity, 11)
        self.assertEqual(purchase_ds[0].unit_price, 20050)
