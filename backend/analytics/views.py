from rest_framework.views import APIView
from rest_framework.response import Response
from .permissions import IsAdminOrManager
from sales.models import Sale
from products.models import Product
from django.db.models import Sum
from django.utils import timezone

class AnalyticsDashboardView(APIView):
    permission_classes = [IsAdminOrManager]
    def get(self, request):
        total_sales = Sale.objects.aggregate(total=Sum('total_amount'))['total'] or 0
        total_products = Product.objects.count()
        total_products_sold = Sale.objects.aggregate(total=Sum('quantity'))['total'] or 0
        today = timezone.now().date()
        today_sales = Sale.objects.filter(sale_date=today).aggregate(total=Sum('total_amount'))['total'] or 0
        monthly_sales = Sale.objects.filter(sale_date__year=today.year,sale_date__month=today.month).aggregate(total=Sum('total_amount'))['total'] or 0
        total_revenue = Sale.objects.aggregate(total=Sum('total_amount'))['total'] or 0
        top_products = (Sale.objects.values('product__name').annotate(quantity_sold=Sum('quantity')).order_by('-quantity_sold')[:5])

        return Response({
            "total_sales": float(total_sales),
            "total_products": total_products,
            "total_products_sold": int(total_products_sold),
            "total_revenue": float(total_revenue),
            "today_sales": float(today_sales),
            "today_sales": float(monthly_sales),
            "monthly_sales": float(monthly_sales),
            "top_selling_products": list(top_products)     
        })