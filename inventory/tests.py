from django.test import TestCase
from django.utils import timezone
from .models import ItemCategory, Item, Purchase, PurchaseD, Sales, SalesD
from .serializers import PurchaseCreateUpdateSerializer, SalesCreateUpdateSerializer


class InventoryTest(TestCase):
    item_category: ItemCategory
    item: Item

    def setUp(self):
        self.item_category = ItemCategory.objects.create(name='Category 1')
        self.item = Item.objects.create(category=self.item_category, barcode='11111', name='Testing Item', unit_price='12345.0')

    def test_purchase_serializer(self):
        item = self.item
        purchase = Purchase.objects.create(code='TEST_1', date=timezone.now().date(), supplier="test supplier")
        purchase_d = PurchaseD.objects.create(purchase=purchase, item=item, quantity=2, unit_price=12340)

        data = dict(
            id=purchase.id,
            code='11112',
            date=timezone.now().date() - timezone.timedelta(days=1),
            supplier='supplier test',
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
        print(repr(serializer.validated_data))
        saved_purchase = serializer.save()
        self.assertEqual(saved_purchase.supplier, 'supplier test')

        # saved_purchase_ds = PurchaseD.objects.filter(purchase=purchase)
        saved_purchase_ds = saved_purchase.details.all()
        self.assertEqual(len(saved_purchase_ds), 1)
        self.assertEqual(saved_purchase_ds[0].id, purchase_d.id)
        self.assertEqual(saved_purchase_ds[0].quantity, 11)
        self.assertEqual(saved_purchase_ds[0].unit_price, 20050)


    def test_sales_serializer(self):
        item = self.item
        sales = Sales.objects.create(code='TEST_1', date=timezone.now().date(), customer="cash")
        sales_d = SalesD.objects.create(sales=sales, item=item, item_name=item.name, quantity=2, unit_price=12340)

        data = dict(
            id=sales.id,
            code='11112',
            date=timezone.now().date() - timezone.timedelta(days=1),
            customer='customer test',
            details=[
                dict(
                    id=sales_d.id,
                    item=item.id,
                    item_name="other item name",
                    quantity=12,
                    unit_price=1050,
                ),
            ]
        )
        serializer = SalesCreateUpdateSerializer(sales, data=data)
        self.assertTrue(serializer.is_valid(), repr(serializer.errors))
        print(repr(serializer.validated_data))
        saved_sales = serializer.save()

        self.assertEqual(saved_sales.customer, 'customer test')

        # sales_ds = SalesD.objects.filter(sell=sales)
        saved_sales_ds = saved_sales.details.all()
        self.assertEqual(len(saved_sales_ds), 1)
        self.assertEqual(saved_sales_ds[0].id, sales_d.id)
        self.assertEqual(saved_sales_ds[0].quantity, 12)
        self.assertEqual(saved_sales_ds[0].unit_price, 1050)
        self.assertEqual(saved_sales_ds[0].item_name, "other item name")
