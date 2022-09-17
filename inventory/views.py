from rest_framework import generics, permissions, filters
from rest_framework.response import Response
import django_filters.rest_framework
from .models import ItemCategory, Item, Purchase, Sales
from .serializers import ItemCategorySerializer, ItemSerializer, PurchaseListSerializer, PurchaseRetrieveSerializer, PurchaseCreateUpdateSerializer, SalesCreateUpdateSerializer, SalesListSerializer, SalesRetrieveSerializer

# Create your views here.

class ItemCategoryList(generics.ListCreateAPIView):
    queryset = ItemCategory.objects.all()
    serializer_class = ItemCategorySerializer
    permission_classes = (permissions.IsAuthenticated, )
    filter_backends = [filters.SearchFilter, django_filters.rest_framework.DjangoFilterBackend]
    search_fields = ['name', 'notes']
    filterset_fields = ['name']


class ItemCategoryDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = ItemCategory.objects.all()
    serializer_class = ItemCategorySerializer


class ItemList(generics.ListCreateAPIView):
    queryset = Item.objects.all()
    serializer_class = ItemSerializer
    permission_classes = (permissions.IsAuthenticated, )
    filter_backends = [filters.SearchFilter, django_filters.rest_framework.DjangoFilterBackend]
    search_fields = ['barcode', 'name', 'category__name', 'notes']
    filterset_fields = ['barcode', 'name', 'category__name']


class ItemDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Item.objects.all()
    serializer_class = ItemSerializer


class PurchaseList(generics.ListCreateAPIView):
    queryset = Purchase.objects.prefetch_related('details')
    # permission_classes = (permissions.IsAuthenticated, )
    filter_backends = [filters.SearchFilter, django_filters.rest_framework.DjangoFilterBackend]
    search_fields = ['code', 'date', 'supplier']
    filterset_fields = ['code', 'date', 'supplier']

    def get_serializer_class(self):
        if self.request.method == "GET":
            return PurchaseListSerializer
        return PurchaseCreateUpdateSerializer


class PurchaseDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Purchase.objects.all()
    # permission_classes = (permissions.IsAuthenticated, )

    def get_serializer_class(self):
        if self.request.method == "GET":
            return PurchaseRetrieveSerializer
        return PurchaseCreateUpdateSerializer


class SalesList(generics.ListCreateAPIView):
    queryset = Sales.objects.prefetch_related('details')
    # permission_classes = (permissions.IsAuthenticated, )
    filter_backends = [filters.SearchFilter, django_filters.rest_framework.DjangoFilterBackend]
    search_fields = ['code', 'date', 'customer']
    filterset_fields = ['code', 'date', 'customer']

    def get_serializer_class(self):
        if self.request.method == "GET":
            return SalesListSerializer
        return SalesCreateUpdateSerializer


class SalesDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Sales.objects.all()
    # permission_classes = (permissions.IsAuthenticated, )

    def get_serializer_class(self):
        if self.request.method == "GET":
            return SalesRetrieveSerializer
        return SalesCreateUpdateSerializer
