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
    unit_price = models.DecimalField(max_digits=20, decimal_places=2)
    category = models.ForeignKey(ItemCategory, on_delete=models.RESTRICT)
    notes = models.TextField(blank=True)

    def __str__(self):
        return "{}: {}".format(self.barcode, self.name)


class Purchase(models.Model):
    code = models.CharField(max_length=200)
    date = models.DateField()
    supplier = models.CharField(max_length=200)

    def __str__(self):
        return "{}: {}".format(self.code, self.date)


class PurchaseD(models.Model):
    purchase = models.ForeignKey(Purchase, related_name='details', on_delete=models.CASCADE)
    item = models.ForeignKey(Item, on_delete=models.RESTRICT)
    quantity = models.DecimalField(max_digits=20, decimal_places=2)
    unit_price = models.DecimalField(max_digits=20, decimal_places=2)


class Sales(models.Model):
    code = models.CharField(max_length=200)
    date = models.DateField()
    customer = models.CharField(max_length=200)

    def __str__(self):
        return "{}: {}".format(self.code, self.date)


class SalesD(models.Model):
    sales = models.ForeignKey(Sales, related_name='details', on_delete=models.CASCADE)
    item = models.ForeignKey(Item, on_delete=models.RESTRICT, null=True)
    item_name = models.CharField(max_length=100)
    quantity = models.DecimalField(max_digits=20, decimal_places=2)
    unit_price = models.DecimalField(max_digits=20, decimal_places=2)
