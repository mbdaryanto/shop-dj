from typing import Dict, Any
from rest_framework import serializers, exceptions
from .models import ItemCategory, Item, Purchase, PurchaseD, Sell, SellD


class ItemCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = ItemCategory
        fields = '__all__'


class ItemSerializer(serializers.ModelSerializer):
    category = serializers.SlugRelatedField(
        slug_field='name',
        queryset=ItemCategory.objects.all(),
    )

    class Meta:
        model = Item
        fields = ['id', 'barcode', 'name', 'unit_price', 'category', 'notes',]
        # depth = 2


class PurchaseListSerializer(serializers.ModelSerializer):

    class Meta:
        model = Purchase
        fields = ['id', 'code', 'date']


class PurchaseDCreateUpdateSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(required=False)
    item = serializers.PrimaryKeyRelatedField(
        queryset=Item.objects.all(),
    )

    class Meta:
        model = PurchaseD
        fields = ['id', 'item', 'quantity', 'unit_price',]


class PurchaseCreateUpdateSerializer(serializers.ModelSerializer):
    details = PurchaseDCreateUpdateSerializer(many=True)

    class Meta:
        model = Purchase
        fields = ['id', 'code', 'date', 'details']

    def create(self, validated_data: Dict[str, Any]):
        details_data = validated_data.pop('details')
        purchase = Purchase.objects.create(**validated_data)
        for row in details_data:
            PurchaseD.objects.create(purchase=purchase, **row)
        return purchase

    def update(self, instance: Purchase, validated_data: Dict[str, Any]):
        # print('update: ', repr(validated_data))
        details_data = validated_data.pop('details')

        for key, value in validated_data.items():
            setattr(instance, key, value)

        existing_rows = {
            row.id: row
            for row in PurchaseD.objects.filter(purchase=instance).all()
        }

        for row in details_data:
            if 'id' in row:
                try:
                    purchase_d = existing_rows.pop(row['id'])
                except KeyError:
                    raise exceptions.ValidationError('Purchase detail with id {} is not available'.format(row['id']))

                for key, value in row.items():
                    setattr(purchase_d, key, value)
                # purchase_d.item = row.get('item', purchase_d.item)
                # purchase_d.quantity = row.get('quantity', purchase_d.quantity)
                # purchase_d.unit_price = row.get('unit_price', purchase_d.unit_price)
                purchase_d.save()
            else:
                PurchaseD.objects.create(purchase=instance, **row)

        # delete remaining existing_rows
        for purchase_d in existing_rows.values():
            purchase_d.delete()

        instance.save()
        return instance


class PurchaseDRetrieveSerializer(serializers.ModelSerializer):

    item = ItemSerializer(read_only=True)

    class Meta:
        model = PurchaseD
        fields = ['id', 'item', 'quantity', 'unit_price',]


class PurchaseRetrieveSerializer(serializers.ModelSerializer):
    details = PurchaseDRetrieveSerializer(many=True, read_only=True)

    class Meta:
        model = Purchase
        fields = ['id', 'code', 'date', 'details']


class SellListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Sell
        fields = ['id', 'code', 'date']


class SellDCreateUpdateSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(required=False)
    item = serializers.PrimaryKeyRelatedField(
        queryset=Item.objects.all(),
    )

    class Meta:
        model = SellD
        fields = ['id', 'item', 'quantity', 'unit_price',]


class SellCreateUpdateSerializer(serializers.ModelSerializer):
    details = SellDCreateUpdateSerializer(many=True)
    class Meta:
        model = Sell
        fields = ['id', 'code', 'date', 'details']

    def create(self, validated_data: Dict[str, Any]):
        details_data = validated_data.pop('details')
        sell = Sell.objects.create(**validated_data)
        for row in details_data:
            SellD.objects.create(sell=sell, **row)
        return sell

    def update(self, instance: Sell, validated_data: Dict[str, Any]):
        details_data = validated_data.pop('details')

        # set remaining validated_data values into instance attribute
        for key, value in validated_data.items():
            setattr(instance, key, value)

        # existing rows into dictionary with the id as the key
        existing_rows = {
            row.id: row
            for row in instance.details.all()
            # for row in SellD.objects.filter(sell=instance).all()
        }

        for row in details_data:
            if 'id' in row:
                try:
                    sell_d = existing_rows.pop(row['id'])
                except KeyError:
                    raise exceptions.ValidationError('Sell detail with id {} is not available'.format(row['id']))

                for key, value in row.items():
                    setattr(sell_d, key, value)

                sell_d.save()
            else:
                SellD.objects.create(sell=instance, **row)

        # delete remaining existing_rows
        for sell_d in existing_rows.values():
            sell_d.delete()

        instance.save()
        return instance


class SellDRetriveSerializer(serializers.ModelSerializer):
    item = ItemSerializer(read_only=True)

    class Meta:
        model = SellD
        fields = ['id', 'item', 'quantity', 'unit_price',]


class SellRetrieveSerializer(serializers.ModelSerializer):
    details = SellDRetriveSerializer(many=True, read_only=True)

    class Meta:
        model = Sell
        fields = ['id', 'code', 'date', 'details']
