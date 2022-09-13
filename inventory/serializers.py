from wsgiref import validate
from rest_framework import serializers
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


class PurchaseDSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(required=False)
    item = serializers.PrimaryKeyRelatedField(
        queryset=Item.objects.all(),
    )

    class Meta:
        model = PurchaseD
        fields = ['id', 'item', 'quantity', 'unit_price',]        


class PurchaseDWithItemSerializer(serializers.ModelSerializer):
    
    item = ItemSerializer(read_only=True)

    class Meta:
        model = PurchaseD
        fields = ['id', 'item', 'quantity', 'unit_price',]


class PurchaseSerializer(serializers.ModelSerializer):

    class Meta:
        model = Purchase
        fields = ['id', 'code', 'date']


class PurchaseWithDetailsSerializer(serializers.ModelSerializer):
    details = PurchaseDSerializer(many=True)

    class Meta:
        model = Purchase
        fields = ['id', 'code', 'date', 'details']

    def create(self, validated_data):
        details_data = validated_data.pop('details')
        purchase = Purchase.objects.create(**validated_data)
        for row in details_data:            
            PurchaseD.objects.create(purchase=purchase, **row)
        return purchase

    def update(self, instance, validated_data):
        print('update: ', repr(validated_data))
        details_data = validated_data.pop('details')

        for key, value in validated_data.items():
            setattr(instance, key, value)

        existing_rows = {
            row.id: row
            for row in PurchaseD.objects.filter(purchase=instance).all()
        }
        
        for row in details_data:
            if 'id' in row:
                # if row['id'] not in existing_rows:
                #     raise ValueError('id {} is not valid'.format(row['id']))
                purchase_d = existing_rows.pop(row['id'])
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


class PurchaseWithDetailsReadSerializer(serializers.ModelSerializer):
    details = PurchaseDWithItemSerializer(many=True, read_only=True)

    class Meta:
        model = Purchase
        fields = ['id', 'code', 'date', 'details']
