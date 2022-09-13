from django.db import models

# Create your models here.

class ItemCategory(models.Model):
    name = models.CharField(max_length=100)
    notes = models.TextField(blank=True)

    def __str__(self):
        return self.name


class Item(models.Model):
    barcode = models.CharField(max_length=30, unique=True)
    name = models.CharField(max_length=100)
    unit_price = models.FloatField()
    category = models.ForeignKey(ItemCategory, on_delete=models.RESTRICT)
    notes = models.TextField(blank=True)

    def __str__(self):
        return "{}: {}".format(self.barcode, self.name)


class Purchase(models.Model):
    code = models.CharField(max_length=200, unique=True)
    date = models.DateField()

    def __str__(self):
        return "{}: {}".format(self.code, self.date)


class PurchaseD(models.Model):
    purchase = models.ForeignKey(Purchase, related_name='details', on_delete=models.CASCADE)
    item = models.ForeignKey(Item, on_delete=models.RESTRICT)
    quantity = models.FloatField()
    unit_price = models.FloatField()


class Sell(models.Model):
    code = models.CharField(max_length=200, unique=True)
    date = models.DateField()

    def __str__(self):
        return "{}: {}".format(self.code, self.date)


class SellD(models.Model):
    sell = models.ForeignKey(Sell, related_name='details', on_delete=models.CASCADE)
    item = models.ForeignKey(Item, on_delete=models.RESTRICT)
    quantity = models.FloatField()
    unit_price = models.FloatField()

    
