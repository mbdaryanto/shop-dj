from django.urls import path
from rest_framework.urlpatterns import format_suffix_patterns
from . import views

urlpatterns = [
    path('categories/', views.ItemCategoryList.as_view()),
    path('categories/<int:pk>/', views.ItemCategoryDetail.as_view()),
    path('items/', views.ItemList.as_view()),
    path('items/<int:pk>/', views.ItemDetail.as_view()),
    path('purchase/', views.PurchaseList.as_view()),
    path('purchase/<int:pk>/', views.PurchaseDetail.as_view()),
]

urlpatterns = format_suffix_patterns(urlpatterns)
