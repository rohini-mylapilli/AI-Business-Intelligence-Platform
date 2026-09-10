from django.urls import path
from .views import SaleListCreateView, SaleDetailView
from .views import SalesPredictionView

urlpatterns = [
    path('', SaleListCreateView.as_view(), name='sale-list-created'),
    path('<int:pk>/', SaleDetailView.as_view(), name='sale-detail'),
    path('predict/', SalesPredictionView.as_view(), name='sales-prediction'),
]