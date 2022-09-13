from rest_framework import generics, permissions, filters
from rest_framework.response import Response
import django_filters.rest_framework
from .models import ItemCategory, Item, Purchase
from .serializers import ItemCategorySerializer, ItemSerializer, PurchaseSerializer, PurchaseWithDetailsReadSerializer, PurchaseWithDetailsSerializer

# Create your views here.

class ItemCategoryList(generics.ListCreateAPIView):
    queryset = ItemCategory.objects.all()
    serializer_class = ItemCategorySerializer
    permission_classes = (permissions.AllowAny, )
    filter_backends = [filters.SearchFilter, django_filters.rest_framework.DjangoFilterBackend]
    search_fields = ['name', 'notes']
    filterset_fields = ['name']


class ItemCategoryDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = ItemCategory.objects.all()
    serializer_class = ItemCategorySerializer


class ItemList(generics.ListCreateAPIView):
    queryset = Item.objects.all()
    serializer_class = ItemSerializer
    permission_classes = (permissions.AllowAny, )
    filter_backends = [filters.SearchFilter, django_filters.rest_framework.DjangoFilterBackend]
    search_fields = ['barcode', 'name', 'category__name', 'notes']
    filterset_fields = ['barcode', 'name', 'category__name']


class ItemDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Item.objects.all()
    serializer_class = ItemSerializer


class PurchaseList(generics.ListCreateAPIView):
    queryset = Purchase.objects.prefetch_related('details')
    serializer_class = PurchaseWithDetailsSerializer
    permission_classes = (permissions.AllowAny, )
    filter_backends = [filters.SearchFilter, django_filters.rest_framework.DjangoFilterBackend]
    search_fields = ['code', 'date',]
    filterset_fields = ['code', 'date']

    def list(self, request):
        queryset = self.get_queryset()
        serializer = PurchaseSerializer(queryset, many=True)
        return Response(serializer.data)


class PurchaseDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Purchase.objects.all()
    serializer_class = PurchaseWithDetailsSerializer
    permission_classes = (permissions.AllowAny, )

    def get(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = PurchaseWithDetailsReadSerializer(instance)
        return Response(serializer.data)
