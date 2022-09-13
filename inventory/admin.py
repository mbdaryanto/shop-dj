from django.contrib import admin
from .models import ItemCategory, Item

# Register your models here.

class ItemCategoryAdmin(admin.ModelAdmin):
    list_display = ('name',)


class ItemAdmin(admin.ModelAdmin):
    list_display = ('barcode', 'name', 'unit_price', 'category',)
    search_fields = ('barcode', 'name', 'unit_price', 'category__name',)


admin.site.register(ItemCategory, ItemCategoryAdmin)
admin.site.register(Item, ItemAdmin)