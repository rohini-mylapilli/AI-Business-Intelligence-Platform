from django.urls import path
from .views import DailyReportListCreateView, DailyReportDetailView

urlpatterns = [
    path('', DailyReportListCreateView.as_view()),
    path('<int:pk>/', DailyReportDetailView.as_view()),
]