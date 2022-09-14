from django.test import TestCase
from django.utils import timezone
from .models import ItemCategory, Item, Purchase, PurchaseD, Sell, SellD
from .serializers import PurchaseCreateUpdateSerializer, SellCreateUpdateSerializer


class InventoryTest(TestCase):
    item_category: ItemCategory
    item: Item

    def setUp(self):
        self.item_category = ItemCategory.objects.create(name='Category 1')
        self.item = Item.objects.create(category=self.item_category, barcode='11111', name='Testing Item', unit_price='12345.0')
   
    def test_purchase_serializer(self):
        item = self.item
        purchase = Purchase.objects.create(code='TEST_1', date=timezone.now().date())
        purchase_d = PurchaseD.objects.create(purchase=purchase, item=item, quantity=2, unit_price=12340)

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


    def test_sell_serializer(self):
        item = self.item
        sell = Sell.objects.create(code='TEST_1', date=timezone.now().date())
        sell_d = SellD.objects.create(sell=sell, item=item, quantity=2, unit_price=12340)

        data = dict(
            id=sell.id,
            code='11112',
            date=timezone.now().date() - timezone.timedelta(days=1),
            details=[
                dict(
                    id=sell_d.id,
                    item=item.id,
                    quantity=12,
                    unit_price=1050,
                ),
            ]
        )
        serializer = SellCreateUpdateSerializer(sell, data=data)
        self.assertTrue(serializer.is_valid(), repr(serializer.errors))
        serializer.save()
        print(repr(serializer.validated_data))

        sell_ds = SellD.objects.filter(sell=sell)
        self.assertEqual(len(sell_ds), 1)
        self.assertEqual(sell_ds[0].id, sell_d.id)
        self.assertEqual(sell_ds[0].quantity, 12)
        self.assertEqual(sell_ds[0].unit_price, 1050)
