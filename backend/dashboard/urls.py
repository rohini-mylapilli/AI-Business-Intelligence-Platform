from django.urls import path, include
from .views import ( DashboardView, SalesByCategoryView, 
                    TopSellingProductsView, SalesTrendView)

urlpatterns = [
    path('', DashboardView.as_view()),
    path('sales-by-category/', SalesByCategoryView.as_view()),
    path('top-selling-products/', TopSellingProductsView.as_view()),
    path('sales-trend/', SalesTrendView.as_view()),
]