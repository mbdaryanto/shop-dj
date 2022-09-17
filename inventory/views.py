from rest_framework import generics, permissions, filters
from rest_framework.response import Response
import django_filters.rest_framework
from .models import ItemCategory, Item, Purchase, Sell
from .serializers import ItemCategorySerializer, ItemSerializer, PurchaseListSerializer, PurchaseRetrieveSerializer, PurchaseCreateUpdateSerializer, SellCreateUpdateSerializer, SellListSerializer, SellRetrieveSerializer

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
    # serializer_class = PurchaseCreateUpdateSerializer
    permission_classes = (permissions.IsAuthenticated, )
    filter_backends = [filters.SearchFilter, django_filters.rest_framework.DjangoFilterBackend]
    search_fields = ['code', 'date',]
    filterset_fields = ['code', 'date']

    def get_serializer_class(self):
        if self.request.method == "GET":
            return PurchaseListSerializer
        return PurchaseCreateUpdateSerializer
        # elif self.request.method == "POST":
        #     return PurchaseCreateUpdateSerializer
        # return super().get_serializer_class()

    # def list(self, request):
    #     queryset = self.filter_queryset(self.get_queryset())

    #     page = self.paginate_queryset(queryset)
    #     if page is not None:
    #         serializer = PurchaseListSerializer(page, many=True)
    #         return self.get_paginated_response(serializer.data)

    #     serializer = PurchaseListSerializer(queryset, many=True)
    #     return Response(serializer.data)


class PurchaseDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Purchase.objects.all()
    # serializer_class = PurchaseCreateUpdateSerializer
    permission_classes = (permissions.IsAuthenticated, )

    def get_serializer_class(self):
        if self.request.method == "GET":
            return PurchaseRetrieveSerializer
        return PurchaseCreateUpdateSerializer

    # def get(self, request, *args, **kwargs):
    #     instance = self.get_object()
    #     serializer = PurchaseRetrieveSerializer(instance)
    #     return Response(serializer.data)


class SellList(generics.ListCreateAPIView):
    queryset = Sell.objects.prefetch_related('details')
    # serializer_class = SellCreateUpdateSerializer
    permission_classes = (permissions.IsAuthenticated, )
    filter_backends = [filters.SearchFilter, django_filters.rest_framework.DjangoFilterBackend]
    search_fields = ['code', 'date',]
    filterset_fields = ['code', 'date']

    def get_serializer_class(self):
        if self.request.method == "GET":
            return SellListSerializer
        return SellCreateUpdateSerializer

    # def list(self, request):
    #     queryset = self.get_queryset()
    #     serializer = SellListSerializer(queryset, many=True)
    #     return Response(serializer.data)


class SellDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Sell.objects.all()
    # serializer_class = SellCreateUpdateSerializer
    permission_classes = (permissions.IsAuthenticated, )

    def get_serializer_class(self):
        if self.request.method == "GET":
            return SellRetrieveSerializer
        return SellCreateUpdateSerializer

    # def get(self, request, *args, **kwargs):
    #     instance = self.get_object()
    #     serializer = SellRetriveSerializer(instance)
    #     return Response(serializer.data)
